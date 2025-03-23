//apiUserClient.jsx
import axios from "axios";

const apiUserClient = axios.create({
  baseURL: "http://127.0.0.1:8061",
});

export default apiUserClient;
