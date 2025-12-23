
import React from 'react';
import { motion } from 'framer-motion';
import { User, Trash2 } from 'lucide-react';
import { API_ENDPOINTS } from '../constants';

export interface Guest {
  handle: string;
  avatarUrl: string;
  bio: string;
  followerCount: string;
}

interface GuestCardProps {
  guest: Guest;
  onClick: () => void;
  index: number;
  isAdmin?: boolean;
  onDelete?: () => void;
}

export const GuestCard: React.FC<GuestCardProps> = ({ guest, onClick, index, isAdmin, onDelete }) => {
  // Use proxy for images to avoid hotlink protection, unless it's a mock/placeholder
  const imageUrl = guest.avatarUrl.startsWith('http') && !guest.avatarUrl.includes('picsum')
    ? `${API_ENDPOINTS.PROXY_IMAGE}?url=${encodeURIComponent(guest.avatarUrl)}`
    : guest.avatarUrl;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal
    if (onDelete) onDelete();
  };

  return (
    <motion.div
      layoutId={`card-${guest.handle}`}
      onClick={onClick}
      className={`group relative w-full h-full bg-white/5 border transition-colors duration-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center p-6 gap-6 ${isAdmin ? 'border-red-500/30 hover:bg-red-900/10' : 'border-white/5 hover:border-ig-pink/30 hover:bg-white/10'}`}
    >
      {/* Admin Delete Overlay/Button */}
      {isAdmin && (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleDelete}
            className="absolute top-2 right-2 z-20 w-8 h-8 bg-red-600 hover:bg-red-500 text-white flex items-center justify-center rounded-sm shadow-lg transition-colors"
        >
            <Trash2 className="w-4 h-4" />
        </motion.button>
      )}

      {/* Avatar Container */}
      <div className="relative">
        <div className={`absolute -inset-1 rounded-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 blur-[1px] ${isAdmin ? 'bg-red-900' : 'bg-gradient-to-tr from-yellow-400 via-ig-pink to-purple-600'}`} />
        {/* Reduced size from w-24 h-24 to w-20 h-20 to prevent edge crowding */}
        <div className="relative w-20 h-20 rounded-full p-[2px] bg-deep-black overflow-hidden">
             <img 
                src={imageUrl} 
                alt={guest.handle} 
                className={`w-full h-full object-cover rounded-full bg-gray-800 ${isAdmin ? 'grayscale contrast-125' : ''}`}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/200/200?grayscale' }}
             />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col items-center text-center w-full z-10">
        <h3 className={`text-xl font-bold tracking-tight transition-colors ${isAdmin ? 'text-red-400' : 'text-white group-hover:text-ig-pink'}`}>
          @{guest.handle}
        </h3>
        <span className="text-[10px] font-mono text-gray-400 mt-1 uppercase tracking-wider">
          {guest.followerCount} Followers
        </span>
        
        <p className="mt-4 text-xs font-light text-gray-500 line-clamp-2 w-full max-w-[80%] leading-relaxed group-hover:text-gray-300 transition-colors">
          {guest.bio || "No biography available."}
        </p>
      </div>
      
      {/* Decorative Corner (Only show if NOT admin, as Admin has the delete button) */}
      {!isAdmin && (
        <>
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20 group-hover:border-ig-pink transition-colors" />
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20 group-hover:border-ig-pink transition-colors" />
        </>
      )}

    </motion.div>
  );
};
