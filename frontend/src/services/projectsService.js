import { getApiUrl } from "../config/api.js";
import * as R from "ramda";

/**
 * Projects Service
 * Handles all REST API calls for projects
 * Uses Ramda for functional data transformations
 */
const PROJECTS_ENDPOINT = getApiUrl("/api/projects");

/**
 * Get all projects
 */
export const fetchProjects = async () => {
  const response = await fetch(PROJECTS_ENDPOINT);
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return response.json();
};

/**
 * Get a single project by ID
 */
export const fetchProject = async (id) => {
  const response = await fetch(`${PROJECTS_ENDPOINT}/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch project");
  }
  return response.json();
};

/**
 * Create a new project
 */
export const createProject = async (projectData) => {
  const response = await fetch(PROJECTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return response.json();
};

/**
 * Update an existing project
 */
export const updateProject = async (id, projectData) => {
  const response = await fetch(`${PROJECTS_ENDPOINT}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    throw new Error("Failed to update project");
  }

  return response.json();
};

/**
 * Delete a project
 */
export const deleteProject = async (id) => {
  const response = await fetch(`${PROJECTS_ENDPOINT}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }

  return true;
};
