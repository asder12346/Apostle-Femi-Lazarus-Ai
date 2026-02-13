
import React from 'react';

interface EmptyStateProps {
  onSuggestedClick: (text: string) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onSuggestedClick }) => {
  const suggestions = [
    { title: "Spirit Life", text: "Explain the concept of walking in the Spirit according to Apostle Femi Lazarus." },
    { title: "Divine Purpose", text: "How do I discover and align with my spiritual assignment?" },
    { title: "Strategic Living", text: "What are the keys to strategic spiritual and personal growth?" },
    { title: "The Prophetic", text: "Understanding the role of the prophetic in a believer's life." }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 text-center max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-700">
      <div className="w-20 h-20 bg-[var(--user-bubble)] rounded-3xl flex items-center justify-center text-[var(--text-primary)] mb-8 shadow-2xl shadow-black/5 ring-1 ring-[var(--divider)] transition-transform hover:scale-105">
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11 2h2v5h5v2h-5v13h-2V9H6V7h5V2z" />
        </svg>
      </div>

      <h2 className="text-3xl font-black text-[var(--text-primary)] mb-4 tracking-tight uppercase">
        Femi Lazarus AI
      </h2>
      <p className="text-[var(--text-secondary)] mb-10 text-lg leading-relaxed max-w-lg">
        Explore refined spiritual insights and verified sermon knowledge from Apostle Femi Lazarus.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestedClick(s.text)}
            className="group text-left p-6 bg-[var(--input-bg)] border border-[var(--divider)] rounded-2xl transition-all shadow-sm hover:shadow-md hover:border-[var(--input-border)] active:scale-95"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest bg-[var(--chat-bg)] px-2 py-0.5 rounded">
                {s.title}
              </span>
              <svg className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 leading-relaxed">
              {s.text}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
