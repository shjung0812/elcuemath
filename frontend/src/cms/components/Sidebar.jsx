import React, { useState } from 'react';
import { useCMS } from '../store';
import { ChevronRight, ChevronDown, Plus, Folder, FileText, Layers, Archive, ArrowUp, ArrowDown, Move } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ selectedNode, onSelectNode }) => {
    const { state, dispatch, ACTIONS } = useCMS();
    const [expanded, setExpanded] = useState({});
    const [movingNode, setMovingNode] = useState(null); // { id, type, title, currentParentId }

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleAddR2 = (r3_id) => {
        const title = prompt("단원 이름을 입력하세요:");
        if (title) dispatch({ type: ACTIONS.ADD_R2, payload: { title, r3_id } });
    };

    const handleAddR1 = (r2_id) => {
        const title = prompt("개념 이름을 입력하세요:");
        if (title) dispatch({ type: ACTIONS.ADD_R1, payload: { title, r2_id } });
    };

    const handleAddR3 = () => {
        const title = prompt("과목 이름을 입력하세요:");
        if (title) dispatch({ type: ACTIONS.ADD_R3, payload: { title } });
    };

    const handleReorder = (id, type, direction) => {
        dispatch({ type: ACTIONS.REORDER_NODE, payload: { id, type, direction } });
    };

    const handleMove = (id, type) => {
        // Find the node to get its details
        const node = state[type][id];
        const parentId = type === 'r1' ? node.r2_id : node.r3_id;

        setMovingNode({
            id,
            type,
            title: node.title,
            currentParentId: parentId
        });
    };

    const confirmMove = (newParentId) => {
        if (newParentId && newParentId !== movingNode.currentParentId) {
            dispatch({
                type: ACTIONS.MOVE_NODE,
                payload: {
                    id: movingNode.id,
                    type: movingNode.type,
                    newParentId
                }
            });
        }
        setMovingNode(null);
    };

    const R1Item = ({ r1 }) => (
        <div
            className={clsx(
                "flex items-center gap-2 pl-9 py-1 pr-2 cursor-pointer hover:bg-zinc-100 text-sm group",
                selectedNode?.id === r1.id && "bg-blue-50 text-blue-600 font-medium"
            )}
            onClick={() => onSelectNode(r1)}
        >
            <FileText size={14} />
            <span className="flex-1 truncate">{r1.title}</span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                <button onClick={(e) => { e.stopPropagation(); handleReorder(r1.id, 'r1', 'up'); }} className="p-0.5 hover:bg-zinc-200 rounded"><ArrowUp size={10} /></button>
                <button onClick={(e) => { e.stopPropagation(); handleReorder(r1.id, 'r1', 'down'); }} className="p-0.5 hover:bg-zinc-200 rounded"><ArrowDown size={10} /></button>
                <button onClick={(e) => { e.stopPropagation(); handleMove(r1.id, 'r1'); }} className="p-0.5 hover:bg-zinc-200 rounded ml-1" title="이동"><Move size={10} /></button>
            </div>
        </div>
    );

    const R2Item = ({ r2 }) => {
        const isExpanded = expanded[r2.id];
        // Find children
        // Find children and Sort
        const children = Object.values(state.r1)
            .filter(r1 => r1.r2_id === r2.id)
            .sort((a, b) => (a.order || 0) - (b.order || 0));

        return (
            <div>
                <div className="flex items-center justify-between group pl-5 py-1 pr-2 hover:bg-zinc-50">
                    <div
                        className="flex items-center gap-2 cursor-pointer select-none flex-1"
                        onClick={() => toggleExpand(r2.id)}
                    >
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        <Folder size={15} className="text-amber-500" />
                        <span className="text-sm text-zinc-700">{r2.title}</span>
                        <span className="text-xs text-zinc-400">({children.length})</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 items-center mr-2">
                        <button onClick={(e) => { e.stopPropagation(); handleReorder(r2.id, 'r2', 'up'); }} className="p-0.5 hover:bg-zinc-200 rounded"><ArrowUp size={10} /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleReorder(r2.id, 'r2', 'down'); }} className="p-0.5 hover:bg-zinc-200 rounded"><ArrowDown size={10} /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleMove(r2.id, 'r2'); }} className="p-0.5 hover:bg-zinc-200 rounded ml-1" title="이동"><Move size={10} /></button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleAddR1(r2.id); }}
                            className="p-1 hover:bg-zinc-200 rounded ml-1"
                            title="Add Concept"
                        >
                            <Plus size={12} />
                        </button>
                    </div>
                </div>
                {isExpanded && (
                    <div>
                        {children.map(r1 => <R1Item key={r1.id} r1={r1} />)}
                        {children.length === 0 && <div className="pl-9 py-1 text-xs text-zinc-400 italic">개념 없음</div>}
                    </div>
                )}
            </div>
        );
    };

    const R3Item = ({ r3 }) => {
        const isExpanded = expanded[r3.id];
        // Find children
        // Find children and Sort
        const children = Object.values(state.r2)
            .filter(r2 => r2.r3_id === r3.id)
            .sort((a, b) => (a.order || 0) - (b.order || 0));

        return (
            <div className="mb-1">
                <div className="flex items-center justify-between group px-2 py-1.5 hover:bg-zinc-50 rounded-md">
                    <div
                        className="flex items-center gap-2 cursor-pointer select-none flex-1"
                        onClick={() => toggleExpand(r3.id)}
                    >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        <Layers size={16} className="text-indigo-600" />
                        <span className="font-medium text-zinc-800">{r3.title}</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 items-center mr-2">
                        <button onClick={(e) => { e.stopPropagation(); handleReorder(r3.id, 'r3', 'up'); }} className="p-0.5 hover:bg-zinc-200 rounded"><ArrowUp size={12} /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleReorder(r3.id, 'r3', 'down'); }} className="p-0.5 hover:bg-zinc-200 rounded"><ArrowDown size={12} /></button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleAddR2(r3.id); }}
                            className="p-1 hover:bg-zinc-200 rounded ml-1"
                            title="Add Chapter"
                        >
                            <Plus size={14} /></button>
                    </div>
                </div>
                {
                    isExpanded && (
                        <div className="border-l border-zinc-200 ml-4">
                            {children.map(r2 => <R2Item key={r2.id} r2={r2} />)}
                            {children.length === 0 && <div className="pl-5 py-1 text-xs text-zinc-400 italic">단원 없음</div>}
                        </div>
                    )
                }
            </div >
        );
    };

    // Filter Orphans
    const orphanR2s = Object.values(state.r2).filter(r2 => !r2.r3_id);
    const orphanR1s = Object.values(state.r1).filter(r1 => !r1.r2_id);

    return (
        <>
            <div className="w-80 h-full border-r border-zinc-200 flex flex-col bg-white">
                <div className="p-4 border-b border-zinc-100 flex justify-between items-center">
                    <h2 className="font-bold text-zinc-800">커리큘럼</h2>
                    <button onClick={handleAddR3} className="p-1.5 bg-zinc-900 text-white rounded hover:bg-zinc-700">
                        <Plus size={16} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {Object.values(state.r3)
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map(r3 => (
                            <R3Item key={r3.id} r3={r3} />
                        ))}

                    {/* Orphans Section */}
                    {(orphanR2s.length > 0 || orphanR1s.length > 0) && (
                        <div className="mt-6 pt-4 border-t border-zinc-100">
                            <div className="px-2 py-1 font-semibold text-xs text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                <Archive size={12} /> 미분류 항목
                            </div>
                            {orphanR2s.map(r2 => <R2Item key={r2.id} r2={r2} />)}
                            {orphanR1s.map(r1 => <R1Item key={r1.id} r1={r1} />)}
                        </div>
                    )}
                </div>
            </div>
            {movingNode && (
                <MoveModal
                    movingNode={movingNode}
                    state={state}
                    onClose={() => setMovingNode(null)}
                    onConfirm={confirmMove}
                />
            )}
        </>
    );
};

