import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export function Header() {
  const { user, selectedProject, logout } = useStore();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass safe-top sticky top-0 z-50 border-b border-white/10"
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user && (
            <>
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-white/20"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{user.name}</span>
                {selectedProject && (
                  <span className="text-xs text-secondary">{selectedProject.title}</span>
                )}
              </div>
            </>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={logout}
          className="p-2 rounded-xl glass-light"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </motion.button>
      </div>
    </motion.header>
  );
}
