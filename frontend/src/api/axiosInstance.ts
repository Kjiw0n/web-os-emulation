import axios from "axios";

const isLocal = window.location.hostname === "localhost";

// HTTP API용 URL
const baseURL = isLocal
  ? "http://localhost:3000/api"
  : "https://web01os.duckdns.org/api";

// WebSocket용 URL
export const WS_BASE_URL = isLocal
  ? "ws://localhost:3000"
  : "wss://web01os.duckdns.org";

const api = axios.create({
  baseURL,
  timeout: 5000,
});

export default api;
