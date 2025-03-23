// src/components/Dasheader.jsx

import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice"; // Redux action for logging out

export default function Dashheader() {
  const { userInfo } = useSelector((state) => state.auth); // Get userInfo from Redux store

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    dispatch(logout()); // Clear user info from Redux store

    // Remove tokens and user info from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between max-w-7xl mx-auto h-[10vh] bg-blue-100 rounded-lg shadow-lg px-5 mb-4 text-black">
      <p className="text-xl font-bold">
        Hello,{" "}
        {userInfo ? (
          <Link to="/dashboard/profile" className="text-red-700 no-underline">
            {userInfo.username} {/* Show user's name */}
          </Link>
        ) : (
          "Guest"
        )}
      </p>
      {userInfo && (
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-semibold text-center p-2 rounded-full w-[100px] transition transform hover:scale-110"
          onClick={logoutHandler}
        >
          Log Out
        </button>
      )}
    </div>
  );
}
