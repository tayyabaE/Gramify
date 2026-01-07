import axios from 'axios'
const baseURL = import.meta.env.VITE_NODE_URL

const AxiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${token}`, // if needed
  },
  withCredentials: true, // optional: for cookies
});

export default AxiosInstance