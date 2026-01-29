import { getApiUrl } from '../config/api.js';

/**
 * Notes Service
 * Handles all GraphQL API calls for notes
 */
const GRAPHQL_ENDPOINT = getApiUrl('/graphql');

/**
 * Execute a GraphQL query or mutation
 */
const graphqlRequest = async (query, variables = {}) => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  
  if (!response.ok) {
    throw new Error('GraphQL request failed');
  }
  
  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL error');
  }
  
  return result.data;
};

/**
 * Get all notes, optionally filtered by projectId
 */
export const fetchNotes = async (projectId = null) => {
  const query = `
    query($projectId: String) {
      notes(projectId: $projectId) {
        id
        data
      }
    }
  `;
  
  const data = await graphqlRequest(query, { projectId });
  return data.notes;
};

/**
 * Get a single note by ID
 */
export const fetchNote = async (id) => {
  const query = `
    query($id: ID!) {
      note(id: $id) {
        id
        data
      }
    }
  `;
  
  const data = await graphqlRequest(query, { id });
  return data.note;
};

/**
 * Create a new note
 */
export const createNote = async (noteData) => {
  const mutation = `
    mutation($data: JSON!) {
      addNote(data: $data) {
        id
        data
      }
    }
  `;
  
  const data = await graphqlRequest(mutation, { data: noteData });
  return data.addNote;
};

/**
 * Update an existing note
 */
export const updateNote = async (id, noteData) => {
  const mutation = `
    mutation($id: ID!, $data: JSON!) {
      updateNote(id: $id, data: $data) {
        id
        data
      }
    }
  `;
  
  const data = await graphqlRequest(mutation, { id, data: noteData });
  return data.updateNote;
};

/**
 * Delete a note
 */
export const deleteNote = async (id) => {
  const mutation = `
    mutation($id: ID!) {
      deleteNote(id: $id)
    }
  `;
  
  const data = await graphqlRequest(mutation, { id });
  return data.deleteNote;
};
