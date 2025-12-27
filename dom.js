export function renderRepositories(repos, container) {
  container.innerHTML = "";

  repos.forEach(repo => {
    const card = document.createElement("div");
    card.className = "repo-card";
    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || "No description available"}</p>
      <p>⭐ ${repo.stargazers_count}</p>
      <a href="${repo.html_url}" target="_blank">View on GitHub</a>
    `;
    container.appendChild(card);
  });
}
