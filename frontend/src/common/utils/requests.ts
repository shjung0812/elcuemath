// common/utils/requests.ts

import { RequestOptions } from "../types/commonTypes";
import { FetchSuccessResponse } from "../types/commonTypes";
export async function fetchWithOutCSRF({
  url,
  method,
  body,
  headers,
}: RequestOptions): Promise<Response | FetchSuccessResponse> {
  const config: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(url, config);

    // 여기서는 응답이 FetchSuccessResponse 형식일 것이라고 가정하고 바로 파싱
    // 실제로는 response.ok 체크 후 .json() 파싱하여 FetchSuccessResponse 형식으로 변환하는 로직이 필요할 수 있습니다.
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || response.statusText,
        data: errorData,
      };
    }
    const data = await response.json();
    return { success: true, data: data, message: "Request successful" };
  } catch (error: any) {
    console.error(`Error during ${method} request to ${url}:`, error);
    return { success: false, message: `Network error: ${error.message}` };
  }
}
