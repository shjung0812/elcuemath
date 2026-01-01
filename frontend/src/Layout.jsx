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
            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden relative">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
