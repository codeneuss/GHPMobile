import { motion } from 'framer-motion';
import { ProjectV2Item } from '../types/github';
import { useState } from 'react';
import { StatusModal } from './StatusModal';

interface ItemCardProps {
  item: ProjectV2Item;
  index: number;
}

export function ItemCard({ item, index }: ItemCardProps) {
  const [showStatusModal, setShowStatusModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Heute';
    if (diffDays === 1) return 'Gestern';
    if (diffDays < 7) return `vor ${diffDays}d`;

    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  const statusValue = item.fieldValues.nodes.find(
    (fv) => fv.field?.name && fv.field.name.toLowerCase().includes('status')
  );

  const getStatusColor = (status?: string) => {
    if (!status) return 'from-gray-500 to-gray-600';
    const lower = status.toLowerCase();
    if (lower.includes('done') || lower.includes('fertig')) return 'from-green-500 to-emerald-600';
    if (lower.includes('progress') || lower.includes('arbeit')) return 'from-blue-500 to-primary';
    if (lower.includes('todo') || lower.includes('backlog')) return 'from-gray-500 to-gray-600';
    if (lower.includes('review')) return 'from-purple-500 to-purple-600';
    return 'from-orange-500 to-orange-600';
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.05, 0.3), type: 'spring', stiffness: 300 }}
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setShowStatusModal(true)}
        className="glass rounded-2xl p-5 cursor-pointer border border-white/5 hover:border-white/10 transition-all shadow-lg hover:shadow-xl relative overflow-hidden group"
      >
        {/* Gradient Accent */}
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${getStatusColor(statusValue?.name)} opacity-80`} />

        {/* Hover Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        />

        <div className="relative z-10">
          {/* Title */}
          <h3 className="font-bold text-base mb-2 leading-tight">
            {item.content?.title || 'Untitled'}
          </h3>

          {/* Body */}
          {item.content?.body && (
            <p className="text-sm text-secondary mb-4 line-clamp-2 leading-relaxed">
              {item.content.body}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between gap-3">
            {/* Status Badge */}
            {statusValue && (
              <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${getStatusColor(statusValue.name)} text-white text-xs font-semibold shadow-sm`}>
                {statusValue.name}
              </div>
            )}

            {/* Date */}
            {item.content?.createdAt && (
              <div className="flex items-center gap-1.5 text-xs text-secondary">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatDate(item.content.createdAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tap Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute top-4 right-4 text-primary/50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </motion.div>

      {showStatusModal && (
        <StatusModal
          item={item}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </>
  );
}
