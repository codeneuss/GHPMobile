import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { GitHubClient } from '../lib/github';

export function CreateItemButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const { token, selectedProject } = useStore();

  const handleCreate = async () => {
    if (!title.trim() || !token || !selectedProject) return;

    setLoading(true);
    try {
      const client = new GitHubClient(token);
      await client.createDraftIssue(
        selectedProject.id,
        title,
        body || undefined
      );
      setTitle('');
      setBody('');
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Failed to create item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center safe-bottom z-40"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full glass rounded-t-3xl p-6 safe-bottom"
            >
              <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-6" />

              <h3 className="text-xl font-bold mb-4">Neues Item erstellen</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="title">
                    Titel
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Item-Titel eingeben..."
                    className="w-full px-4 py-3 rounded-xl glass-light"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="body">
                    Beschreibung (optional)
                  </label>
                  <textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Beschreibung hinzufügen..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl glass-light resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 rounded-xl glass-light font-semibold"
                >
                  Abbrechen
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreate}
                  disabled={!title.trim() || loading}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50"
                >
                  {loading ? 'Erstellen...' : 'Erstellen'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
