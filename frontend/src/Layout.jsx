import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout as LayoutIcon, Edit3 } from 'lucide-react';
import clsx from 'clsx';

const Layout = () => {
    const location = useLocation();

    const NavItem = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname.startsWith(to);
        return (
            <Link
                to={to}
                className={clsx(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                )}
            >
                <Icon size={18} />
                <span>{label}</span>
            </Link>
        );
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white">
            {/* Top Navigation Bar */}
            <header className="flex-none h-14 border-b border-zinc-200 flex items-center px-6 gap-6 bg-white z-10 shadow-sm">
                <div className="font-bold text-xl text-zinc-900 mr-4">PrismMath</div>
                <nav className="flex items-center gap-2">
                    <NavItem to="/cms" icon={LayoutIcon} label="수학 커리큘럼 CMS" />
                    <NavItem to="/editor" icon={Edit3} label="Quill 에디터" />
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden relative">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
