import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";

// Define the expected error response structure
interface ApiErrorResponse {
  message: string;
  statusCode?: number;
}

if (!import.meta.env.VITE_API_URL) {
  console.warn("VITE_API_URL not set, using default: http://localhost:3000");
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add operator key from localStorage if available
api.interceptors.request.use((config) => {
  const operatorKey = localStorage.getItem("operatorKey");
  if (operatorKey) {
    config.headers["x-operator-key"] = operatorKey;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // Safe type assertion since we know the structure
    const errorResponse = error.response?.data as ApiErrorResponse | undefined;
    const message =
      errorResponse?.message || error.message || "An error occurred";

    // Don't show toast for 401 errors (handle those in auth logic)
    if (error.response?.status !== 401) {
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
