const cmsService = require('../service/cmsService');
const fs = require('fs');
const path = require('path');

const cmsController = {
    getCurriculum: async (req, res) => {
        try {
            const tree = await cmsService.getCurriculumTree();
            res.json(tree);
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ error: 'Failed to retrieve curriculum tree' });
        }
    },

    getProblems: async (req, res) => {
        try {
            const { id } = req.params; // Cpt ID (R1 ID)
            const problems = await cmsService.getProblems(id);
            res.json(problems);
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ error: 'Failed to retrieve problems' });
        }
    },

    moveNode: async (req, res) => {
        try {
            const { nodeId, newParentId, newOrder } = req.body;
            // newOrder가 없으면 0이나 맨 뒤로 설정하는 로직이 서비스에 있어야 하나, 
            // 현재 서비스는 단순 업데이트만 함.
            const result = await cmsService.moveNode(nodeId, newParentId, newOrder);
            res.json({ success: true, result });
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ error: 'Failed to move node' });
        }
    },

    reorderProblems: async (req, res) => {
        try {
            const { id } = req.params; // Cpt ID
            const { newPrbIds } = req.body; // Array of problem IDs

            if (!Array.isArray(newPrbIds)) {
                return res.status(400).json({ error: 'newPrbIds must be an array' });
            }

            const result = await cmsService.updateProblemList(id, newPrbIds);
            res.json({ success: true, result });
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ error: 'Failed to reorder problems' });
        }
    },

    updateProblem: async (req, res) => {
        try {
            const { id } = req.params; // problem ID (e.g., p00348)
            let updateData = req.body;

            // Handle File Upload
            if (req.file) {
                const oldPath = req.file.path;
                const extension = path.extname(req.file.originalname);
                const newFilename = `${id}${extension}`;
                const newPath = path.join('public/prismpics', newFilename);
                const webPath = `/prismpics/${newFilename}`;

                // Rename (Move) file
                // Multer saves to destination, so oldPath is already in public/prismpics/originalName
                // We just need to rename it.
                if (fs.existsSync(newPath)) {
                    fs.unlinkSync(newPath); // Delete existing file if present
                }
                fs.renameSync(oldPath, newPath);

                // Add pibpickor to update data
                updateData = { ...updateData, prbpickor: webPath };
            }

            const updatedProblem = await cmsService.updateProblem(id, updateData);

            if (updatedProblem) {
                res.json(updatedProblem);
            } else {
                res.status(404).json({ error: 'Problem not found or update failed' });
            }
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ error: 'Failed to update problem' });
        }
    },

    getUnlinkedProblems: async (req, res) => {
        try {
            const { limit } = req.query;
            const problems = await cmsService.getUnlinkedProblems(limit);
            res.json(problems);
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ error: 'Failed to retrieve unlinked problems' });
        }
    },

    createProblem: async (req, res) => {
        try {
            const data = req.body;
            const r1_id = data.r1_id; // Extract r1_id if present
            const newProblem = await cmsService.createProblem(data, r1_id);
            res.json(newProblem);
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ error: 'Failed to create problem' });
        }
    },

    createNode: async (req, res) => {
        try {
            const { type, title, parentId } = req.body;
            if (!type || !title) {
                return res.status(400).json({ error: 'Type and title are required' });
            }
            const newNode = await cmsService.createNode(type, title, parentId);
            res.json(newNode);
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ error: 'Failed to create node' });
        }
    },

    moveNode: async (req, res) => {
        try {
            const { nodeId, type, newParentId } = req.body;
            if (!nodeId || !type || !newParentId) {
                return res.status(400).json({ error: 'Node ID, Type, and New Parent ID are required' });
            }
            const result = await cmsService.moveNode(nodeId, type, newParentId);
            res.json(result);
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ error: 'Failed to move node' });
        }
    },

    updateNode: async (req, res) => {
        try {
            const { id, type, title } = req.body;
            if (!id || !type || !title) {
                return res.status(400).json({ error: 'ID, Type, and Title are required' });
            }
            const result = await cmsService.updateNode(id, type, title);
            res.json(result);
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ error: 'Failed to update node' });
        }
    },

    swapNodeOrder: async (req, res) => {
        try {
            const { id1, id2, type } = req.body;
            if (!id1 || !id2 || !type) {
                return res.status(400).json({ error: 'ID1, ID2, and Type are required' });
            }
            const result = await cmsService.swapNodeOrder(id1, id2, type);
            res.json(result);
        } catch (error) {
            console.error('Controller Error:', error);
            res.status(500).json({ error: 'Failed to swap node order' });
        }
    }
};

module.exports = cmsController;
