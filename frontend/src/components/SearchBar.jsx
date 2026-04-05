import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="relative group w-full sm:min-w-[400px]">
            <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-12 py-4 rounded-2xl bg-slate-50 border border-slate-200 group-hover:border-indigo-500/30 text-slate-800 font-semibold text-sm outline-none transition-all duration-300 shadow-sm focus:shadow-xl focus:bg-white placeholder:text-slate-400"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <span className="text-xl">🔍</span>
            </div>
        </div>
    );
};

export default SearchBar;
