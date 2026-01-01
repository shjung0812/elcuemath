export const initialData = {
    // R3: Grandparents (Subject/Grade Level)
    r3: {
        "r3-1": { id: "r3-1", title: "고등 수학 (상)", order: 1 },
        "r3-2": { id: "r3-2", title: "고등 수학 (하)", order: 2 },
        "r3-3": { id: "r3-3", title: "수학 I", order: 3 },
        "r3-4": { id: "r3-4", title: "수학 II", order: 4 },
        "r3-5": { id: "r3-5", title: "미적분", order: 5 },
        "r3-6": { id: "r3-6", title: "확률과 통계", order: 6 },
    },

    // R2: Parents (Chapters/Units)
    r2: {
        // 고등 수학 (상)
        "r2-1": { id: "r2-1", title: "1. 다항식", r3_id: "r3-1", order: 1 },
        "r2-2": { id: "r2-2", title: "2. 방정식과 부등식", r3_id: "r3-1", order: 2 },
        "r2-3": { id: "r2-3", title: "3. 도형의 방정식", r3_id: "r3-1", order: 3 },

        // 고등 수학 (하)
        "r2-4": { id: "r2-4", title: "1. 집합과 명제", r3_id: "r3-2", order: 1 },
        "r2-5": { id: "r2-5", title: "2. 함수", r3_id: "r3-2", order: 2 },
        "r2-6": { id: "r2-6", title: "3. 순열과 조합", r3_id: "r3-2", order: 3 },

        // 수학 I
        "r2-7": { id: "r2-7", title: "1. 지수함수와 로그함수", r3_id: "r3-3", order: 1 },
        "r2-8": { id: "r2-8", title: "2. 삼각함수", r3_id: "r3-3", order: 2 },
        "r2-9": { id: "r2-9", title: "3. 수열", r3_id: "r3-3", order: 3 },

        // 미분류
        "r2-orphan": { id: "r2-orphan", title: "임시 보관함", r3_id: null, order: 999 },
    },

    // R1: Children (Concepts)
    r1: {
        // 다항식
        "r1-1": { id: "r1-1", title: "다항식의 연산", r2_id: "r2-1", order: 1 },
        "r1-2": { id: "r1-2", title: "나머지정리", r2_id: "r2-1", order: 2 },
        "r1-3": { id: "r1-3", title: "인수분해", r2_id: "r2-1", order: 3 },

        // 방정식과 부등식
        "r1-4": { id: "r1-4", title: "복소수", r2_id: "r2-2", order: 1 },
        "r1-5": { id: "r1-5", title: "이차방정식", r2_id: "r2-2", order: 2 },
        "r1-6": { id: "r1-6", title: "이차방정식과 이차함수", r2_id: "r2-2", order: 3 },
        "r1-7": { id: "r1-7", title: "여러 가지 방정식", r2_id: "r2-2", order: 4 },

        // 도형의 방정식
        "r1-8": { id: "r1-8", title: "평면좌표", r2_id: "r2-3", order: 1 },
        "r1-9": { id: "r1-9", title: "직선의 방정식", r2_id: "r2-3", order: 2 },
        "r1-10": { id: "r1-0", title: "원의 방정식", r2_id: "r2-3", order: 3 },

        // 지수함수와 로그함수
        "r1-11": { id: "r1-11", title: "지수", r2_id: "r2-7", order: 1 },
        "r1-12": { id: "r1-12", title: "로그", r2_id: "r2-7", order: 2 },
        "r1-13": { id: "r1-13", title: "지수함수", r2_id: "r2-7", order: 3 },
        "r1-14": { id: "r1-14", title: "로그함수", r2_id: "r2-7", order: 4 },

        // Orphans
        "r1-orphan-1": { id: "r1-orphan-1", title: "출제 예정 문제 모음", r2_id: null, order: 1 },
        "r1-orphan-2": { id: "r1-orphan-2", title: "검수 필요 개념", r2_id: null, order: 2 },
    },

    // Problems (Questions)
    problems: {
        "p-1": { id: "p-1", content: "<p>다항식 A = x^2 + 1, B = x - 1 일 때, A + B는?</p>" },
        "p-2": { id: "p-2", content: "<p>x^2 - 4x + 4 를 인수분해하시오.</p>" },
        "p-3": { id: "p-3", content: "<p>이차방정식 x^2 - 3x + 2 = 0 의 해는?</p>" },
        "p-4": { id: "p-4", content: "<p>원 x^2 + y^2 = 4 의 반지름의 길이는?</p>" },
        "p-5": { id: "p-5", content: "<p>log_2(8) 의 값을 구하시오.</p>" },
        "p-6": { id: "p-6", content: "<p>다음 중 함수인 것은?</p>" },
        "p-7": { id: "p-7", content: "<p>집합 {1, 2}의 부분집합의 개수는?</p>" },
        "p-orphan": { id: "p-orphan", content: "<p>이 문제는 아직 개념에 연결되지 않았습니다.</p>" }
    },

    // Links: R1 (Concept) <-> Problems (Many-to-Many)
    // Structure: { [r1_id]: [problem_id_1, problem_id_2, ...] }
    r1_problems: {
        "r1-1": ["p-1"],
        "r1-3": ["p-2"],
        "r1-5": ["p-3"],
        "r1-10": ["p-4"],
        "r1-12": ["p-5"],
        "r1-orphan-1": ["p-6", "p-7"]
    }
};