const MoveModal = ({ movingNode, state, onClose, onConfirm }) => {
    const [selectedParent, setSelectedParent] = useState(movingNode.currentParentId || '');

    // Get potential parents based on node type
    const parents = movingNode.type === 'r1'
        ? Object.values(state.r2) // R1 needs R2 parent
        : Object.values(state.r3); // R2 needs R3 parent

    // For R1, it's helpful to know which R3 the R2 belongs to (for grouping)
    // We can group R2s by their R3 parent ideally
    const r3Map = movingNode.type === 'r1' ? state.r3 : {};

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h3 className="text-lg font-bold text-zinc-800 mb-4">
                    '{movingNode.title}' 이동
                </h3>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                        이동할 위치 (부모) 선택:
                    </label>
                    <select
                        className="w-full p-2 border border-zinc-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={selectedParent}
                        onChange={(e) => setSelectedParent(e.target.value)}
                    >
                        <option value="">-- 선택하세요 --</option>
                        {movingNode.type === 'r2' && parents.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                        ))}

                        {movingNode.type === 'r1' && (
                            // Group R2s by R3 if possible, or just list them with context
                            Object.values(r3Map).map(r3 => {
                                const r2s = parents.filter(r2 => r2.r3_id === r3.id);
                                if (r2s.length === 0) return null;
                                return (
                                    <optgroup key={r3.id} label={r3.title}>
                                        {r2s.map(r2 => (
                                            <option key={r2.id} value={r2.id}>{r2.title}</option>
                                        ))}
                                    </optgroup>
                                );
                            })
                        )}
                        {/* Orphans R2 option if needed */}
                        {movingNode.type === 'r1' && (
                            <optgroup label="미분류">
                                {parents.filter(r2 => !r2.r3_id).map(r2 => (
                                    <option key={r2.id} value={r2.id}>{r2.title}</option>
                                ))}
                            </optgroup>
                        )}
                    </select>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-md text-sm font-medium"
                    >
                        취소
                    </button>
                    <button
                        onClick={() => onConfirm(selectedParent)}
                        className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium"
                        disabled={!selectedParent}
                    >
                        이동
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
