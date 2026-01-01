import React, { createContext, useContext, useReducer } from 'react';
import { initialData } from './mockData';

// Action Types
const ACTIONS = {
    ADD_R3: 'ADD_R3',
    ADD_R2: 'ADD_R2',
    ADD_R1: 'ADD_R1',
    DELETE_NODE: 'DELETE_NODE', // Generic delete for R3, R2, R1
    UPDATE_NODE: 'UPDATE_NODE', // Generic update title
    ADD_PROBLEM: 'ADD_PROBLEM',
    DELETE_PROBLEM: 'DELETE_PROBLEM',
    LINK_PROBLEM: 'LINK_PROBLEM',
    UNLINK_PROBLEM: 'UNLINK_PROBLEM',
    UPDATE_PROBLEM: 'UPDATE_PROBLEM',
    MOVE_NODE: 'MOVE_NODE', // Change Parent
    REORDER_NODE: 'REORDER_NODE' // Change Order (Up/Down)
};

const storeContext = createContext();

// Helper to generate IDs
const generateId = (prefix) => `${prefix}-${Date.now()}`;

const reducer = (state, action) => {
    switch (action.type) {
        // --- Hierarchy Creation ---
        case ACTIONS.ADD_R3: {
            const id = generateId('r3');
            const currentOrders = Object.values(state.r3).map(n => n.order || 0);
            const maxOrder = Math.max(0, ...currentOrders);
            return {
                ...state,
                r3: { ...state.r3, [id]: { id, title: action.payload.title || '새 과목', order: maxOrder + 1 } }
            };
        }
        case ACTIONS.ADD_R2: {
            const id = generateId('r2');
            const { r3_id, title } = action.payload;
            const currentOrders = Object.values(state.r2).filter(n => n.r3_id === r3_id).map(n => n.order || 0);
            const maxOrder = Math.max(0, ...currentOrders);
            return {
                ...state,
                r2: { ...state.r2, [id]: { id, title: title || '새 단원', r3_id, order: maxOrder + 1 } }
            };
        }
        case ACTIONS.ADD_R1: {
            const id = generateId('r1');
            const { r2_id, title } = action.payload;
            const currentOrders = Object.values(state.r1).filter(n => n.r2_id === r2_id).map(n => n.order || 0);
            const maxOrder = Math.max(0, ...currentOrders);
            return {
                ...state,
                r1: { ...state.r1, [id]: { id, title: title || '새 개념', r2_id, order: maxOrder + 1 } },
                r1_problems: { ...state.r1_problems, [id]: [] }
            };
        }

        // --- Deletion (Cascading is complex, simplified here to just remove the node) ---
        // Ideally, we should recursively remove children, but for proper "Orphan" support as requested,
        // we might actually WANT to keep children but set their parent_id to null.
        // Let's implement ORPHANING on delete for R3->R2 and R2->R1
        case ACTIONS.DELETE_NODE: {
            const { id, type } = action.payload; // type: 'r3', 'r2', 'r1'
            const newState = { ...state };

            delete newState[type][id];

            // Handle orphans
            if (type === 'r3') {
                Object.values(newState.r2).forEach(node => {
                    if (node.r3_id === id) node.r3_id = null;
                });
            } else if (type === 'r2') {
                Object.values(newState.r1).forEach(node => {
                    if (node.r2_id === id) node.r2_id = null;
                });
            } else if (type === 'r1') {
                // When deleting R1, we should remove its entries from r1_problems
                delete newState.r1_problems[id];
            }
            return newState;
        }

        case ACTIONS.UPDATE_NODE: {
            const { id, type, title } = action.payload;
            return {
                ...state,
                [type]: {
                    ...state[type],
                    [id]: { ...state[type][id], title }
                }
            };
        }

        case ACTIONS.MOVE_NODE: {
            const { id, type, newParentId } = action.payload; // type: r2 (needs r3_id), r1 (needs r2_id)
            const node = state[type][id];

            // Helper to get next order in new parent
            let parentField = type === 'r2' ? 'r3_id' : 'r2_id';
            const siblings = Object.values(state[type]).filter(n => n[parentField] === newParentId);
            const maxOrder = Math.max(0, ...siblings.map(n => n.order || 0));

            const updatedNode = { ...node, [parentField]: newParentId, order: maxOrder + 1 };

            return {
                ...state,
                [type]: {
                    ...state[type],
                    [id]: updatedNode
                }
            };
        }

        case ACTIONS.REORDER_NODE: {
            const { id, type, direction } = action.payload; // direction: 'up' or 'down'
            const node = state[type][id];
            const parentField = type === 'r3' ? null : (type === 'r2' ? 'r3_id' : 'r2_id');
            const parentId = parentField ? node[parentField] : null;

            // Find siblings
            let siblings = Object.values(state[type]);
            if (parentField) {
                siblings = siblings.filter(n => n[parentField] === parentId);
            }
            // Sort by order
            siblings.sort((a, b) => (a.order || 0) - (b.order || 0));

            const currentIndex = siblings.findIndex(n => n.id === id);
            if (currentIndex === -1) return state;

            const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
            if (targetIndex < 0 || targetIndex >= siblings.length) return state; // Can't move

            const targetNode = siblings[targetIndex];

            // Swap orders
            return {
                ...state,
                [type]: {
                    ...state[type],
                    [id]: { ...node, order: targetNode.order },
                    [targetNode.id]: { ...targetNode, order: node.order }
                }
            };
        }

        // --- Problems ---
        case ACTIONS.ADD_PROBLEM: {
            const id = generateId('p');
            const { r1_id, content, answer, solution } = action.payload;

            const newState = {
                ...state,
                problems: {
                    ...state.problems,
                    [id]: { id, content, answer, solution }
                }
            };

            // Auto-link if r1_id is provided
            if (r1_id) {
                const currentLinks = newState.r1_problems[r1_id] || [];
                newState.r1_problems = {
                    ...newState.r1_problems,
                    [r1_id]: [...currentLinks, id]
                };
            }

            return newState;
        }

        case ACTIONS.UNLINK_PROBLEM: {
            const { r1_id, problem_id } = action.payload;
            const currentLinks = state.r1_problems[r1_id] || [];
            return {
                ...state,
                r1_problems: {
                    ...state.r1_problems,
                    [r1_id]: currentLinks.filter(pid => pid !== problem_id)
                }
            };
        }

        // Add other cases as needed (Update Problem, Manual Link, etc.)

        default:
            return state;
    }
};

export const CMSProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialData);

    return (
        <storeContext.Provider value={{ state, dispatch, ACTIONS }}>
            {children}
        </storeContext.Provider>
    );
};

export const useCMS = () => useContext(storeContext);
