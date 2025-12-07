import { graphql } from '@octokit/graphql';
import { GitHubUser, ProjectV2 } from '../types/github';

export class GitHubClient {
  private graphqlWithAuth: typeof graphql;

  constructor(token: string) {
    this.graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: `token ${token}`,
      },
    });
  }

  async getCurrentUser(): Promise<GitHubUser> {
    const { viewer } = await this.graphqlWithAuth<{
      viewer: { login: string; name: string; avatarUrl: string };
    }>(`
      query {
        viewer {
          login
          name
          avatarUrl
        }
      }
    `);

    return {
      login: viewer.login,
      name: viewer.name,
      avatar_url: viewer.avatarUrl,
    };
  }

  async getProjects(owner: string): Promise<ProjectV2[]> {
    const { user } = await this.graphqlWithAuth<{
      user: {
        projectsV2: {
          nodes: Array<{
            id: string;
            number: number;
            title: string;
            url: string;
            fields: {
              nodes: Array<{
                __typename: string;
                id: string;
                name: string;
                options?: Array<{ id: string; name: string }>;
              }>;
            };
            items: {
              nodes: Array<{
                id: string;
                content?: {
                  __typename: string;
                  title?: string;
                  body?: string;
                  createdAt: string;
                  updatedAt: string;
                };
                fieldValues: {
                  nodes: Array<{
                    __typename: string;
                    field?: {
                      __typename: string;
                      id: string;
                      name: string;
                    };
                    name?: string;
                  }>;
                };
              }>;
            };
          }>;
        };
      };
    }>(`
      query($owner: String!) {
        user(login: $owner) {
          projectsV2(first: 20) {
            nodes {
              id
              number
              title
              url
              fields(first: 20) {
                nodes {
                  ... on ProjectV2SingleSelectField {
                    __typename
                    id
                    name
                    options {
                      id
                      name
                    }
                  }
                  ... on ProjectV2Field {
                    __typename
                    id
                    name
                  }
                }
              }
              items(first: 100) {
                nodes {
                  id
                  content {
                    ... on Issue {
                      __typename
                      title
                      body
                      createdAt
                      updatedAt
                    }
                    ... on PullRequest {
                      __typename
                      title
                      body
                      createdAt
                      updatedAt
                    }
                    ... on DraftIssue {
                      __typename
                      title
                      body
                      createdAt
                      updatedAt
                    }
                  }
                  fieldValues(first: 20) {
                    nodes {
                      ... on ProjectV2ItemFieldSingleSelectValue {
                        __typename
                        field {
                          ... on ProjectV2SingleSelectField {
                            __typename
                            id
                            name
                          }
                        }
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `, { owner });

    return user.projectsV2.nodes;
  }

  async createDraftIssue(projectId: string, title: string, body?: string): Promise<string> {
    const { addProjectV2DraftIssue } = await this.graphqlWithAuth<{
      addProjectV2DraftIssue: {
        projectItem: {
          id: string;
        };
      };
    }>(`
      mutation($projectId: ID!, $title: String!, $body: String) {
        addProjectV2DraftIssue(input: {
          projectId: $projectId
          title: $title
          body: $body
        }) {
          projectItem {
            id
          }
        }
      }
    `, { projectId, title, body });

    return addProjectV2DraftIssue.projectItem.id;
  }

  async updateItemStatus(
    projectId: string,
    itemId: string,
    fieldId: string,
    optionId: string
  ): Promise<void> {
    await this.graphqlWithAuth(`
      mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: ProjectV2FieldValue!) {
        updateProjectV2ItemFieldValue(input: {
          projectId: $projectId
          itemId: $itemId
          fieldId: $fieldId
          value: $value
        }) {
          projectV2Item {
            id
          }
        }
      }
    `, {
      projectId,
      itemId,
      fieldId,
      value: {
        singleSelectOptionId: optionId,
      },
    });
  }
}
