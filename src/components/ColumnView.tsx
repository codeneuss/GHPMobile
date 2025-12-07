import { useState, useEffect } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ProjectV2Item } from '../types/github';
import { ItemCard } from './ItemCard';
import { CreateItemButton } from './CreateItemButton';

export function ColumnView() {
  const { selectedProject, currentColumnIndex, setCurrentColumnIndex, setStatusField } = useStore();
  const [columns, setColumns] = useState<{ id: string; name: string; items: ProjectV2Item[] }[]>([]);
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ['rgba(10, 132, 255, 0.1)', 'transparent', 'rgba(10, 132, 255, 0.1)']
  );

  useEffect(() => {
    if (selectedProject) {
      const field = selectedProject.fields.nodes.find(
        (f) => f.name === 'Status' && f.options
      );

      if (field && field.options) {
        setStatusField(field);

        const cols = field.options.map((option) => {
          const items = selectedProject.items.nodes.filter((item) => {
            const statusValue = item.fieldValues.nodes.find(
              (fv) => fv.field?.name === 'Status'
            );
            return statusValue?.name === option.name;
          });

          return {
            id: option.id,
            name: option.name,
            items,
          };
        });

        setColumns(cols);
      }
    }
  }, [selectedProject, setStatusField]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;

    if (info.offset.x > threshold && currentColumnIndex > 0) {
      setCurrentColumnIndex(currentColumnIndex - 1);
    } else if (info.offset.x < -threshold && currentColumnIndex < columns.length - 1) {
      setCurrentColumnIndex(currentColumnIndex + 1);
    }
  };

  if (!selectedProject || columns.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-secondary">Keine Spalten verfügbar</p>
      </div>
    );
  }

  const currentColumn = columns[currentColumnIndex];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <motion.div
        style={{ background }}
        className="px-4 py-4 safe-top"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">{currentColumn.name}</h2>
          <div className="flex gap-1">
            {columns.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentColumnIndex
                    ? 'w-8 bg-primary'
                    : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-secondary">
          {currentColumn.items.length} {currentColumn.items.length === 1 ? 'Item' : 'Items'}
        </p>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="flex-1 overflow-y-auto px-4 pb-24 safe-bottom"
      >
        <div className="space-y-3 py-4">
          {currentColumn.items.map((item, index) => (
            <ItemCard key={item.id} item={item} index={index} />
          ))}

          {currentColumn.items.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-secondary">Keine Items in dieser Spalte</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      <CreateItemButton />
    </div>
  );
}
