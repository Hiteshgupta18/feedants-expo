import axios from 'axios';

// Your Mac's local network IP. Run `ipconfig getifaddr en0` to check —
// this can change when reconnecting to WiFi, so update it here whenever
// the app fails to reach the backend.
const LOCAL_IP = '10.2.85.23';
const PORT = 5050;

export const API_BASE_URL = `http://${LOCAL_IP}:${PORT}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
