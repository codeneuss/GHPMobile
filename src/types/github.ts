export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
}

export interface ProjectColumn {
  id: string;
  name: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  body?: string;
  status: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  number: number;
  title: string;
  url: string;
  columns: ProjectColumn[];
  items: ProjectItem[];
}

export interface ProjectV2 {
  id: string;
  number: number;
  title: string;
  url: string;
  fields: {
    nodes: ProjectField[];
  };
  items: {
    nodes: ProjectV2Item[];
  };
}

export interface ProjectField {
  id: string;
  name: string;
  options?: {
    id: string;
    name: string;
  }[];
}

export interface ProjectV2Item {
  id: string;
  content?: {
    title: string;
    body?: string;
    createdAt: string;
    updatedAt: string;
  };
  fieldValues: {
    nodes: {
      field: {
        id: string;
        name: string;
      };
      name?: string;
    }[];
  };
}
