/*
 * This file configures the axios HTTP client
 */
import axios from 'axios'

// Use VITE_BACKEND_URL is provided. Otherwise, default to local API
let backend_url = import.meta.env.VITE_BACKEND_URL
if (!backend_url) {
    backend_url = "http://127.0.0.1:8000"
}

// Create Axios client
const api = axios.create({
    baseURL: backend_url,
    headers: {
        "Content-Type": "application/json",
    },
})

export default api