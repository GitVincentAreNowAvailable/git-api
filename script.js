import { searchRepositories } from "./api.js";
import { renderRepositories } from "./dom.js";

const input = document.getElementById("searchInput");
const button = document.getElementById("searchBtn");
const results = document.getElementById("results");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

// Map HTTP error codes to user-friendly messages
function getErrorMessage(errorMessage) {
  if (errorMessage.includes("401")) {
    return "Authentication failed. Please check your GitHub token.";
  } else if (errorMessage.includes("403")) {
    return "Access forbidden. You may have exceeded the API rate limit (60 requests/hour for public APIs).";
  } else if (errorMessage.includes("404")) {
    return "Repository not found. Please check your search term.";
  } else if (errorMessage.includes("429")) {
    return "Too many requests. Please wait a moment and try again.";
  } else if (errorMessage.includes("422")) {
    return "Invalid search query. Please try different keywords.";
  }
  return "Failed to fetch data from GitHub API. Please try again.";
}

button.addEventListener("click", async () => {
  const query = input.value.trim();

  // Input validation
  if (!query) {
    error.textContent = "Please enter a search term";
    results.innerHTML = "";
    return;
  }

  if (query.length < 2) {
    error.textContent = "Search term must be at least 2 characters";
    results.innerHTML = "";
    return;
  }

  // Clear previous messages
  error.textContent = "";
  results.innerHTML = "";
  loading.hidden = false;
  button.disabled = true;

  try {
    const data = await searchRepositories(query);

    if (!data.items || data.items.length === 0) {
      error.textContent = `No repositories found for "${query}". Try different keywords.`;
    } else {
      renderRepositories(data.items, results);
    }
  } catch (err) {
    error.textContent = getErrorMessage(err.message);
  } finally {
    loading.hidden = true;
    button.disabled = false;
  }
});

// Allow search on Enter key
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    button.click();
  }
});
