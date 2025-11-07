import axios from "axios";

const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api"
    : "https://web01os.duckdns.org/api";

const api = axios.create({
  baseURL,
  timeout: 5000,
});

export default api;
