import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { GitHubClient } from '../lib/github';

export function ProjectSelector() {
  const { user, token, projects, setProjects, setSelectedProject } = useStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && user) {
      loadProjects();
    }
  }, [token, user]);

  const loadProjects = async () => {
    if (!token || !user) return;

    setLoading(true);
    try {
      const client = new GitHubClient(token);
      const projectList = await client.getProjects(user.login);
      setProjects(projectList);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-top safe-bottom p-6 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative z-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Deine Projekte
            </h2>
            <p className="text-secondary text-sm mt-0.5">
              {projects.length} {projects.length === 1 ? 'Projekt' : 'Projekte'} verfügbar
            </p>
          </div>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="space-y-4 relative z-10">
        {projects.map((project, index) => {
          const itemCount = project.items.nodes.length;
          const statusField = project.fields.nodes.find(f => f.options);
          const columnCount = statusField?.options?.length || 0;

          return (
            <motion.button
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(index * 0.08, 0.4), type: 'spring', stiffness: 300 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedProject(project)}
              className="w-full p-6 rounded-3xl glass text-left border border-white/5 hover:border-primary/30 transition-all shadow-lg hover:shadow-2xl relative overflow-hidden group"
            >
              {/* Gradient Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                {/* Project Icon & Title */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-xl flex-1">{project.title}</h3>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-secondary">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="font-medium">{itemCount}</span>
                        <span>Items</span>
                      </div>
                      {columnCount > 0 && (
                        <div className="flex items-center gap-1.5 text-secondary">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                          </svg>
                          <span className="font-medium">{columnCount}</span>
                          <span>Spalten</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    className="text-primary"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>

                {/* Progress Bar (if has columns) */}
                {columnCount > 0 && itemCount > 0 && (
                  <div className="mt-4">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((itemCount / 20) * 100, 100)}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Empty State */}
      {projects.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 relative z-10"
        >
          <div className="glass rounded-3xl p-8 text-center max-w-sm">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Keine Projekte gefunden</h3>
            <p className="text-sm text-secondary mb-6">
              Erstelle dein erstes Projekt auf GitHub, um loszulegen.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold"
            >
              <span>GitHub öffnen</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}
