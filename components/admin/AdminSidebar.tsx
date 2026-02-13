
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    BarChart3,
    FilePlus2,
    Library,
    Settings,
    MessageSquare,
    CheckCircle2,
    ShieldCheck
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
    const navItems = [
        { icon: <BarChart3 className="w-5 h-5" />, label: "Overview", path: "/admin" },
        { icon: <FilePlus2 className="w-5 h-5" />, label: "Add Sermon", path: "/admin/add" },
        { icon: <Library className="w-5 h-5" />, label: "Library", path: "/admin/library" },
        { icon: <CheckCircle2 className="w-5 h-5" />, label: "Review", path: "/admin/review" },
        { icon: <Settings className="w-5 h-5" />, label: "Settings", path: "/admin/settings" },
    ];

    return (
        <aside className="w-72 border-r border-[var(--divider)] bg-[var(--chat-bg)] flex flex-col pt-10 pb-6 px-6">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center shadow-lg shadow-black/10 ring-1 ring-[var(--divider)] overflow-hidden">
                    <img src="/download.jpeg" alt="Apostle Femi Lazarus AI" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h2 className="text-sm font-black uppercase tracking-tighter leading-none">AFL AI</h2>
                    <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] opacity-80">Admin Center</span>
                </div>
            </div>

            <nav className="flex-1 flex flex-col gap-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/admin"}
                        className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200
              ${isActive
                                ? 'bg-[var(--user-bubble)] text-[var(--text-primary)] shadow-sm'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--input-bg)] hover:text-[var(--text-primary)]'}
            `}
                    >
                        {item.icon}
                        <span className="uppercase tracking-widest text-[11px]">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto">
                <NavLink
                    to="/"
                    className="flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm text-[var(--text-secondary)] hover:bg-[var(--input-bg)] hover:text-[var(--text-primary)] transition-all"
                >
                    <MessageSquare className="w-5 h-5" />
                    <span className="uppercase tracking-widest text-[11px]">Back to Chat</span>
                </NavLink>

                <div className="mt-8 pt-8 border-t border-[var(--divider)] px-2">
                    <div className="flex items-center gap-3 text-[var(--text-secondary)] opacity-60">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Secure Session</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
