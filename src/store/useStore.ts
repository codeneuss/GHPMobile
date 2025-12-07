import { create } from 'zustand';
import { GitHubUser, ProjectV2, ProjectField } from '../types/github';

interface AppState {
  user: GitHubUser | null;
  token: string | null;
  projects: ProjectV2[];
  selectedProject: ProjectV2 | null;
  currentColumnIndex: number;
  statusField: ProjectField | null;

  setUser: (user: GitHubUser | null) => void;
  setToken: (token: string | null) => void;
  setProjects: (projects: ProjectV2[]) => void;
  setSelectedProject: (project: ProjectV2 | null) => void;
  setCurrentColumnIndex: (index: number) => void;
  setStatusField: (field: ProjectField | null) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  token: localStorage.getItem('github_token'),
  projects: [],
  selectedProject: null,
  currentColumnIndex: 0,
  statusField: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('github_token', token);
    } else {
      localStorage.removeItem('github_token');
    }
    set({ token });
  },
  setProjects: (projects) => set({ projects }),
  setSelectedProject: (project) => set({ selectedProject: project, currentColumnIndex: 0 }),
  setCurrentColumnIndex: (index) => set({ currentColumnIndex: index }),
  setStatusField: (field) => set({ statusField: field }),
  logout: () => {
    localStorage.removeItem('github_token');
    set({ user: null, token: null, projects: [], selectedProject: null });
  },
}));
