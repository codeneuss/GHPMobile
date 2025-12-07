import { useState, useEffect } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ProjectV2Item } from '../types/github';
import { ItemCard } from './ItemCard';
import { CreateItemButton } from './CreateItemButton';

export function ColumnView() {
  const { selectedProject, currentColumnIndex, setCurrentColumnIndex, setStatusField, setSelectedProject } = useStore();
  const [columns, setColumns] = useState<{ id: string; name: string; items: ProjectV2Item[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ['rgba(10, 132, 255, 0.1)', 'transparent', 'rgba(10, 132, 255, 0.1)']
  );

  useEffect(() => {
    if (selectedProject) {
      setLoading(true);

      // Finde Status-Feld (mit verschiedenen möglichen Namen)
      const statusField = selectedProject.fields.nodes.find(
        (f) => f.options && (
          f.name === 'Status' ||
          f.name === 'status' ||
          f.name.toLowerCase().includes('status')
        )
      );

      if (statusField && statusField.options) {
        setStatusField(statusField);

        const cols = statusField.options.map((option) => {
          const items = selectedProject.items.nodes.filter((item) => {
            const statusValue = item.fieldValues.nodes.find(
              (fv) => fv.field?.id === statusField.id
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
      } else {
        // Fallback: Erstelle eine "Alle Items" Spalte
        setColumns([{
          id: 'all',
          name: 'Alle Items',
          items: selectedProject.items.nodes,
        }]);
      }

      setLoading(false);
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

  if (!selectedProject) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (columns.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 safe-top safe-bottom">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="glass rounded-3xl p-8 text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Keine Spalten gefunden</h3>
          <p className="text-secondary mb-6 text-sm">
            Dieses Projekt hat kein Status-Feld. Bitte füge ein Status-Feld in GitHub hinzu.
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedProject(null)}
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold"
          >
            Zurück zu Projekten
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const currentColumn = columns[currentColumnIndex];

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ background }}
        className="relative z-10 px-6 py-6 safe-top border-b border-white/5"
      >
        {/* Back Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedProject(null)}
          className="mb-4 flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Projekte</span>
        </motion.button>

        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              {currentColumn.name}
            </h2>
            <p className="text-sm text-secondary mt-1">
              {currentColumn.items.length} {currentColumn.items.length === 1 ? 'Item' : 'Items'}
            </p>
          </div>

          {/* Column Indicators */}
          {columns.length > 1 && (
            <div className="flex gap-1.5">
              {columns.map((_, index) => (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    width: index === currentColumnIndex ? 32 : 6,
                    backgroundColor: index === currentColumnIndex
                      ? 'rgba(10, 132, 255, 1)'
                      : 'rgba(255, 255, 255, 0.2)',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="h-1.5 rounded-full"
                />
              ))}
            </div>
          )}
        </div>

        {/* Swipe Hint */}
        {columns.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 text-xs text-secondary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>Wische für {columns[currentColumnIndex + 1]?.name || columns[0].name}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Items Container */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="flex-1 overflow-y-auto px-6 pb-32 safe-bottom relative z-10"
      >
        <div className="space-y-4 py-6">
          {currentColumn.items.map((item, index) => (
            <ItemCard key={item.id} item={item} index={index} />
          ))}

          {currentColumn.items.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-20 h-20 mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-secondary text-lg font-medium">Keine Items</p>
              <p className="text-secondary/60 text-sm mt-1">Erstelle dein erstes Item</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      <CreateItemButton />
    </div>
  );
}
