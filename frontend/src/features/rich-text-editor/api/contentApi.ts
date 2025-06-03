// features/rich-text-editor/api/contentApi.ts
import { fetchWithOutCSRF } from "../../../common/utils/requests"; // 공통 요청 유틸리티 임포트
import {
  FetchSuccessResponse,
  SaveContentOptions,
} from "../../../common/types/commonTypes";
import { MyDeltaType } from "../types/editorTypes"; // 에디터 타입 임포트

export const fetchContentsApi = async (): Promise<FetchSuccessResponse> => {
  try {
    const result: FetchSuccessResponse = (await fetchWithOutCSRF({
      url: "/contents/getwriting",
      method: "get",
    })) as FetchSuccessResponse;
    return result;
  } catch (error: any) {
    console.error("API: 콘텐츠 불러오기 실패:", error);
    return {
      success: false,
      message: "네트워크 오류로 콘텐츠를 불러올 수 없습니다.",
    };
  }
};

export const saveContentApi = async ({
  title,
  delta,
  editingContentId,
  isCreate,
}: SaveContentOptions): Promise<FetchSuccessResponse> => {
  const requestBody = {
    title: title,
    delta: delta, // Delta는 JSON stringify될 수 있음
  };

  try {
    let response: Response | FetchSuccessResponse;

    if (editingContentId && !isCreate) {
      response = await fetchWithOutCSRF({
        url: `/contents/handlesavedelta/${editingContentId}`,
        method: "put",
        body: requestBody,
      });
    } else {
      response = await fetchWithOutCSRF({
        url: "/contents/savewriting",
        method: "post",
        body: requestBody,
      });
    }

    if (response instanceof Response) {
      const result = await response.json();
      if (response.ok) {
        return {
          success: true,
          message: `Delta 데이터가 성공적으로 ${
            editingContentId ? "업데이트" : "저장"
          }되었습니다.`,
          data: result,
        };
      } else {
        return {
          success: false,
          message: result.message || response.statusText,
          data: result,
        };
      }
    } else if ("success" in response) {
      return response; // 이미 FetchSuccessResponse 타입인 경우 바로 반환
    } else {
      return {
        success: false,
        message: "알 수 없는 응답 형식",
        data: response,
      };
    }
  } catch (error: any) {
    console.error("API: Delta 데이터 저장/업데이트 중 오류 발생:", error);
    return {
      success: false,
      message: "Delta 데이터 저장/업데이트 중 네트워크 오류가 발생했습니다.",
    };
  }
};

export const deleteContentApi = async (
  id: string | number
): Promise<FetchSuccessResponse> => {
  try {
    const response = await fetchWithOutCSRF({
      url: `/contents/deletewriting/${id}`,
      method: "delete",
    });

    if (response instanceof Response && response.ok) {
      return { success: true, message: "콘텐츠가 성공적으로 삭제되었습니다." };
    } else if ("success" in response && response.success) {
      return response;
    } else {
      const errorData =
        response instanceof Response ? await response.json() : response;
      return {
        success: false,
        message:
          errorData.message ||
          (response instanceof Response
            ? response.statusText
            : "알 수 없는 오류"),
        data: errorData,
      };
    }
  } catch (error: any) {
    console.error("API: 콘텐츠 삭제 중 오류 발생:", error);
    return {
      success: false,
      message: "콘텐츠 삭제 중 네트워크 오류가 발생했습니다.",
    };
  }
};
