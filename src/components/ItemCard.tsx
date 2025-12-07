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
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(date);
  };

  const statusValue = item.fieldValues.nodes.find(
    (fv) => fv.field?.name === 'Status'
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowStatusModal(true)}
        className="glass rounded-2xl p-4 cursor-pointer"
      >
        <h3 className="font-semibold text-lg mb-2">{item.content?.title || 'Untitled'}</h3>

        {item.content?.body && (
          <p className="text-sm text-secondary mb-3 line-clamp-3">
            {item.content.body}
          </p>
        )}

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {statusValue && (
              <span className="px-2 py-1 rounded-lg glass-light">
                {statusValue.name}
              </span>
            )}
          </div>

          {item.content?.createdAt && (
            <span className="text-secondary">
              {formatDate(item.content.createdAt)}
            </span>
          )}
        </div>
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
