import React, { useState } from 'react';
import { useCMS } from '../store';
import { Trash2, Plus, AlertCircle, Link2Off } from 'lucide-react';

const ProblemWorkspace = ({ selectedNode }) => {
    const { state, dispatch, ACTIONS } = useCMS();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProblem, setNewProblem] = useState({ content: '', answer: '', solution: '' });

    if (!selectedNode) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 h-full bg-zinc-50/50">
                <AlertCircle size={48} className="mb-4 opacity-20" />
                <p>왼쪽 사이드바에서 개념(R1)을 선택하여 문제를 확인하세요.</p>
            </div>
        );
    }

    // Get problem IDs linked to this R1
    const linkedProblemIds = state.r1_problems[selectedNode.id] || [];
    const linkedProblems = linkedProblemIds.map(id => state.problems[id]).filter(Boolean);

    const handleCreate = (e) => {
        e.preventDefault();
        dispatch({
            type: ACTIONS.ADD_PROBLEM,
            payload: { ...newProblem, r1_id: selectedNode.id }
        });
        setNewProblem({ content: '', answer: '', solution: '' });
        setShowAddForm(false);
    };

    const handleUnlink = (problemId) => {
        dispatch({
            type: ACTIONS.UNLINK_PROBLEM,
            payload: { r1_id: selectedNode.id, problem_id: problemId }
        });
    };

    return (
        <div className="flex-1 h-full flex flex-col bg-zinc-50/30 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-zinc-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div>
                    <div className="text-xs font-semibold text-blue-600 mb-1">개념 (CONCEPT)</div>
                    <h1 className="text-2xl font-bold text-zinc-900">{selectedNode.title}</h1>
                    <div className="text-sm text-zinc-500 mt-1">ID: {selectedNode.id}</div>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    문제 추가
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">

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
                <div className="space-y-4">
                    {linkedProblems.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-zinc-200 rounded-xl">
                            <p className="text-zinc-400">이 개념에 연결된 문제가 없습니다.</p>
                        </div>
                    ) : (
                        linkedProblems.map(problem => (
                            <div key={problem.id} className="group bg-white rounded-xl border border-zinc-200 p-5 shadow-sm hover:shadow-md transition-shadow relative">
                                <div className="pr-10">
                                    <h4 className="font-medium text-zinc-800 text-lg mb-2">{problem.content}</h4>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded inline-block border border-emerald-100">
                                            <span className="font-semibold opacity-70 mr-2">답:</span>
                                            {problem.answer}
                                        </div>
                                        {problem.solution && (
                                            <div className="bg-zinc-50 text-zinc-600 px-2 py-1 rounded inline-block border border-zinc-200">
                                                <span className="font-semibold opacity-70 mr-2">해설:</span>
                                                {problem.solution}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button
                                        onClick={() => handleUnlink(problem.id)}
                                        title="개념에서 연결 해제"
                                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Link2Off size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProblemWorkspace;
