const BASE_URL = '/api/cms';

export const api = {
    // 1. 전체 커리큘럼 트리 조회
    getCurriculum: async () => {
        try {
            const response = await fetch(`${BASE_URL}/curriculum`);
            if (!response.ok) {
                throw new Error('Failed to fetch curriculum');
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // 2. 개념별 문제 목록 조회
    getProblems: async (cptId) => {
        try {
            const response = await fetch(`${BASE_URL}/r1/${cptId}/problems`);
            if (!response.ok) {
                throw new Error('Failed to fetch problems');
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // 3. 노드 이동 (나중에 구현)
    moveNode: async (nodeId, newParentId, newOrder) => {
        try {
            const response = await fetch(`${BASE_URL}/node/move`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodeId, newParentId, newOrder })
            });
            if (!response.ok) throw new Error('Failed to move node');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // 4. 문제 순서 변경 (나중에 구현)
    reorderProblems: async (cptId, newPrbIds) => {
        try {
            const response = await fetch(`${BASE_URL}/r1/${cptId}/problems/reorder`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPrbIds })
            });
            if (!response.ok) throw new Error('Failed to reorder problems');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // 5. 문제 수정
    updateProblem: async (prbId, updateData) => {
        try {
            const isFormData = updateData instanceof FormData;
            const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
            const body = isFormData ? updateData : JSON.stringify(updateData);

            const response = await fetch(`${BASE_URL}/problem/${prbId}`, {
                method: 'PUT',
                headers: headers,
                body: body
            });
            if (!response.ok) throw new Error('Failed to update problem');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // 6. 미분류 문제 목록 조회
    getUnlinkedProblems: async (limit) => {
        try {
            const query = limit ? `?limit=${limit}` : '';
            const response = await fetch(`${BASE_URL}/problems/unlinked${query}`);
            if (!response.ok) throw new Error('Failed to fetch unlinked problems');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // 7. 문제 추가
    createProblem: async (data) => {
        try {
            const response = await fetch(`${BASE_URL}/problems`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create problem');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // 8. 노드 추가
    createNode: async (type, title, parentId) => {
        try {
            const response = await fetch(`${BASE_URL}/nodes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, title, parentId })
            });
            if (!response.ok) throw new Error('Failed to create node');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // 9. 노드 이동
    moveNode: async (nodeId, type, newParentId) => {
        try {
            const response = await fetch(`${BASE_URL}/nodes/move`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodeId, type, newParentId })
            });
            if (!response.ok) throw new Error('Failed to move node');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // 10. 노드 수정 (이름 변경)
    updateNode: async (id, type, title) => {
        try {
            const response = await fetch(`${BASE_URL}/nodes`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, type, title })
            });
            if (!response.ok) throw new Error('Failed to update node');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // 11. 노드 순서 변경
    swapOrder: async (id1, id2, type) => {
        try {
            const response = await fetch(`${BASE_URL}/nodes/reorder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id1, id2, type })
            });
            if (!response.ok) throw new Error('Failed to swap node order');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};
