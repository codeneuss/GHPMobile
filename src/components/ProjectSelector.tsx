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
    <div className="min-h-screen safe-top safe-bottom p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2">Deine Projekte</h2>
        <p className="text-secondary text-sm">Wähle ein Projekt aus</p>
      </motion.div>

      <div className="space-y-3">
        {projects.map((project, index) => (
          <motion.button
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedProject(project)}
            className="w-full p-4 rounded-2xl glass-light text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{project.title}</h3>
                <p className="text-sm text-secondary">
                  {project.items.nodes.length} Items
                </p>
              </div>
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </motion.button>
        ))}
      </div>

      {projects.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-secondary">Keine Projekte gefunden</p>
          <p className="text-sm text-secondary mt-2">
            Erstelle ein Projekt auf GitHub
          </p>
        </motion.div>
      )}
    </div>
  );
}
