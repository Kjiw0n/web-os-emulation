import axios from "axios";

const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://web01os.duckdns.org";

const api = axios.create({
  baseURL,
  timeout: 5000,
});

export default api;
