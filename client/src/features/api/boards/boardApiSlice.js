// src/features/api/boards/boardApiSlice.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setToken } from "../../auth/authSlice";

const boardBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const boardBaseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await boardBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401 && !args._retry) {
    args._retry = true;
    console.warn("Board API received 401, attempting token refresh");

    const refreshResult = await boardBaseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        body: { refreshToken: api.getState().auth.refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newToken = refreshResult.data.token;
      const newRefreshToken = refreshResult.data.refreshToken;

      api.dispatch(
        setToken({ token: newToken, refreshToken: newRefreshToken })
      );

      result = await boardBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      // Navigate işlemini komponentlerde yapın
    }
  }

  return result;
};

export const boardApiSlice = createApi({
  reducerPath: "boardApi",
  baseQuery: boardBaseQueryWithReauth,
  tagTypes: ["Board"],
  endpoints: (builder) => ({
    // Board ile ilgili endpoint'ler...
  }),
});

// Export edilen hook'lar
// export const { } = boardApiSlice;
