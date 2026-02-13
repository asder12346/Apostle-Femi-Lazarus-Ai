
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-[var(--chat-bg)]/85 backdrop-blur-md px-6 py-4 border-[var(--divider)]">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center shadow-lg shadow-black/10 ring-1 ring-[var(--divider)] overflow-hidden">
            <img src="/download.jpeg" alt="Apostle Femi Lazarus AI" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-primary)] leading-tight">
              Apostle Femi Lazarus AI
            </h1>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest opacity-90">
              Spiritual Wisdom
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-[var(--input-bg)] border border-[var(--divider)] text-[var(--text-secondary)] text-[10px] font-black rounded-full uppercase tracking-tight shadow-sm">
            Verified Knowledge
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
