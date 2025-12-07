import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { ProjectSelector } from './components/ProjectSelector';
import { ColumnView } from './components/ColumnView';
import { GitHubClient } from './lib/github';

function App() {
  const { user, token, selectedProject, setUser } = useStore();

  useEffect(() => {
    if (token && !user) {
      const loadUser = async () => {
        try {
          const client = new GitHubClient(token);
          const userData = await client.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user:', error);
          useStore.getState().logout();
        }
      };
      loadUser();
    }
  }, [token, user, setUser]);

  if (!token || !user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {selectedProject ? <ColumnView /> : <ProjectSelector />}
    </div>
  );
}

export default App;
