/*
 * This file configures the axios HTTP client
 */
import axios from 'axios'

// Create Axios client for handling HTTP requests
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

// Before each request, add auth token to HTTP headers
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

// After each response, handle errors
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
