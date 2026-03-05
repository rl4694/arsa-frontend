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

// request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response){
            console.error(
                `API Error ${error.response.status}:`,
                error.response.data
            )
        }
        else if (error.request){
            console.error("Network error - Server Unreachable")
        }
        else{
            console.error("Unexpected error:", error.message)
        }

        return Promise.reject(error)
    }
)

export default api