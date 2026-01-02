const { R3List, R2List, CptProblemSet, RkConnect, Prb } = require('../models');
const { Op } = require('sequelize');
const sf = require('../../bin/serverflow');

const cmsService = {
    // 1. 전체 커리큘럼 트리 조회
    getCurriculumTree: async () => {
        try {
            // 모든 데이터 병렬 조회
            const [r3List, r2List, cptList, connects] = await Promise.all([
                R3List.findAll({ order: [['r3order', 'ASC']] }),
                R2List.findAll({ order: [['r2order', 'ASC']] }),
                CptProblemSet.findAll(),
                RkConnect.findAll({ order: [['rkorder', 'ASC']] })
            ]);

            // 데이터 맵핑을 위한 룩업 테이블 생성
            const r3Map = {};
            r3List.forEach(r => {
                r3Map[r.r3id] = { ...r.toJSON(), children: [] };
            });

            const r2Map = {};
            r2List.forEach(r => {
                r2Map[r.r2id] = { ...r.toJSON(), children: [] };
            });

            const cptMap = {};
            cptList.forEach(c => {
                cptMap[c.cptid] = { ...c.toJSON() };
            });

            // RkConnect를 사용하여 트리 구성
            connects.forEach(conn => {
                if (conn.conkind === 'rc32') {
                    // R3 -> R2
                    const r3 = r3Map[conn.parentcol];
                    const r2 = r2Map[conn.childcol];
                    if (r3 && r2) {
                        // rkorder 추가
                        const r2WithOrder = { ...r2, rkorder: conn.rkorder };
                        // Note: r3Map references original objects. We need to push the *copy* with rkorder not the original map entity?
                        // Actually, r2Map[conn.childcol] is the object. R3 children array pushes REFERENCE.
                        // We should modify the r2 object in the map OR push a modified copy.
                        // Since one R2 serves one R3 usually in this hierarchy, modifying the map object is fine.
                        r2.rkorder = conn.rkorder; // Direct mutation of map object
                        r3.children.push(r2);
                    }
                } else if (conn.conkind === 'rc21') {
                    // R2 -> R1 (Concept)
                    const r2 = r2Map[conn.parentcol];
                    const cpt = cptMap[conn.childcol];
                    if (r2 && cpt) {
                        cpt.rkorder = conn.rkorder; // Direct mutation
                        r2.children.push(cpt);
                    }
                }
            });

            // 트리 루트(R3 List) 반환 (children이 채워진 상태)
            // 객체 값들만 배열로 변환
            // 순서 보장을 위해 r3List 순서대로 맵에서 가져옴
            const tree = r3List.map(r => r3Map[r.r3id]);
            return tree;

        } catch (error) {
            console.error('Error in getCurriculumTree:', error);
            throw error;
        }
    },

    // 2. 개념별 문제 목록 조회
    getProblems: async (cptId) => {
        try {
            const cpt = await CptProblemSet.findOne({ where: { cptid: cptId } });
            if (!cpt) {
                throw new Error('Concept not found');
            }

            const prbListStr = cpt.prblist || '';
            const prbIds = prbListStr.split(',').map(s => s.trim()).filter(id => id.length > 0);

            if (prbIds.length === 0) {
                return [];
            }

            const problems = await Prb.findAll({
                where: {
                    prbid: {
                        [Op.in]: prbIds
                    }
                }
            });

            // DB에서 가져온 문제들을 CSV 순서대로 정렬
            const problemMap = {};
            problems.forEach(p => {
                problemMap[p.prbid] = p;
            });

            const orderedProblems = prbIds.map(id => problemMap[id]).filter(p => p !== undefined);
            return orderedProblems;

        } catch (error) {
            console.error('Error in getProblems:', error);
            throw error;
        }
    },

    // 3. 노드 이동 (RkConnect 업데이트)
    moveNode: async (nodeId, newParentId, newOrder) => {
        // 이 부분은 복잡한 로직이 필요할 수 있음 (순서 재조정 등)
        // 일단 단순히 parentcol 업데이트 및 rkorder 업데이트 구현
        // 실제로는 형제 노드들의 순서도 밀어야 함.
        try {
            // 대상 연결 찾기
            const targetConn = await RkConnect.findOne({
                where: { childcol: nodeId }
            });

            if (!targetConn) {
                throw new Error('Connection not found for node: ' + nodeId);
            }

            // 트랜잭션 처리가 권장되지만, 여기서는 간단히 구현
            await targetConn.update({
                parentcol: newParentId,
                rkorder: newOrder
            });

            // If it's an R2 node, also update r2list.r2order to keep legacy sort in sync
            if (nodeId.startsWith('r2id')) {
                await R2List.update({ r2order: newOrder }, {
                    where: { r2id: nodeId }
                });
            }

            return targetConn;

            return targetConn;
        } catch (error) {
            console.error('Error in moveNode:', error);
            throw error;
        }
    },

    // 4. 문제 순서 변경 (CptProblemSet 업데이트)
    updateProblemList: async (cptId, newPrbIds) => {
        try {
            const cpt = await CptProblemSet.findOne({ where: { cptid: cptId } });
            if (!cpt) {
                throw new Error('Concept not found');
            }

            // 배열을 CSV 문자열로 변환
            const newPrbListStr = newPrbIds.join(',');

            await cpt.update({
                prblist: newPrbListStr
            });

            return cpt;
        } catch (error) {
            console.error('Error in updateProblemList:', error);
            throw error;
        }
    },
    /**
     * Update problem details
     */
    updateProblem: async (prbid, updateData) => {
        // Filter allowed fields
        const allowedFields = ['prbkorean', 'prbenglish', 'prbchinese', 'prbmainans', 'prbexplain', 'prbpickor', 'source'];
        const dataToUpdate = {};

        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                dataToUpdate[field] = updateData[field];
            }
        });

        // Perform update
        await Prb.update(dataToUpdate, {
            where: { prbid }
        });

        // Return updated (or existing) record
        return await Prb.findOne({ where: { prbid } });
    },

    // 6. 연결되지 않은 문제 목록 조회 (Unlinked Problems)
    getUnlinkedProblems: async (limit) => {
        try {
            // 1. 모든 CptProblemSet의 prblist 수집
            const allCpts = await CptProblemSet.findAll({ attributes: ['prblist'] });

            const usedIds = new Set();
            allCpts.forEach(cpt => {
                if (cpt.prblist) {
                    cpt.prblist.split(',').forEach(id => {
                        const cleanId = id.trim();
                        if (cleanId) usedIds.add(cleanId);
                    });
                }
            });

            // 2. Prb 테이블에서 사용되지 않은 ID 조회
            // usedIds가 비어있으면 모든 문제 반환, 아니면 NOT IN 검색
            const whereClause = usedIds.size > 0
                ? { prbid: { [Op.notIn]: Array.from(usedIds) } }
                : {};

            const queryOptions = {
                where: whereClause,
                order: [['prbregi', 'DESC']]
            };

            if (limit && limit !== 'all') {
                queryOptions.limit = parseInt(limit, 10);
            }

            const unlinkedProblems = await Prb.findAll(queryOptions);

            return unlinkedProblems;
        } catch (error) {
            console.error('Error in getUnlinkedProblems:', error);
            throw error;
        }
    },

    // 7. 문제 추가
    createProblem: async (data, r1_id = null) => {
        try {
            const prbid = await new Promise((resolve, reject) => {
                sf.GetObjId('prb', 'prb', 10, (id) => {
                    if (id) resolve(id);
                    else reject(new Error('Failed to generate Problem ID'));
                });
            });

            const newProblem = await Prb.create({
                prbid: prbid,
                prbkorean: data.prbkorean || '',
                prbmainans: data.prbmainans || '',
                prbexplain: data.prbexplain || '',
                prbpickor: null, // Default null
            });

            // If r1_id is provided, link the problem to the concept
            if (r1_id) {
                const cpt = await CptProblemSet.findOne({ where: { cptid: r1_id } });
                if (cpt) {
                    const currentList = cpt.prblist ? cpt.prblist.split(',').filter(p => p.trim()) : [];
                    currentList.push(prbid);
                    await cpt.update({ prblist: currentList.join(',') });
                }
            }

            return newProblem;
        } catch (error) {
            console.error('Error in createProblem:', error);
            throw error;
        }
    },

    // 8. 노드 생성 (R1, R2, R3)
    createNode: async (type, title, parentId) => {
        try {
            const createdate = sf.nodetime();

            if (type === 'r3') {
                const r3id = await new Promise((resolve) => sf.GetObjId('r3id', 'r3list', 10, resolve));
                const maxOrder = await R3List.max('r3order') || 0;

                await R3List.create({
                    r3id,
                    listinfo: title,
                    r3order: maxOrder + 1,
                    createdate
                });
                return { id: r3id, title, order: maxOrder + 1, type: 'r3' };

            } else if (type === 'r2') {
                if (!parentId) throw new Error('Parent ID required for R2');
                const r2id = await new Promise((resolve) => sf.GetObjId('r2id', 'r2list', 10, resolve));

                // Create R2
                await R2List.create({
                    r2id,
                    r2listinfo: title,
                    r2order: 0, // Legacy, actual order in rkconnect
                    createdate
                });

                // Link to R3
                const maxOrder = await RkConnect.max('rkorder', { where: { parentcol: parentId, conkind: 'rc32' } }) || 0;

                await RkConnect.create({
                    parentcol: parentId,
                    childcol: r2id,
                    conkind: 'rc32',
                    rkorder: maxOrder + 1,
                    createdate
                });

                return { id: r2id, title, r3_id: parentId, order: maxOrder + 1, type: 'r2' };

            } else if (type === 'r1') {
                if (!parentId) throw new Error('Parent ID required for R1');
                const cptid = await new Promise((resolve) => sf.GetObjId('cpt', 'cptproblemset', 10, resolve));

                // Create R1 (CptProblemSet)
                await CptProblemSet.create({
                    cptid,
                    listinfo: title,
                    prblist: '', // Required
                    userid: 'admin', // Default
                    createdate
                });

                // Link to R2
                const maxOrder = await RkConnect.max('rkorder', { where: { parentcol: parentId, conkind: 'rc21' } }) || 0;

                await RkConnect.create({
                    parentcol: parentId,
                    childcol: cptid,
                    conkind: 'rc21',
                    rkorder: maxOrder + 1,
                    createdate
                });

                return { id: cptid, title, r2_id: parentId, order: maxOrder + 1, type: 'r1' };
            }
        } catch (error) {
            console.error('Error in createNode:', error);
            throw error;
        }
    },

    // 9. 노드 이동 (부모 변경)
    moveNode: async (nodeId, type, newParentId) => {
        try {
            console.log(`[moveNode] Request: nodeId=${nodeId}, type=${type}, newParentId=${newParentId}`);

            if (!nodeId || !newParentId) throw new Error('Node ID and New Parent ID are required');

            let conkind = '';
            if (type === 'r2') conkind = 'rc32';
            else if (type === 'r1') conkind = 'rc21';
            else throw new Error('Invalid node type for move');

            console.log(`[moveNode] Derived conkind=${conkind}`);

            // Verify target exists
            const target = await RkConnect.findOne({ where: { childcol: nodeId, conkind } });
            console.log(`[moveNode] Target record:`, target ? target.toJSON() : 'NOT FOUND');

            if (!target) throw new Error('Target node connection not found');

            // Calculate new order (append to end)
            const maxOrder = await RkConnect.max('rkorder', { where: { parentcol: newParentId, conkind } }) || 0;
            const newOrder = maxOrder + 1;

            // Update RkConnect
            const [updated] = await RkConnect.update({
                parentcol: newParentId,
                rkorder: newOrder
            }, {
                where: {
                    childcol: nodeId,
                    conkind: conkind
                }
            });

            console.log(`[moveNode] Update result: ${updated}`);

            if (updated === 0) throw new Error('Node connection not found or no change');

            return { id: nodeId, type, newParentId, newOrder };

        } catch (error) {
            console.error('Error in moveNode:', error);
            throw error;
        }
    },

    // 10. 노드 수정 (이름 변경)
    updateNode: async (id, type, title) => {
        try {
            if (!id || !type || !title) throw new Error('ID, type, and title are required');

            let updated = 0;
            if (type === 'r3') {
                [updated] = await R3List.update({ listinfo: title }, { where: { r3id: id } });
            } else if (type === 'r2') {
                [updated] = await R2List.update({ r2listinfo: title }, { where: { r2id: id } });
            } else if (type === 'r1') {
                [updated] = await CptProblemSet.update({ listinfo: title }, { where: { cptid: id } });
            } else {
                throw new Error('Invalid node type');
            }

            if (updated === 0) throw new Error('Node not found or no change');

            return { id, type, title };
        } catch (error) {
            console.error('Error in updateNode:', error);
            throw error;
        }
    },

    // 11. 노드 순서 변경 (Swap)
    swapNodeOrder: async (id1, id2, type) => {
        try {
            if (!id1 || !id2 || !type) throw new Error('ID1, ID2, and Type are required');

            if (type === 'r3') {
                const node1 = await R3List.findOne({ where: { r3id: id1 } });
                const node2 = await R3List.findOne({ where: { r3id: id2 } });
                if (!node1 || !node2) throw new Error('Nodes not found');

                console.log(`[swapNodeOrder] R3 Swap: ${node1.r3id}(order=${node1.r3order}) <-> ${node2.r3id}(order=${node2.r3order})`);

                let tempOrder = node1.r3order;
                if (tempOrder === node2.r3order) {
                    console.warn('[swapNodeOrder] Orders are identical. Re-indexing all R3 nodes...');

                    // Fetch all R3s, sort by order ASC, then CreatedDate ASC, then ID ASC
                    const allR3 = await R3List.findAll({ order: [['r3order', 'ASC'], ['createdate', 'ASC'], ['r3id', 'ASC']] });

                    // Update all with sequential index
                    for (let i = 0; i < allR3.length; i++) {
                        await allR3[i].update({ r3order: i });
                    }

                    // Reload nodes
                    await node1.reload();
                    await node2.reload();
                    tempOrder = node1.r3order; // Update tempOrder to new value
                    console.log(`[swapNodeOrder] Re-indexed. New orders: ${node1.r3order} <-> ${node2.r3order}`);
                }

                await node1.update({ r3order: node2.r3order });
                await node2.update({ r3order: tempOrder });

            } else if (type === 'r2' || type === 'r1') {
                const conkind = type === 'r2' ? 'rc32' : 'rc21';
                const node1 = await RkConnect.findOne({ where: { childcol: id1, conkind } });
                const node2 = await RkConnect.findOne({ where: { childcol: id2, conkind } });
                if (!node1 || !node2) throw new Error('Nodes not found');

                const tempOrder = node1.rkorder;
                await node1.update({ rkorder: node2.rkorder });
                await node2.update({ rkorder: tempOrder });

            } else {
                throw new Error('Invalid node type');
            }

            return { success: true };
        } catch (error) {
            console.error('Error in swapNodeOrder:', error);
            throw error;
        }
    }
};

module.exports = cmsService;
