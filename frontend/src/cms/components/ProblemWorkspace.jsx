
import React, { useState, useEffect, useRef } from 'react';
import { useCMS } from '../store';
import { api } from '../api';
import { Trash2, Plus, AlertCircle, Link2Off, Loader2, Pencil, Save, X } from 'lucide-react';
import { useMathJax } from '../hooks/useMathJax';

const ProblemWorkspace = ({ selectedNode }) => {
    const { state, dispatch, ACTIONS } = useCMS();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProblem, setNewProblem] = useState({ content: '', answer: '', solution: '' });

    // Editing State
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ prbkorean: '', prbmainans: '', prbexplain: '', prbpickor: '' });

    // API Fetch State
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [unlinkedLimit, setUnlinkedLimit] = useState(50); // Default 50

    // MathJax Ref
    const containerRef = useRef(null);
    useMathJax(containerRef, [problems, loading, editingId]); // Re-run when problems load/change or edit mode toggles

    useEffect(() => {
        if (selectedNode && (selectedNode.id.startsWith('cpt') || selectedNode.id === 'UNLINKED_PRBS')) {
            const fetchProblems = async () => {
                setLoading(true);
                setError(null);
                setEditingId(null);
                try {
                    let data;
                    if (selectedNode.id === 'UNLINKED_PRBS') {
                        data = await api.getUnlinkedProblems(unlinkedLimit);
                    } else {
                        data = await api.getProblems(selectedNode.id);
                    }
                    setProblems(data);
                } catch (err) {
                    setError("문제를 불러오는데 실패했습니다.");
                } finally {
                    setLoading(false);
                }
            };
            fetchProblems();
        } else {
            setProblems([]);
        }
    }, [selectedNode, unlinkedLimit]);

    if (!selectedNode) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 h-full bg-zinc-50/50">
                <AlertCircle size={48} className="mb-4 opacity-20" />
                <p>왼쪽 사이드바에서 개념(R1)을 선택하여 문제를 확인하세요.</p>
            </div>
        );
    }

    // Implement Create Problem
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const data = {
                prbkorean: newProblem.content,
                prbmainans: newProblem.answer,
                prbexplain: newProblem.solution
            };

            // Context-aware creation: if R1 is selected, pass its ID
            if (selectedNode?.type === 'r1') {
                data.r1_id = selectedNode.id;
            }

            const created = await api.createProblem(data);
            alert(`문제 생성이 완료되었습니다. ID: ${created.prbid}`);

            // If in Unlinked view OR R1 view, add to list (prepend)
            // Note: If newly created linked to R1, it shouldn't appear in Unlinked, but we rely on current view context.
            if (selectedNode.id === 'UNLINKED_PRBS' || selectedNode.type === 'r1') {
                setProblems(prev => [created, ...prev]);
            }

            // If it was linked to an R1, increment its count in the store
            if (selectedNode?.type === 'r1') {
                dispatch({ type: ACTIONS.INCREMENT_R1_COUNT, payload: { id: selectedNode.id } });
            }

            setNewProblem({ content: '', answer: '', solution: '' });
            setShowAddForm(false);
        } catch (err) {
            alert('문제 생성 실패: ' + err.message);
        }
    };

    const handleUnlink = (problemId) => {
        alert("연결 해제 기능은 아직 API가 연동되지 않았습니다.");
    };

    const handleEdit = (problem) => {
        setEditingId(problem.prbid);
        setEditForm({
            prbkorean: problem.prbkorean?.replaceAll('`', '') || '',
            imageFile: null,
            imagePreview: problem.prbpickor || null,
            prbpickor: problem.prbpickor || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditForm(prev => ({
                ...prev,
                imageFile: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleRemoveImage = () => {
        if (window.confirm("정말로 이미지를 삭제하시겠습니까?")) {
            setEditForm(prev => ({
                ...prev,
                imageFile: null,
                imagePreview: null,
                prbpickor: ''
            }));
        }
    };

    const handleSaveEdit = async () => {
        try {
            const formData = new FormData();

            // Text fields (wrap in backticks)
            const escapeContent = (text) => text ? `\`${text}\`` : '';
            formData.append('prbkorean', escapeContent(editForm.prbkorean));

            // Image Logic
            if (editForm.imageFile) {
                formData.append('image', editForm.imageFile);
            } else if (editForm.prbpickor === '') {
                formData.append('prbpickor', '');
            }

            const updated = await api.updateProblem(editingId, formData);
            if (updated) {
                setProblems(prev => prev.map(p => p.prbid === editingId ? updated : p));
                setEditingId(null);
            }
        } catch (err) {
            alert('수정 실패: ' + err.message);
        }
    };

    return (
        <div ref={containerRef} className="flex-1 h-full flex flex-col bg-zinc-50/30 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-zinc-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div>
                    <div className="text-xs font-semibold text-blue-600 mb-1">
                        {selectedNode.id === 'UNLINKED_PRBS' ? '미분류 확인 (UNLINKED)' : '개념 (CONCEPT)'}
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900">{selectedNode.title}</h1>
                    <div className="text-sm text-zinc-500 mt-1">ID: {selectedNode.id}</div>
                </div>

                <div className="flex items-center gap-2">
                    {selectedNode.id === 'UNLINKED_PRBS' && (
                        <div className="flex bg-zinc-100 rounded-lg p-1 border border-zinc-200 mr-2">
                            {[50, 500, 'all'].map(limit => (
                                <button
                                    key={limit}
                                    onClick={() => setUnlinkedLimit(limit)}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${unlinkedLimit === limit
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-zinc-500 hover:text-zinc-700'
                                        }`}
                                >
                                    {limit === 'all' ? '전부' : `${limit}개`}
                                </button>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        문제 추가
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-blue-500" size={32} />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-10 text-red-500">
                        {error}
                    </div>
                )}

                {/* Add Form */}
                {showAddForm && (
                    <div className="mb-6 bg-white p-6 rounded-xl border border-blue-100 shadow-lg ring-4 ring-blue-50">
                        <h3 className="font-semibold text-zinc-800 mb-4">새 문제 작성</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">문제 내용</label>
                                <textarea
                                    className="w-full p-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    rows={3}
                                    placeholder="문제 질문을 입력하세요..."
                                    value={newProblem.content}
                                    onChange={e => setNewProblem({ ...newProblem, content: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">정답</label>
                                    <input
                                        className="w-full p-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        type="text"
                                        placeholder="최종 정답"
                                        value={newProblem.answer}
                                        onChange={e => setNewProblem({ ...newProblem, answer: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">해설 / 힌트</label>
                                    <textarea
                                        className="w-full p-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        rows={1}
                                        placeholder="간단한 해설..."
                                        value={newProblem.solution}
                                        onChange={e => setNewProblem({ ...newProblem, solution: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 text-zinc-600 hover:bg-zinc-100 rounded-lg"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    문제 저장
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Linked Problems List */}
                {!loading && !error && (
                    <div className="space-y-4">
                        {problems.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-zinc-200 rounded-xl">
                                <p className="text-zinc-400">이 개념에 연결된 문제가 없습니다.</p>
                            </div>
                        ) : (
                            problems.map(problem => {
                                const isEditing = editingId === problem.prbid;

                                return (
                                    <div key={problem.prbid} className="group bg-white rounded-xl border border-zinc-200 p-5 shadow-sm hover:shadow-md transition-shadow relative">

                                        {isEditing ? (
                                            /* Editing Mode */
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="text-xs text-blue-500 font-bold">EDITING: {problem.prbid}</div>
                                                </div>

                                                {/* Problem Content */}
                                                <div>
                                                    <label className="block text-xs font-bold text-zinc-500 mb-1">본문 (한글)</label>
                                                    <textarea
                                                        className="w-full p-3 border border-zinc-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                                        rows={4}
                                                        value={editForm.prbkorean}
                                                        onChange={e => setEditForm({ ...editForm, prbkorean: e.target.value })}
                                                    />
                                                </div>

                                                {/* Image Upload */}
                                                <div>
                                                    <label className="block text-xs font-bold text-zinc-500 mb-1">문제 이미지</label>
                                                    <div className="flex items-start gap-4 p-4 border border-zinc-200 rounded-lg bg-zinc-50">
                                                        {editForm.imagePreview ? (
                                                            <div className="relative group">
                                                                <img
                                                                    src={editForm.imagePreview}
                                                                    alt="Preview"
                                                                    className="h-32 w-auto object-contain rounded border border-white shadow-sm"
                                                                />
                                                                <button
                                                                    onClick={handleRemoveImage}
                                                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition-colors"
                                                                    title="이미지 제거"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="h-32 w-32 flex items-center justify-center border-2 border-dashed border-zinc-300 rounded text-zinc-400 text-sm">
                                                                이미지 없음
                                                            </div>
                                                        )}

                                                        <div className="flex-1">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                id={`file-upload-${problem.prbid}`}
                                                                className="hidden"
                                                                onChange={handleImageChange}
                                                            />
                                                            <label
                                                                htmlFor={`file-upload-${problem.prbid}`}
                                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-300 rounded text-zinc-700 hover:bg-zinc-50 cursor-pointer shadow-sm text-sm font-medium"
                                                            >
                                                                <Plus size={16} />
                                                                이미지 선택
                                                            </label>
                                                            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                                                                이미지를 선택하면 자동 저장 시<br />
                                                                <span className="font-mono text-zinc-700 bg-zinc-200 px-1 rounded">/prismpics/{problem.prbid}.ext</span><br />
                                                                경로로 저장됩니다.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end gap-2 text-sm text-zinc-400">
                                                    * 정답 및 해설 수정 필드는 현재 숨겨져 있습니다.
                                                </div>

                                                <div className="flex justify-end gap-2 pt-2">
                                                    <button onClick={handleCancelEdit} className="flex items-center gap-1 px-3 py-1.5 text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded">
                                                        <X size={16} /> 취소
                                                    </button>
                                                    <button onClick={handleSaveEdit} className="flex items-center gap-1 px-3 py-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                                                        <Save size={16} /> 저장
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* View Mode */
                                            <>
                                                <div className="pr-10">
                                                    <div className="text-xs text-zinc-400 mb-2">{problem.prbid}</div>
                                                    {/* Content */}
                                                    <h4 className="font-medium text-zinc-800 text-lg mb-2" dangerouslySetInnerHTML={{ __html: problem.prbkorean?.replaceAll('`', '') }}></h4>

                                                    {/* Problem Image */}
                                                    {problem.prbpickor && (
                                                        <div className="mb-4">
                                                            <img
                                                                src={problem.prbpickor}
                                                                alt="Problem Attachment"
                                                                className="max-w-full h-auto rounded-lg border border-zinc-200"
                                                                onError={(e) => e.target.style.display = 'none'}
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        <div className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded inline-block border border-emerald-100">
                                                            <span className="font-semibold opacity-70 mr-2">답:</span>
                                                            <span dangerouslySetInnerHTML={{ __html: problem.prbmainans?.replaceAll('`', '') }}></span>
                                                        </div>
                                                        {problem.prbexplain && (
                                                            <div className="bg-zinc-50 text-zinc-600 px-2 py-1 rounded inline-block border border-zinc-200">
                                                                <span className="font-semibold opacity-70 mr-2">해설:</span>
                                                                <span dangerouslySetInnerHTML={{ __html: problem.prbexplain?.replaceAll('`', '') }}></span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(problem)}
                                                        title="문제 수정"
                                                        className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUnlink(problem.prbid)}
                                                        title="개념에서 연결 해제"
                                                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Link2Off size={18} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemWorkspace;
