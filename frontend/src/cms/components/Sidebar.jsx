import React, { useState, useRef } from 'react';
import { useCMS } from '../store';
import { api } from '../api';
import { ChevronRight, ChevronDown, Plus, Folder, FileText, Layers, Archive, ArrowUp, ArrowDown, Move, MoreVertical, Trash2, Link2Off, Edit } from 'lucide-react';
import clsx from 'clsx';
import { useMathJax } from '../hooks/useMathJax';

const Sidebar = ({ selectedNode, onSelectNode }) => {
    const { state, dispatch, ACTIONS, reorderNode } = useCMS();
    const [expanded, setExpanded] = useState({});
    const [movingNode, setMovingNode] = useState(null); // { id, type, title, currentParentId }
    const [activeMenu, setActiveMenu] = useState(null); // ID of the node with open menu

    // MathJax Ref for Sidebar container
    const containerRef = useRef(null);
    useMathJax(containerRef, [state, expanded, selectedNode, activeMenu, movingNode]); // Re-type on state update, expand toggle, selection change, or menu/move interaction

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleMenu = (e, id) => {
        e.stopPropagation();
        setActiveMenu(prev => prev === id ? null : id);
    };

    const closeMenu = () => setActiveMenu(null);

    const handleAddR2 = async (r3_id) => {
        const title = prompt("단원 이름을 입력하세요:");
        if (title) {
            try {
                const newNode = await api.createNode('r2', title, r3_id);
                dispatch({ type: ACTIONS.ADD_R2, payload: { ...newNode, r3_id } });
            } catch (error) {
                console.error("Failed to create R2:", error);
                alert("단원 생성 실패");
            }
        }
        closeMenu();
    };

    const handleAddR1 = async (r2_id) => {
        const title = prompt("개념 이름을 입력하세요:");
        if (title) {
            try {
                const newNode = await api.createNode('r1', title, r2_id);
                dispatch({ type: ACTIONS.ADD_R1, payload: { ...newNode, r2_id } });
            } catch (error) {
                console.error("Failed to create R1:", error);
                alert("개념 생성 실패");
            }
        }
        closeMenu();
    };

    const handleAddR3 = async () => {
        const title = prompt("과목 이름을 입력하세요:");
        if (title) {
            try {
                const newNode = await api.createNode('r3', title);
                dispatch({ type: ACTIONS.ADD_R3, payload: newNode });
            } catch (error) {
                console.error("Failed to create R3:", error);
                alert("과목 생성 실패");
            }
        }
        closeMenu();
    };

    const handleReorder = (id, type, direction) => {
        reorderNode(id, type, direction);
        // closeMenu(); // Optional: keep open for multiple clicks? detailed user request implies simple "show icons". I will keep it open or close? Usually sort is one-time or repetitive. I'll NOT close immediately to allow rapid clicks if needed, or close if it overlays. Overlays usually good to close. But for "Up/Down" repeated clicks are common. Let's keep open for Reorder, close for Move/Add.
        // Actually, if it's a popup, it might block view. Let's keep it simplest: manual close or close on outside click.
    };

    const handleMove = (id, type) => {
        const node = state[type][id];
        const parentId = type === 'r1' ? node.r2_id : node.r3_id;
        setMovingNode({ id, type, title: node.title, currentParentId: parentId });
        closeMenu();
    };

    const confirmMove = async (newParentId) => {
        if (newParentId && newParentId !== movingNode.currentParentId) {
            try {
                await api.moveNode(movingNode.id, movingNode.type, newParentId);
                dispatch({ type: ACTIONS.MOVE_NODE, payload: { id: movingNode.id, type: movingNode.type, newParentId } });
            } catch (error) {
                console.error("Failed to move node:", error);
                alert("이동 실패: " + error.message);
            }
        }
        setMovingNode(null);
    };

    const handleRename = async (id, type, currentTitle) => {
        const newTitle = prompt("새 이름을 입력하세요:", currentTitle);
        if (newTitle && newTitle !== currentTitle) {
            try {
                await api.updateNode(id, type, newTitle);
                dispatch({ type: ACTIONS.UPDATE_NODE, payload: { id, type, title: newTitle } });
            } catch (error) {
                console.error("Failed to rename node:", error);
                alert("이름 변경 실패: " + error.message);
            }
        }
        closeMenu();
    };

    // Action Menu Component
    const ActionMenu = ({ id, type, onAdd }) => (
        <div
            className="absolute right-0 top-6 z-50 bg-white shadow-xl border border-zinc-200 rounded-lg p-1.5 flex gap-1 min-w-[120px] justify-between items-center animate-in fade-in zoom-in duration-200 origin-top-right"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex gap-1">
                <button onClick={() => handleReorder(id, type, 'up')} className="p-1.5 hover:bg-zinc-100 text-zinc-600 rounded bg-zinc-50 border border-zinc-100" title="위로"><ArrowUp size={14} /></button>
                <button onClick={() => handleReorder(id, type, 'down')} className="p-1.5 hover:bg-zinc-100 text-zinc-600 rounded bg-zinc-50 border border-zinc-100" title="아래로"><ArrowDown size={14} /></button>
            </div>
            <div className="w-px h-6 bg-zinc-100 mx-1"></div>
            <div className="flex gap-1">
                <button onClick={() => handleRename(id, type, state[type][id].title)} className="p-1.5 hover:bg-zinc-100 text-zinc-600 rounded" title="이름 변경"><Edit size={14} /></button>
                <button onClick={() => handleMove(id, type)} className="p-1.5 hover:bg-zinc-100 text-zinc-600 rounded" title="이동"><Move size={14} /></button>
                {onAdd && (
                    <button onClick={onAdd} className="p-1.5 hover:bg-zinc-100 text-blue-600 rounded" title="추가"><Plus size={14} /></button>
                )}
            </div>
        </div>
    );

    const R1Item = ({ r1 }) => (
        <div
            className={clsx(
                "relative flex items-center gap-1.5 pl-6 py-[1px] pr-2 cursor-pointer hover:bg-zinc-100/80 text-[11px] group rounded-r-md mr-1 border-l-2 border-transparent transition-all leading-tight",
                selectedNode?.id === r1.id
                    ? "bg-blue-50 text-blue-700 font-medium border-blue-400"
                    : "text-zinc-600 hover:text-zinc-900 hover:border-zinc-300"
            )}
            onClick={() => onSelectNode(r1)}
        >
            <FileText size={11} className={clsx(selectedNode?.id === r1.id ? "text-blue-500 fill-blue-100" : "text-zinc-400")} />
            <span className="flex-1 truncate select-none">
                {r1.title?.replaceAll('`', '')}
                {r1.problemCount > 0 && <span className="text-zinc-400 ml-1 text-[10px]">({r1.problemCount})</span>}
            </span>

            <button
                onClick={(e) => toggleMenu(e, r1.id)}
                className={clsx("p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100", activeMenu === r1.id && "opacity-100 bg-zinc-200")}
            >
                <MoreVertical size={11} className="text-zinc-400" />
            </button>

            {activeMenu === r1.id && (
                <ActionMenu id={r1.id} type="r1" />
            )}
        </div>
    );

    const R2Item = ({ r2 }) => {
        const isExpanded = expanded[r2.id];
        const children = Object.values(state.r1).filter(r1 => r1.r2_id === r2.id).sort((a, b) => (a.order || 0) - (b.order || 0));

        return (
            <div className="mb-0">
                <div className="relative flex items-center justify-between group pl-2 py-0.5 pr-2 hover:bg-amber-50 cursor-pointer border-l-2 border-transparent hover:border-amber-400 transition-colors">
                    <div className="flex items-center gap-1.5 select-none flex-1 overflow-hidden" onClick={() => toggleExpand(r2.id)}>
                        {isExpanded ? <ChevronDown size={11} className="text-zinc-400" /> : <ChevronRight size={11} className="text-zinc-400" />}
                        <Folder size={12} className="text-amber-500 fill-current" />
                        <span className="text-[11px] font-semibold text-zinc-800 truncate leading-tight">{r2.title?.replaceAll('`', '')}</span>
                        <span className="text-[9px] text-zinc-400 bg-zinc-100 px-1 py-0 rounded-full ml-1 shrink-0">{children.length}</span>
                    </div>

                    <button
                        onClick={(e) => toggleMenu(e, r2.id)}
                        className={clsx("p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100", activeMenu === r2.id && "opacity-100 bg-amber-100")}
                    >
                        <MoreVertical size={11} className="text-zinc-500" />
                    </button>

                    {activeMenu === r2.id && (
                        <ActionMenu id={r2.id} type="r2" onAdd={() => handleAddR1(r2.id)} />
                    )}
                </div>
                {isExpanded && (
                    <div className="bg-zinc-50/30 pb-0.5">
                        {children.map(r1 => <R1Item key={r1.id} r1={r1} />)}
                        {children.length === 0 && <div className="pl-6 py-0.5 text-[10px] text-zinc-400 italic">개념 없음</div>}
                    </div>
                )}
            </div>
        );
    };

    const R3Item = ({ r3 }) => {
        const isExpanded = expanded[r3.id];
        const children = Object.values(state.r2).filter(r2 => r2.r3_id === r3.id).sort((a, b) => (a.order || 0) - (b.order || 0));

        return (
            <div className="mb-0.5">
                <div className="relative flex items-center justify-between group px-1.5 py-1 bg-indigo-50/30 hover:bg-indigo-50 rounded-lg transition-all border border-transparent hover:border-indigo-100">
                    <div className="flex items-center gap-1.5 cursor-pointer select-none flex-1 overflow-hidden" onClick={() => toggleExpand(r3.id)}>
                        {isExpanded ? <ChevronDown size={13} className="text-indigo-400" /> : <ChevronRight size={13} className="text-indigo-400" />}
                        <Layers size={13} className="text-indigo-600" />
                        <span className="text-xs font-bold text-indigo-900 truncate">{r3.title?.replaceAll('`', '')}</span>
                    </div>

                    <button
                        onClick={(e) => toggleMenu(e, r3.id)}
                        className={clsx("p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100", activeMenu === r3.id && "opacity-100 bg-indigo-200")}
                    >
                        <MoreVertical size={12} className="text-indigo-600" />
                    </button>

                    {activeMenu === r3.id && (
                        <ActionMenu id={r3.id} type="r3" onAdd={() => handleAddR2(r3.id)} />
                    )}
                </div>
                {isExpanded && (
                    <div className="mt-0 pl-1.5 border-l-2 border-indigo-50/50 ml-1.5 space-y-0">
                        {children.map(r2 => <R2Item key={r2.id} r2={r2} />)}
                        {children.length === 0 && <div className="pl-3 py-0.5 text-[10px] text-zinc-400 italic">단원 없음</div>}
                    </div>
                )}
            </div>
        );
    };

    // Filter Orphans
    const orphanR2s = Object.values(state.r2).filter(r2 => !r2.r3_id);
    const orphanR1s = Object.values(state.r1).filter(r1 => !r1.r2_id);

    return (
        <>
            <div
                ref={containerRef}
                className="w-96 h-full border-r border-zinc-200 flex flex-col bg-white"
                onClick={() => setActiveMenu(null)}
            >
                <div className="p-3 border-b border-zinc-100 flex justify-between items-center">
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

                {/* Unlinked Problems (Fixed Bottom) */}
                <div className="p-1 border-t border-zinc-100 bg-zinc-50/50">
                    <div
                        className={clsx(
                            "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-xs font-medium",
                            selectedNode?.id === 'UNLINKED_PRBS'
                                ? "bg-red-50 text-red-700 border border-red-100"
                                : "hover:bg-white text-zinc-600 border border-transparent hover:border-zinc-200 hover:shadow-sm"
                        )}
                        onClick={() => onSelectNode({ id: 'UNLINKED_PRBS', title: '미분류 문제', type: 'special' })}
                    >
                        <Link2Off size={13} className={selectedNode?.id === 'UNLINKED_PRBS' ? "text-red-500" : "text-zinc-400"} />
                        <span>미분류 문제</span>
                    </div>
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
