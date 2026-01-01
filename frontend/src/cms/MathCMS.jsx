import React, { useState } from 'react';
import { CMSProvider } from './store';
import Sidebar from './components/Sidebar';
import ProblemWorkspace from './components/ProblemWorkspace';

const MathCMS = () => {
    const [selectedNode, setSelectedNode] = useState(null);

    return (
        <CMSProvider>
            <div className="flex h-screen w-full bg-white text-zinc-900 font-sans selection:bg-blue-100">
                <Sidebar
                    selectedNode={selectedNode}
                    onSelectNode={setSelectedNode}
                />
                <ProblemWorkspace
                    selectedNode={selectedNode}
                />
            </div>
        </CMSProvider>
    );
};

export default MathCMS;
