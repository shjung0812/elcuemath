# Math CMS 백엔드 통합 가이드

이 문서는 React 프론트엔드(Math CMS)와 백엔드 서버를 연동하기 위한 전략과 명세를 설명합니다.

## 1. 시스템 아키텍처 개요

현재 프론트엔드는 `mockData.js`를 이용한 **로컬 메모리(Context API + useReducer)** 방식으로 작동하고 있습니다.
실제 서비스를 위해서는 데이터의 "Source of Truth(진실의 원천)"를 클라이언트에서 서버로 옮기고, 프론트엔드가 이를 동기화하도록 변경해야 합니다.

```
[React Frontend]  <-- (JSON / REST API) -->  [Backend Server]  <-- (SQL) -->  [Database]
```

## 2. 데이터베이스 스키마 설계 (제안)

계층 구조(R3 -> R2 -> R1)와 문제(Problem)의 다대다 관계를 반영하여 데이터베이스를 설계해야 합니다. 특히 순서 변경 기능을 위해 `order` 컬럼이 필수적입니다.

### 테이블 명세
*   **`curriculum_r3`** (과목)
    *   `id` (PK)
    *   `title` (문자열)
    *   `order` (정수): 정렬 순서
*   **`curriculum_r2`** (대단원)
    *   `id` (PK)
    *   `title` (문자열)
    *   `r3_id` (FK): 부모 과목 ID
    *   `order` (정수)
*   **`curriculum_r1`** (개념)
    *   `id` (PK)
    *   `title` (문자열)
    *   `r2_id` (FK): 부모 단원 ID
    *   `order` (정수)
*   **`problems`** (문제)
    *   `id` (PK)
    *   `content` (텍스트): HTML 또는 JSON
    *   ...
*   **`r1_problem_links`** (관계 테이블)
    *   `r1_id` (FK)
    *   `problem_id` (FK)
    *   `order` (정수): 개념 내에서의 문제 정렬 순서

## 3. API 엔드포인트 명세

### 계층 구조 조작 (이동 및 순서 변경)
가장 복잡한 로직이 필요한 부분입니다.

| 메서드 | 엔드포인트 | 목적 | 요청 본문 (JSON) |
| :--- | :--- | :--- | :--- |
| `PATCH` | `/api/nodes/:type/:id/move` | **부모 변경** (다른 단원/과목으로 이동) | `{ new_parent_id, new_order }` |
| `PATCH` | `/api/nodes/:type/:id/reorder` | **순서 변경** (같은 부모 내 순서) | `{ new_order }` 또는 `{ target_index }` |
| `PATCH` | `/api/links/reorder` | **문제 순서 변경** | `{ r1_id, problem_id, new_order }` |

### 커리큘럼 데이터 (일반 CRUD)
| 메서드 | 엔드포인트 | 목적 | 요청 본문 (JSON) |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/curriculum` | 전체 트리 데이터 조회 | - |
| `POST` | `/api/r3` | 과목 생성 | `{ title, order }` |
| `POST` | `/api/r2` | 단원 생성 | `{ title, r3_id }` |
| `POST` | `/api/r1` | 개념 생성 | `{ title, r2_id }` |
| `PATCH` | `/api/nodes/:type/:id` | 노드 수정 (이름 등) | `{ title }` |
| `DELETE` | `/api/nodes/:type/:id` | 노드 삭제 | - |

*(참고: :type은 'r3', 'r2', 'r1' 중 하나)*

### 문제(Problem) 관리
| 메서드 | 엔드포인트 | 목적 | 요청 본문 (JSON) |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/r1/:id/problems` | 특정 개념의 문제 목록 조회 | - |
| `POST` | `/api/problems` | 새 문제 생성 | `{ content, answer, solution, r1_id }` |
| `POST` | `/api/links` | 기존 문제 연결 | `{ problem_id, r1_id }` |
| `DELETE` | `/api/links` | 문제 연결 해제 | `{ problem_id, r1_id }` |
| `DELETE` | `/api/problems/:id` | 문제 영구 삭제 | - |

## 4. 프론트엔드 통합 가이드

`src/cms/store.jsx`를 수정하여 동기식 상태 업데이트를 비동기 API 호출로 대체해야 합니다.

### 1단계: API 클라이언트 작성
`src/cms/api.js` (또는 유틸리티)를 생성하여 통신 로직을 분리합니다.
```javascript
export const fetchCurriculum = async () => {
  const res = await fetch('/api/curriculum');
  return res.json();
};
export const moveNode = async (type, id, newParentId) => { ... };
```

### 2단계: `store.jsx` 수정 (비동기 액션)
기존의 순수 `dispatch` 대신 비동기 함수를 통해 데이터를 처리하고 상태를 업데이트해야 합니다.
**권장 흐름 (Optimistic UI):**
1.  **낙관적 업데이트**: UI를 먼저 즉시 반영 (사용자 경험 향상)
2.  **API 요청**: 백엔드에 변경 사항 전송
3.  **실패 시 롤백**: 에러 발생하면 원래 상태로 복구

```javascript
// 예시: 개념 추가 액션
const addR1 = async (title, r2_id) => {
    // 1. 임시 ID로 UI 先반영
    const tempId = 'temp-' + Date.now();
    dispatch({ type: ACTIONS.ADD_R1, payload: { id: tempId, title, r2_id } });

    // 2. 서버 요청
    try {
        const serverData = await api.createNode('r1', { title, r2_id });
        // 3. 실제 ID로 교체
        dispatch({ type: ACTIONS.REPLACE_ID, payload: { oldId: tempId, newId: serverData.id } });
    } catch (err) {
        // 실패 시 삭제 처리 (롤백)
        alert('저장 실패!');
        dispatch({ type: ACTIONS.DELETE_NODE, payload: { id: tempId, type: 'r1' } });
    }
};
```

### 3단계: 초기 데이터 로드 (`MathCMS.jsx`)
`useEffect`를 사용하여 컴포넌트 마운트 시 전체 데이터를 가져옵니다.
```javascript
useEffect(() => {
    async function load() {
        const data = await api.fetchCurriculum();
        dispatch({ type: ACTIONS.INIT_DATA, payload: data });
    }
    load();
}, []);
```

## 5. 개발 팁
*   **Proxy 설정**: 개발 중 CORS 문제를 피하기 위해 `vite.config.js`에 프록시를 설정하세요.
    ```javascript
    server: {
      proxy: {
        '/api': 'http://localhost:3000'
      }
    }
    ```
*   **MSW 활용**: 백엔드가 완성되기 전이라면, **MSW (Mock Service Worker)**를 도입하여 프론트엔드에서 API 요청을 가로채고 `mockData`를 반환하도록 하면 백엔드 없이도 통합 코드를 미리 작성할 수 있습니다.
