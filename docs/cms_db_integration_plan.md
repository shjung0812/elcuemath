# Math CMS 및 레거시 DB 통합 계획

이 문서는 기존 데이터베이스 스키마를 변경하지 않고, Math CMS 프론트엔드(React)를 레거시 MySQL 데이터베이스와 연동하기 위한 상세 계획입니다.

## 1. 스키마 매핑 (Schema Mapping)

CMS의 개념적 구조(과목-단원-개념)와 기존 DB 테이블을 다음과 같이 1:1로 매핑합니다.

| CMS 개념 | 기존 테이블명 | 주요 컬럼 |
| :--- | :--- | :--- |
| **R3 (과목)** | `r3list` | `r3id` (ID), `listinfo` (제목), `r3order` (정렬) |
| **R2 (대단원)** | `r2list` | `r2id` (ID), `r2listinfo` (제목), `r2order` |
| **R1 (개념)** | `cptproblemset` | `cptid` (ID), `listinfo` (제목), `prblist` (문제 목록 CSV) |
| **연결 관계** | `rkconnect` | `parentcol` (부모ID), `childcol` (자식ID), `conkind`, `rkorder` |
| **문제** | `prb` | `prbid` (ID), `prbkorean` (문제 내용) |

### ⚠️ 중요: CSV 포맷에 대한 설명
**`cptproblemset` 테이블의 `prblist` 컬럼**은 일반적인 RDB의 조인 테이블 방식이 아니라, **"쉼표로 구분된 문자열(CSV)"** 형태로 데이터를 저장하고 있습니다.

*   **저장 예시**: `"1001, 1002, 1005"` (문자열 하나에 문제 ID가 다 들어있음)
*   **개발 시 주의사항**: 문제 목록을 조회하거나 수정할 때, 반드시 애플리케이션 레벨(Node.js)에서 이 문자열을 **분해(Parsing)**하거나 **재조립(Stringify)**하는 과정이 필요합니다.
    *   **조회**: `"1,2,3"` -> `[1, 2, 3]` 배열로 변환
    *   **저장**: `[1, 3, 2]` 배열 -> `"1,3,2"` 문자열로 변환

## 2. API 구현 전략 (Implementation Strategy)

`/api/cms/...` 하위의 새로운 API 엔드포인트를 구현하여 처리합니다.

### 2.1. 전체 트리 조회 (`GET /api/cms/curriculum`)
`rkconnect` 테이블의 구조가 복잡하므로, SQL 조인 대신 **"전체 조회 후 메모리 조립(Fetch All and Assemble)"** 방식을 사용합니다.

**로직 흐름:**
1.  `R3List`, `R2List`, `CptProblemSet(R1)`, `RkConnect` 테이블을 각각 전체 조회합니다.
2.  **Node.js 메모리 상에서 조립**:
    *   `conkind == 'rc32'`인 `RkConnect` 데이터를 이용해 **R3-R2** 관계를 연결합니다.
    *   `conkind == 'rc21'`인 `RkConnect` 데이터를 이용해 **R2-R1** 관계를 연결합니다.
    *   각 단계에서 `rkorder`를 기준으로 정렬합니다.
3.  완성된 JSON 트리를 클라이언트에 반환합니다.

### 2.2. 노드 이동 및 순서 변경 (`PATCH /api/cms/node/move`)
**R2 (대단원) 이동 예시**:
1.  `RkConnect` 테이블에서 `childcol == 대상_ID` 이고 `conkind == 'rc32'`인 행을 찾습니다.
2.  **부모 변경 시**: `parentcol`을 새로운 R3 ID로 업데이트합니다.
3.  **순서 변경 시**: 형제 노드들의 `rkorder` 값을 재계산하여 업데이트합니다.

**R1 (개념) 이동**도 동일한 로직(`conkind == 'rc21'`)을 사용합니다.

### 2.3. 문제 관리 (Problem Management)

**개념별 문제 목록 조회 (`GET /api/cms/r1/:id/problems`)**:
1.  `cptid`로 `CptProblemSet`을 조회합니다.
2.  `prblist` 컬럼의 문자열(CSV)을 쉼표(`,`)로 쪼개서 ID 배열을 만듭니다.
3.  `Prb` 테이블에서 해당 ID들에 해당하는 문제들을 조회합니다 (`WHERE prbid IN (...)`).
4.  CSV에 저장된 순서대로 문제들을 정렬하여 반환합니다.

**문제 순서 변경 (`PATCH /api/cms/r1/:id/problems/reorder`)**:
1.  클라이언트로부터 새로운 문제 ID 순서 배열을 받습니다 (예: `[1005, 1001, 1002]`).
2.  배열을 쉼표로 연결하여 문자열로 만듭니다 (예: `"1005,1001,1002"`).
3.  `CptProblemSet` 테이블의 `prblist` 컬럼을 이 문자열로 업데이트합니다.

## 3. 구현 단계 (Implementation Steps)

### Phase 1: 백엔드 서비스 계층 (`backend/service/cmsService.js`)
- [ ] `getCurriculumTree()`: 데이터 조립 로직 구현
- [ ] `getProblems(r1_id)`: CSV 파싱 및 문제 조회 로직 구현
- [ ] `moveNode(...)`: `RkConnect` 업데이트 로직 구현
- [ ] `updateProblemList(r1_id, new_ids)`: CSV 변환 및 업데이트 로직 구현

### Phase 2: 백엔드 컨트롤러 & 라우터
- [ ] `backend/controllers/cmsController.js` 생성
- [ ] `backend/routes/cms.js` 라우터 정의
- [ ] `cdctapp.js`에 라우터 등록

### Phase 3: 프론트엔드 연동
- [ ] `src/cms/api.js` 업데이트 (새 API 호출)
- [ ] ID 타입을 정수형(Integer)에서 문자열(String)로 처리하도록 프론트엔드 로직 수정

## 4. 파일 구조 변경안
*   `backend/service/cmsService.js` (신규)
*   `backend/controllers/cmsController.js` (신규)
*   `backend/routes/cms.js` (신규)
