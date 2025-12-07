import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ProjectV2Item } from '../types/github';
import { GitHubClient } from '../lib/github';
import { useState } from 'react';

interface StatusModalProps {
  item: ProjectV2Item;
  onClose: () => void;
}

export function StatusModal({ item, onClose }: StatusModalProps) {
  const { token, selectedProject, statusField } = useStore();
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (optionId: string) => {
    if (!token || !selectedProject || !statusField) return;

    setLoading(true);
    try {
      const client = new GitHubClient(token);
      await client.updateItemStatus(
        selectedProject.id,
        item.id,
        statusField.id,
        optionId
      );
      window.location.reload();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = item.fieldValues.nodes.find(
    (fv) => fv.field?.name === 'Status'
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
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

        <h3 className="text-xl font-bold mb-4">{item.content?.title || 'Untitled'}</h3>

        {item.content?.body && (
          <p className="text-sm text-secondary mb-6">{item.content.body}</p>
        )}

        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3">Status ändern</h4>
          <div className="space-y-2">
            {statusField?.options?.map((option) => {
              const isActive = currentStatus?.name === option.name;
              return (
                <motion.button
                  key={option.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStatusChange(option.id)}
                  disabled={loading || isActive}
                  className={`w-full p-3 rounded-xl text-left font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'glass-light hover:bg-white/10'
                  } disabled:opacity-50`}
                >
                  {option.name}
                </motion.button>
              );
            })}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full py-3 rounded-xl glass-light font-semibold"
        >
          Schließen
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
