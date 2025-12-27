import { GITHUB_TOKEN } from "./config.js";

const BASE_URL = "https://api.github.com";

// Endpoint 1: Search repositories
export async function searchRepositories(query) {
  const response = await fetch(
    `${BASE_URL}/search/repositories?q=${encodeURIComponent(query)}&per_page=6&sort=stars&order=desc`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json"
      }
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GitHub API Error: ${response.status}`);
  }

  return response.json();
}

// Endpoint 2: Get repository details
export async function getRepositoryDetails(owner, repo) {
  const response = await fetch(
    `${BASE_URL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json"
      }
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.status}`);
  }

  return response.json();
}

// Endpoint 3: Get user profile
export async function getUserProfile(username) {
  const response = await fetch(
    `${BASE_URL}/users/${encodeURIComponent(username)}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json"
      }
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.status}`);
  }

  return response.json();
}
