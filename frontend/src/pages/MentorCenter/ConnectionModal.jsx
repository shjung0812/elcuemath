import React from 'react';

const ConnectionModal = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-96 transform transition-all scale-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Start Connection</h2>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => onSelect('video')}
                        className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl transition-colors group"
                    >
                        <div className="w-12 h-12 mb-3 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-600">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.818v6.364a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-blue-900">Video Call</span>
                    </button>

                    <button
                        onClick={() => onSelect('audio')}
                        className="flex flex-col items-center justify-center p-6 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-xl transition-colors group"
                    >
                        <div className="w-12 h-12 mb-3 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-600">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-green-900">Audio Call</span>
                    </button>
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium underline"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConnectionModal;
