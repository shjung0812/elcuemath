// common/utils/requests.ts

import { RequestOptions } from "../types/commonTypes";
import { FetchSuccessResponse } from "../types/commonTypes";

export async function fetchWithOutCSRF({
  url, // This 'url' will now be treated as the relative path
  method,
  body,
  headers,
}: RequestOptions): Promise<Response | FetchSuccessResponse> {
  let baseUrl = "";

  // Check if we are in a development environment
  // import.meta.env.DEV is true when running `vite` development server
  if (import.meta.env.DEV) {
    // Append the host from .env.development (e.g., VITE_API_HOST=http://localhost:5000)
    baseUrl = import.meta.env.VITE_API_HOST || ""; // Use empty string if VITE_API_HOST is not defined
  }
  // In production (import.meta.env.PROD is true), baseUrl will remain an empty string,
  // making the final URL relative to the current host.

  const fullUrl = `${baseUrl}${url}`; // Construct the full URL

  const config: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(fullUrl, config); // Use the constructed fullUrl

    if (!response.ok) {
      const errorData = await response.json(); // Attempt to parse error data
      return {
        success: false,
        message:
          errorData.message ||
          response.statusText ||
          "An unknown error occurred",
        data: errorData,
      };
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error during ${method} request to ${fullUrl}:`, error); // Log the fullUrl for debugging
    return { success: false, message: `Network error: ${error.message}` };
  }
}
