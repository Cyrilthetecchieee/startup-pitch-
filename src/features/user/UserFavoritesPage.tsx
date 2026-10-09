import React, { useState, useEffect } from 'react';
import { subscribeFavorites, removeFavorite } from '@/lib/repositories';
import { FavoriteItem } from '@/types';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { Badge } from '@/components/ui/Badge';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { formatFriendlyDate } from '@/lib/dates';

export const UserFavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.uid || 'user_demo_uid';
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    return subscribeFavorites(userId, setFavorites);
  }, [userId]);

  const handleRemove = async (id: string) => {
    await removeFavorite(userId, id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-lime-400" />
          My Saved Inspirations & Articles
        </h2>
        <p className="text-xs text-gray-400">
          Bookmarked science facts, motivational quotes, and recovery guides.
        </p>
      </div>

      {favorites.length === 0 ? (
        <SpotlightCard className="p-8 text-center border-dashed border-dark-border">
          <Bookmark className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400">You haven't saved any favorites yet.</p>
          <p className="text-xs text-gray-500 mt-1">
            Click "Save Favorite" on the Five-Minute Boost or Health Hub to bookmark items here.
          </p>
        </SpotlightCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((fav) => (
            <SpotlightCard key={fav.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={fav.type === 'fact' ? 'cyan' : 'lime'} size="sm" className="capitalize">
                    {fav.type}
                  </Badge>
                  <span className="text-[10px] text-gray-500 font-mono">
                    Saved {formatFriendlyDate(fav.savedAt)}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1.5">{fav.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed italic line-clamp-3">
                  "{fav.snippet}"
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-dark-border flex justify-end">
                <button
                  type="button"
                  onClick={() => handleRemove(fav.id)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-coral-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Bookmark</span>
                </button>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}
    </div>
  );
};
