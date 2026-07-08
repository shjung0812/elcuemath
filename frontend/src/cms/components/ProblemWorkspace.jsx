
import React, { useState, useEffect, useRef } from 'react';
import { useCMS } from '../store';
import { api } from '../api';
import { Trash2, Plus, AlertCircle, Link2Off, Loader2, Pencil, Save, X, Link, CheckSquare } from 'lucide-react';
import { useMathJax } from '../hooks/useMathJax';

const ProblemWorkspace = ({ selectedNode }) => {
    const { state, dispatch, ACTIONS } = useCMS();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProblem, setNewProblem] = useState({ content: '', answer: '', solution: '', imageFile: null, imagePreview: null });

    // Editing State
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ prbkorean: '', prbmainans: '', prbexplain: '', prbpickor: '' });

    // API Fetch State
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [unlinkedLimit, setUnlinkedLimit] = useState(50); // Default 50

    // Bulk Select State
    const [selectedPrbIds, setSelectedPrbIds] = useState([]);
    const [showLinkModal, setShowLinkModal] = useState(false);

    // MathJax Ref
    const containerRef = useRef(null);
    useMathJax(containerRef, [problems, loading, editingId, selectedPrbIds]); // Re-run when problems load/change or edit mode toggles

    useEffect(() => {
        if (selectedNode && (selectedNode.id.startsWith('cpt') || selectedNode.id === 'UNLINKED_PRBS')) {
            const fetchProblems = async () => {
                setLoading(true);
                setError(null);
                setEditingId(null);
                setSelectedPrbIds([]);
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

    // Clipboard Paste Handler
    const handlePaste = (e, formType) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    if (formType === 'new') {
                        setNewProblem(prev => ({
                            ...prev,
                            imageFile: file,
                            imagePreview: previewUrl
                        }));
                    } else if (formType === 'edit') {
                        setEditForm(prev => ({
                            ...prev,
                            imageFile: file,
                            imagePreview: previewUrl
                        }));
                    }
                    e.preventDefault();
                    break;
                }
            }
        }
    };

    // Bulk Select Handlers
    const handleToggleSelect = (prbId) => {
        setSelectedPrbIds(prev =>
            prev.includes(prbId) ? prev.filter(id => id !== prbId) : [...prev, prbId]
        );
    };

    const handleToggleSelectAll = () => {
        const allIds = problems.map(p => p.prbid);
        if (selectedPrbIds.length === allIds.length) {
            setSelectedPrbIds([]);
        } else {
            setSelectedPrbIds(allIds);
        }
    };

    const handleLinkProblems = async (cptId) => {
        if (!cptId) {
            alert('연결할 개념을 선택해주세요.');
            return;
        }
        try {
            const result = await api.linkProblems(cptId, selectedPrbIds);
            if (result.success) {
                alert(`${result.updatedCount}개의 문제를 개념에 일괄 연결했습니다.`);
                
                // 미분류 뷰인 경우 연결 완료된 문제들을 리스트에서 제거
                if (selectedNode.id === 'UNLINKED_PRBS') {
                    setProblems(prev => prev.filter(p => !selectedPrbIds.includes(p.prbid)));
                }
                
                // 개념별 문제 수 증가
                dispatch({
                    type: ACTIONS.INCREMENT_R1_COUNT,
                    payload: { id: cptId, count: result.updatedCount }
                });
 
                setSelectedPrbIds([]);
                setShowLinkModal(false);
            }
        } catch (err) {
            alert('일괄 개념 연결 실패: ' + err.message);
        }
    };

    // Implement Create Problem
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            // Wrap in backticks only if content is present, otherwise send empty string
            const prbKoreanVal = newProblem.content ? `\`${newProblem.content}\`` : '';
            formData.append('prbkorean', prbKoreanVal);

            if (newProblem.answer) formData.append('prbmainans', newProblem.answer);
            if (newProblem.solution) formData.append('prbexplain', newProblem.solution);
            
            // Context-aware creation: if R1 is selected, pass its ID
            if (selectedNode?.type === 'r1') {
                formData.append('r1_id', selectedNode.id);
            }

            if (newProblem.imageFile) {
                formData.append('image', newProblem.imageFile);
            }

            const created = await api.createProblem(formData);
            alert(`문제 생성이 완료되었습니다. ID: ${created.prbid}`);

            // If in Unlinked view OR R1 view, add to list (prepend)
            if (selectedNode.id === 'UNLINKED_PRBS' || selectedNode.type === 'r1') {
                setProblems(prev => [created, ...prev]);
            }

            // If it was linked to an R1, increment its count in the store
            if (selectedNode?.type === 'r1') {
                dispatch({ type: ACTIONS.INCREMENT_R1_COUNT, payload: { id: selectedNode.id } });
            }

            setNewProblem({ content: '', answer: '', solution: '', imageFile: null, imagePreview: null });
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

    const handleImageChange = (e, formType) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            if (formType === 'new') {
                setNewProblem(prev => ({
                    ...prev,
                    imageFile: file,
                    imagePreview: previewUrl
                }));
            } else {
                setEditForm(prev => ({
                    ...prev,
                    imageFile: file,
                    imagePreview: previewUrl
                }));
            }
        }
    };

    const handleRemoveImage = (formType) => {
        if (window.confirm("정말로 이미지를 삭제하시겠습니까?")) {
            if (formType === 'new') {
                setNewProblem(prev => ({
                    ...prev,
                    imageFile: null,
                    imagePreview: null
                }));
            } else {
                setEditForm(prev => ({
                    ...prev,
                    imageFile: null,
                    imagePreview: null,
                    prbpickor: ''
                }));
            }
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
                    {selectedNode.id === 'UNLINKED_PRBS' && problems.length > 0 && (
                        <div className="flex items-center gap-3 mr-2 bg-zinc-100/80 border border-zinc-200 px-3 py-1.5 rounded-lg shadow-sm">
                            <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={problems.length > 0 && selectedPrbIds.length === problems.length}
                                    onChange={handleToggleSelectAll}
                                    className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                                />
                                전체 선택
                            </label>
                            <div className="w-px h-4 bg-zinc-300" />
                            <button
                                disabled={selectedPrbIds.length === 0}
                                onClick={() => setShowLinkModal(true)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm ${
                                    selectedPrbIds.length > 0
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                                        : 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
                                }`}
                            >
                                <Link size={12} />
                                개념 일괄 연결 {selectedPrbIds.length > 0 && `(${selectedPrbIds.length}개)`}
                            </button>
                        </div>
                    )}

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
                                <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">문제 내용 (클립보드 이미지 복사 후 붙여넣기 가능)</label>
                                <textarea
                                    className="w-full p-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    rows={3}
                                    placeholder="문제 질문을 입력하세요... (텍스트 입력 또는 Ctrl+V 이미지 붙여넣기)"
                                    value={newProblem.content}
                                    onChange={e => setNewProblem({ ...newProblem, content: e.target.value })}
                                    onPaste={(e) => handlePaste(e, 'new')}
                                />
                            </div>

                            {/* Image Upload Area in Create Form */}
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">문제 이미지</label>
                                <div className="flex items-start gap-4 p-4 border border-zinc-200 rounded-lg bg-zinc-50/50">
                                    {newProblem.imagePreview ? (
                                        <div className="relative group w-48">
                                            <div className="w-full aspect-[1/0.617] bg-zinc-100 border border-zinc-200 rounded overflow-hidden flex items-center justify-center">
                                                <img
                                                    src={newProblem.imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-fill"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage('new')}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition-colors"
                                                title="이미지 제거"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-48 aspect-[1/0.617] flex items-center justify-center border-2 border-dashed border-zinc-300 rounded text-zinc-400 text-xs">
                                            이미지 없음
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="new-file-upload"
                                            className="hidden"
                                            onChange={(e) => handleImageChange(e, 'new')}
                                        />
                                        <label
                                            htmlFor="new-file-upload"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-300 rounded text-zinc-700 hover:bg-zinc-50 cursor-pointer shadow-sm text-sm font-medium"
                                        >
                                            <Plus size={16} />
                                            이미지 선택
                                        </label>
                                        <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                                            여기에 이미지를 복사하여 붙여넣거나 파일 선택을 하세요.<br />
                                            비율은 황금비율인 <span className="font-bold text-blue-600">1:0.617</span>이 적용됩니다.
                                        </p>
                                    </div>
                                </div>
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
                                const isSelected = selectedPrbIds.includes(problem.prbid);

                                return (
                                    <div 
                                        key={problem.prbid} 
                                        className={`group bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow relative ${
                                            isSelected ? 'border-blue-300 ring-2 ring-blue-50/50 bg-blue-50/5' : 'border-zinc-200'
                                        }`}
                                    >
                                        {selectedNode.id === 'UNLINKED_PRBS' && !isEditing && (
                                            <div className="absolute top-4 left-4 z-10">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleToggleSelect(problem.prbid)}
                                                    className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                                                />
                                            </div>
                                        )}

                                        {isEditing ? (
                                            /* Editing Mode */
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="text-xs text-blue-500 font-bold">EDITING: {problem.prbid}</div>
                                                </div>

                                                {/* Problem Content */}
                                                <div>
                                                    <label className="block text-xs font-bold text-zinc-500 mb-1">본문 (한글) (클립보드 이미지 복사 후 붙여넣기 가능)</label>
                                                    <textarea
                                                        className="w-full p-3 border border-zinc-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                                        rows={4}
                                                        value={editForm.prbkorean}
                                                        onChange={e => setEditForm({ ...editForm, prbkorean: e.target.value })}
                                                        onPaste={(e) => handlePaste(e, 'edit')}
                                                    />
                                                </div>

                                                {/* Image Upload */}
                                                <div>
                                                    <label className="block text-xs font-bold text-zinc-500 mb-1">문제 이미지</label>
                                                    <div className="flex items-start gap-4 p-4 border border-zinc-200 rounded-lg bg-zinc-50">
                                                        {editForm.imagePreview ? (
                                                            <div className="relative group w-48">
                                                                <div className="w-full aspect-[1/0.617] bg-zinc-100 border border-zinc-200 rounded overflow-hidden flex items-center justify-center">
                                                                    <img
                                                                        src={editForm.imagePreview}
                                                                        alt="Preview"
                                                                        className="w-full h-full object-fill"
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => handleRemoveImage('edit')}
                                                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition-colors"
                                                                    title="이미지 제거"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="w-48 aspect-[1/0.617] flex items-center justify-center border-2 border-dashed border-zinc-300 rounded text-zinc-400 text-xs">
                                                                이미지 없음
                                                            </div>
                                                        )}

                                                        <div className="flex-1">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                id={`file-upload-${problem.prbid}`}
                                                                className="hidden"
                                                                onChange={(e) => handleImageChange(e, 'edit')}
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
                                                <div className={`pr-10 ${selectedNode.id === 'UNLINKED_PRBS' ? 'pl-6' : ''}`}>
                                                    <div className="text-xs text-zinc-400 mb-2">{problem.prbid}</div>
                                                    {/* Content */}
                                                    <h4 className="font-medium text-zinc-800 text-lg mb-2" dangerouslySetInnerHTML={{ __html: problem.prbkorean?.replaceAll('`', '') }}></h4>

                                                    {/* Problem Image (Golden Ratio layout applied with cache bust) */}
                                                    {problem.prbpickor && (
                                                        <div className="mb-4 w-72 max-w-full">
                                                            <div className="w-full aspect-[1/0.617] bg-zinc-100 border border-zinc-200 rounded overflow-hidden flex items-center justify-center">
                                                                <img
                                                                    src={`${problem.prbpickor}?t=${new Date(problem.updatedAt || problem.prbregi || Date.now()).getTime()}`}
                                                                    alt="Problem Attachment"
                                                                    className="w-full h-full object-fill"
                                                                    onError={(e) => e.target.style.display = 'none'}
                                                                />
                                                            </div>
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
            
            {showLinkModal && (
                <LinkProblemsModal
                    state={state}
                    selectedCount={selectedPrbIds.length}
                    onClose={() => setShowLinkModal(false)}
                    onConfirm={handleLinkProblems}
                />
            )}
        </div>
    );
};

// ==========================================
// 개념 일괄 연결 모달 (LinkProblemsModal)
// ==========================================
const LinkProblemsModal = ({ state, selectedCount, onClose, onConfirm }) => {
    const [selectedR3, setSelectedR3] = useState('');
    const [selectedR2, setSelectedR2] = useState('');
    const [selectedR1, setSelectedR1] = useState('');

    const r3List = Object.values(state.r3).sort((a, b) => (a.order || 0) - (b.order || 0));
    const r2List = selectedR3
        ? Object.values(state.r2).filter(r2 => r2.r3_id === selectedR3).sort((a, b) => (a.order || 0) - (b.order || 0))
        : [];
    const r1List = selectedR2
        ? Object.values(state.r1).filter(r1 => r1.r2_id === selectedR2).sort((a, b) => (a.order || 0) - (b.order || 0))
        : [];

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-zinc-100 animate-in zoom-in duration-200">
                <h3 className="text-lg font-bold text-zinc-900 mb-2 flex items-center gap-2">
                    <Link className="text-blue-600" size={18} />
                    문제 일괄 개념 연결
                </h3>
                <p className="text-xs text-zinc-500 mb-6">
                    선택한 <span className="text-blue-600 font-bold">{selectedCount}개</span>의 문제를 아래 개념(R1) 노드에 연결합니다.
                </p>

                <div className="space-y-4 mb-6">
                    {/* 과목 (R3) */}
                    <div>
                        <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-wider">1. 과목 (R3) 선택</label>
                        <select
                            className="w-full p-2.5 border border-zinc-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-xs transition-all"
                            value={selectedR3}
                            onChange={(e) => {
                                setSelectedR3(e.target.value);
                                setSelectedR2('');
                                setSelectedR1('');
                            }}
                        >
                            <option value="">-- 과목을 선택하세요 --</option>
                            {r3List.map(r3 => (
                                <option key={r3.id} value={r3.id}>{r3.title?.replaceAll('`', '')}</option>
                            ))}
                        </select>
                    </div>

                    {/* 단원 (R2) */}
                    <div>
                        <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-wider">2. 단원 (R2) 선택</label>
                        <select
                            className="w-full p-2.5 border border-zinc-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-xs disabled:bg-zinc-50 disabled:text-zinc-400 transition-all"
                            disabled={!selectedR3}
                            value={selectedR2}
                            onChange={(e) => {
                                setSelectedR2(e.target.value);
                                setSelectedR1('');
                            }}
                        >
                            <option value="">-- 단원을 선택하세요 --</option>
                            {r2List.map(r2 => (
                                <option key={r2.id} value={r2.id}>{r2.title?.replaceAll('`', '')}</option>
                            ))}
                        </select>
                    </div>

                    {/* 개념 (R1) */}
                    <div>
                        <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-wider">3. 개념 (R1) 선택</label>
                        <select
                            className="w-full p-2.5 border border-zinc-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-xs disabled:bg-zinc-50 disabled:text-zinc-400 transition-all"
                            disabled={!selectedR2}
                            value={selectedR1}
                            onChange={(e) => setSelectedR1(e.target.value)}
                        >
                            <option value="">-- 개념을 선택하세요 --</option>
                            {r1List.map(r1 => (
                                <option key={r1.id} value={r1.id}>{r1.title?.replaceAll('`', '')}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4 text-xs font-semibold">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={() => onConfirm(selectedR1)}
                        className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-200 disabled:text-zinc-400 rounded-lg shadow-sm transition-all"
                        disabled={!selectedR1}
                    >
                        연결 완료
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProblemWorkspace;
