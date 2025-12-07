import { useState } from 'react';
import { useStore } from '../store/useStore';
import { GitHubClient } from '../lib/github';
import { motion } from 'framer-motion';

export function Login() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser, setToken: setStoreToken } = useStore();

  const handleLogin = async () => {
    if (!token.trim()) {
      setError('Bitte gib einen Token ein');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const client = new GitHubClient(token);
      const user = await client.getCurrentUser();
      setUser(user);
      setStoreToken(token);
    } catch (err) {
      setError('Login fehlgeschlagen. Überprüfe deinen Token.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 safe-top safe-bottom">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
          >
            <svg
              className="w-12 h-12"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">GitHub Projects</h1>
          <p className="text-secondary text-sm">Mobile Manager</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="token">
              Personal Access Token
            </label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="ghp_xxxxxxxxxxxxx"
              className="w-full px-4 py-3 rounded-xl glass-light text-sm"
            />
            <p className="text-xs text-secondary mt-2">
              Erstelle einen Token unter{' '}
              <a
                href="https://github.com/settings/tokens/new?scopes=repo,project,read:org,read:user"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                GitHub Settings
              </a>
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-danger text-sm text-center p-3 rounded-xl glass-light"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-primary disabled:opacity-50"
          >
            {loading ? 'Anmelden...' : 'Anmelden'}
          </motion.button>
        </div>

        <div className="mt-6 text-xs text-secondary text-center">
          <p>Benötigte Scopes:</p>
          <p className="font-mono mt-1">repo, project, read:org, read:user</p>
        </div>
      </motion.div>
    </div>
  );
}
