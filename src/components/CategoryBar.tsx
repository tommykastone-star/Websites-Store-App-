import React, { useState } from 'react';
import { 
  Plus, 
  FolderPlus, 
  Star, 
  Clock, 
  LayoutGrid, 
  Users, 
  Film, 
  Code2, 
  Briefcase, 
  Sparkles, 
  Newspaper,
  Tag,
  Zap
} from 'lucide-react';
import { Category } from '../types/hub';

interface CategoryBarProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  categoryCounts: Record<string, number>;
  onAddCategory: (name: string) => void;
  favoritesCount: number;
  recentCount: number;
  pwaCount: number;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  categoryCounts,
  onAddCategory,
  favoritesCount,
  recentCount,
  pwaCount,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim());
    setNewCatName('');
    setIsAdding(false);
  };

  const getIconForCategory = (id: string, name: string) => {
    const lower = name.toLowerCase();
    if (id === 'all') return <LayoutGrid className="w-3.5 h-3.5" />;
    if (id === 'pwa' || lower.includes('pwa')) return <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />;
    if (id === 'favorites' || lower.includes('favorite')) return <Star className="w-3.5 h-3.5 text-amber-400" />;
    if (id === 'recent' || lower.includes('recent')) return <Clock className="w-3.5 h-3.5 text-cyan-400" />;
    if (lower.includes('social')) return <Users className="w-3.5 h-3.5 text-blue-400" />;
    if (lower.includes('entertain') || lower.includes('media') || lower.includes('film')) return <Film className="w-3.5 h-3.5 text-rose-400" />;
    if (lower.includes('dev') || lower.includes('tech') || lower.includes('code')) return <Code2 className="w-3.5 h-3.5 text-emerald-400" />;
    if (lower.includes('product') || lower.includes('work')) return <Briefcase className="w-3.5 h-3.5 text-purple-400" />;
    if (lower.includes('ai') || lower.includes('research')) return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
    if (lower.includes('news')) return <Newspaper className="w-3.5 h-3.5 text-orange-400" />;
    return <Tag className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-1.5 min-w-max px-1">
        {/* All Sites */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeCategoryId === 'all'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 border border-white/5'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>All Apps</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeCategoryId === 'all' ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'
          }`}>
            {categoryCounts['all'] || 0}
          </span>
        </button>

        {/* PWAs Only Filter Tab */}
        <button
          onClick={() => onSelectCategory('pwa')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeCategoryId === 'pwa'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
              : 'bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/30'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${activeCategoryId === 'pwa' ? 'fill-white text-white' : 'fill-cyan-400 text-cyan-400'}`} />
          <span>⚡ PWAs</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeCategoryId === 'pwa' ? 'bg-white/20 text-white' : 'bg-cyan-500/20 text-cyan-300'
          }`}>
            {pwaCount}
          </span>
        </button>

        {/* Favorites */}
        <button
          onClick={() => onSelectCategory('favorites')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeCategoryId === 'favorites'
              ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/30'
              : 'bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 border border-white/5'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${activeCategoryId === 'favorites' ? 'fill-slate-950 text-slate-950' : 'fill-amber-400 text-amber-400'}`} />
          <span>Favorites</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeCategoryId === 'favorites' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700 text-slate-400'
          }`}>
            {favoritesCount}
          </span>
        </button>

        {/* Recent */}
        <button
          onClick={() => onSelectCategory('recent')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeCategoryId === 'recent'
              ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/30'
              : 'bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 border border-white/5'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Recent</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeCategoryId === 'recent' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700 text-slate-400'
          }`}>
            {recentCount}
          </span>
        </button>

        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Dynamic Categories */}
        {categories
          .filter((c) => c.id !== 'all' && c.id !== 'favorites' && c.id !== 'recent' && c.id !== 'pwa')
          .map((cat) => {
            const count = categoryCounts[cat.name] || categoryCounts[cat.id] || 0;
            const isActive = activeCategoryId === cat.id || activeCategoryId === cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 border border-white/5'
                }`}
              >
                {getIconForCategory(cat.id, cat.name)}
                <span>{cat.name}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}

        {/* Add Category inline form / button */}
        {isAdding ? (
          <form onSubmit={handleCreate} className="flex items-center gap-1 bg-slate-800/90 rounded-full pl-2.5 pr-1 py-0.5 border border-cyan-500/50">
            <input
              type="text"
              autoFocus
              placeholder="Category name"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-24"
            />
            <button
              type="submit"
              className="p-1 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-[10px]"
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-white px-1 text-xs"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800/80 border border-dashed border-white/10 transition"
            title="Create new category"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Category</span>
          </button>
        )}
      </div>
    </div>
  );
};
