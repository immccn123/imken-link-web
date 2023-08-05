import axios from "axios";
import { useAppStore } from "./store/app";

const store = useAppStore()

var api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "",
  timeout: 3000,
  headers: {
    'Authorization': 'Bearer ' + store.userToken,
    "Content-Type": 'application/x-www-form-urlencoded'
  }
});

const rebuildAPI = () => {
  api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || "",
    timeout: 3000,
    headers: {
      'Authorization': 'Bearer ' + store.userToken,
      "Content-Type": 'application/x-www-form-urlencoded'
    }
  });
}

export { api, rebuildAPI }
