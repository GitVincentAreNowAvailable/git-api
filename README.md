# GitHub Repository Search - API Group Project

A web application that allows users to search and explore GitHub repositories in real-time using the GitHub REST API. This project demonstrates practical API integration with proper error handling, authentication, and a responsive user interface.

**API Used:** GitHub REST API v3  
**Authentication Method:** Personal Access Token (Bearer Token)  
**Tech Stack:** HTML5, CSS3, JavaScript (ES6 Modules)

---

## 🎯 Project Overview

This project showcases:
- Real-time GitHub repository search functionality
- Bearer token authentication with GitHub REST API
- Error handling and user feedback mechanisms
- Responsive and clean UI design
- Input validation and rate limit management
- Modular JavaScript architecture with ES6 modules

---

## ⚡ Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- GitHub account
- Personal Access Token from GitHub

### 5-Minute Setup

1. **Generate GitHub Token** (2 minutes)
   - Go to [GitHub Settings → Tokens (classic)](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Select scope: `public_repo`
   - Copy the generated token

2. **Update config.js** (1 minute)
   ```javascript
   // In config.js, replace:
   export const GITHUB_TOKEN = "YOUR_GITHUB_TOKEN_HERE";
   ```

3. **Run the Project** (2 minutes)
   - **Option A (VS Code):** Install Live Server extension → Right-click `index.html` → "Open with Live Server"
   - **Option B (Python):** Open terminal in project folder → `python -m http.server 8000` → Open `http://localhost:8000`
   - **Option C (Node.js):** Open terminal in project folder → `npx http-server` → Open the provided localhost URL
   - **Option D (Any OS):** Simply open `index.html` in your browser (not recommended for API calls due to CORS)

4. **Start Searching!**
   - Enter a search term (e.g., "React", "Node.js", "Vue", "JavaScript")
   - Click Search or press Enter
   - Browse the top 6 results sorted by stars

---

## 📋 API Documentation

### Base URL
```
https://api.github.com
```

### Authentication
- **Type:** Token-based (Bearer Token)
- **Header:** `Authorization: Bearer {GITHUB_TOKEN}`
- **Token Generation:** [GitHub Settings - Tokens (classic)](https://github.com/settings/tokens)
- **Required Scopes:** `public_repo` (for public repository access)

### Endpoints

#### 1. Search Repositories
**Endpoint:** `GET /search/repositories`

**Description:** Search for repositories on GitHub by query string.

**Required Parameters:**
- `q` (query string) - The search keywords
- `per_page` (optional) - Results per page (default: 30, max: 100)
- `sort` (optional) - Sort by `stars`, `forks`, or `updated` (default: best match)
- `order` (optional) - Sort order: `asc` or `desc` (default: desc)

**Example Request:**
```bash
curl -H "Authorization: Bearer ghp_YOUR_TOKEN" \
  "https://api.github.com/search/repositories?q=javascript&per_page=6&sort=stars&order=desc"
```

**Current Implementation (in api.js):**
```javascript
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
    throw new Error(`GitHub API Error: ${response.status}`);
  }

  return response.json();
}
```

**Sample Response:**
```json
{
  "total_count": 5000000,
  "incomplete_results": false,
  "items": [
    {
      "id": 1234567,
      "name": "awesome-javascript",
      "full_name": "username/awesome-javascript",
      "owner": {
        "login": "username",
        "id": 1,
        "avatar_url": "https://avatars.githubusercontent.com/u/1?v=4",
        "html_url": "https://github.com/username"
      },
      "html_url": "https://github.com/username/awesome-javascript",
      "description": "A curated list of awesome JavaScript resources",
      "stargazers_count": 29000,
      "language": "JavaScript",
      "forks_count": 5000
    }
  ]
}
```

**Fields Used in UI:**
- `name` - Repository name (displayed in card title)
- `description` - Repository description (displayed in card)
- `stargazers_count` - Star count (displayed as ⭐ icon)
- `html_url` - GitHub link (clickable link)

---

#### 2. Get Repository Details (Bonus)
**Endpoint:** `GET /repos/{owner}/{repo}`

**Description:** Fetch detailed information about a specific repository.

**Required Parameters:**
- `owner` (path parameter) - Repository owner/organization username
- `repo` (path parameter) - Repository name

**Example Request:**
```bash
curl -H "Authorization: Bearer ghp_YOUR_TOKEN" \
  "https://api.github.com/repos/torvalds/linux"
```

**Current Implementation (in api.js):**
```javascript
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
```

**Future Use:** Can be extended to show detailed stats and metrics for a selected repository.

---

#### 3. Get User Profile (Bonus)
**Endpoint:** `GET /users/{username}`

**Description:** Fetch public profile information about a GitHub user.

**Required Parameters:**
- `username` (path parameter) - GitHub username

**Example Request:**
```bash
curl -H "Authorization: Bearer ghp_YOUR_TOKEN" \
  "https://api.github.com/users/torvalds"
```

**Current Implementation (in api.js):**
```javascript
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
```

**Sample Response:**
```json
{
  "login": "torvalds",
  "id": 1024,
  "avatar_url": "https://avatars.githubusercontent.com/u/1024?v=4",
  "name": "Linus Torvalds",
  "company": "Linux Foundation",
  "blog": "https://www.kernel.org/",
  "location": "Portland, Oregon",
  "bio": "Linux creator",
  "public_repos": 50,
  "followers": 250000,
  "created_at": "2007-02-05T22:49:40Z"
}
```

**Future Use:** Can be extended to show developer profiles when clicking on repository owners.

---

## 🔐 Error Handling

The application handles the following HTTP error codes with user-friendly messages:

| Code | Status | User Message |
|------|--------|--------------|
| **200** | OK | Request successful, data displayed |
| **401** | Unauthorized | "Authentication failed. Please check your GitHub token." |
| **403** | Forbidden | "Access forbidden. You may have exceeded the API rate limit (60 requests/hour for public APIs)." |
| **404** | Not Found | "Repository not found. Please check your search term." |
| **422** | Unprocessable Entity | "Invalid search query. Please try different keywords." |
| **429** | Too Many Requests | "Too many requests. Please wait a moment and try again." |

**Error Handling Code (in script.js):**
```javascript
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
```

---

## 🧪 Testing with Postman

### Setup Postman for GitHub API

1. **Create New Request**
   - Method: GET
   - URL: `https://api.github.com/search/repositories?q=react&per_page=6`

2. **Add Authentication**
   - Tab: **Authorization**
   - Type: **Bearer Token**
   - Token: `ghp_YOUR_GITHUB_TOKEN`

3. **Test Search Endpoint**
   - Expected Status: `200 OK`
   - Response includes array of repositories with name, stars, description, etc.

### Test Error Scenarios

#### 401 Unauthorized (Invalid Token)
- Use expired or fake token
- Expected Response: `401 Unauthorized`
- Message: `"message": "Bad credentials"`

#### 403 Forbidden (Rate Limit Exceeded)
- Send >60 requests from same IP without authentication
- Expected Response: `403 Forbidden`
- Message: `"message": "API rate limit exceeded"`

#### 404 Not Found
- Request: `GET https://api.github.com/repos/nonexistent-user/nonexistent-repo`
- Expected Response: `404 Not Found`

#### 422 Invalid Query
- URL: `https://api.github.com/search/repositories?q=::::&per_page=6`
- Expected Response: `422 Unprocessable Entity`
- Message: `"message": "Validation Failed"`

---

## 🎨 UI/UX Features

### Input Validation
- ✅ Empty input check: "Please enter a search term"
- ✅ Minimum 2 character requirement: "Search term must be at least 2 characters"
- ✅ Whitespace trimming: Removes leading/trailing spaces
- ✅ Button disabled during API calls: Prevents duplicate requests
- ✅ Enter key support: Press Enter to search

### Loading State
- Animated spinner element
- "Loading repositories..." message
- Button disabled to prevent multiple submissions

### Error Display
- Red background with clear messaging
- Specific error codes mapped to user-friendly descriptions
- Contextual help text based on error type

### Results Display
- Responsive grid layout (3 columns desktop, 1 column mobile)
- Repository cards featuring:
  - Repository name (linked to GitHub)
  - Description text
  - Star count with icon
  - Direct "View on GitHub" button
- Hover effects for enhanced interactivity

### Responsive Design

| Screen Size | Breakpoint | Layout |
|-------------|-----------|--------|
| Desktop | > 768px | 3-column grid |
| Tablet | 480px - 768px | 2-column grid |
| Mobile | < 480px | Full-width single column |

---

## 📁 Project Structure

```
api-group-project/
├── index.html                     # Main HTML with semantic markup
├── style.css                      # Responsive CSS with mobile-first design
├── script.js                      # Main application logic (search handler)
├── api.js                         # GitHub API functions
├── config.js                      # Configuration (token placeholder)
├── dom.js                         # DOM manipulation and rendering
├── utils.js                       # Utility helper functions
├── .gitignore                     # Git ignore (includes config.js)
├── README.md                      # This file
└── REQUIREMENTS_CHECKLIST.md      # Detailed project requirements
```

### File Purposes

| File | Purpose |
|------|---------|
| **index.html** | Structure with search input, results container, loading/error states |
| **style.css** | Responsive styling, card layouts, animations, mobile breakpoints |
| **script.js** | Event listeners, input validation, error handling orchestration |
| **api.js** | Three GitHub API endpoint functions with error handling |
| **config.js** | Token configuration (kept separate for security) |
| **dom.js** | Repository card rendering function |
| **utils.js** | Reusable utility functions (expandable for future features) |

---

## 🔄 Data Flow Architecture

```
┌─────────────────────┐
│   User Input        │ (Search term)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────┐
│  Input Validation       │ (script.js)
│  - Not empty            │
│  - Min 2 characters     │
│  - Trim whitespace      │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  API Request            │ (api.js)
│  - Build URL            │
│  - Add Auth header      │
│  - Encode query param   │
└──────────┬──────────────┘
           │
           ▼
┌──────────────────────────┐
│  GitHub REST API         │
│  /search/repositories    │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Response Handling       │ (api.js)
│  - Check status code     │
│  - Parse JSON            │
│  - Throw on error        │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  DOM Rendering           │ (dom.js)
│  - Create card elements  │
│  - Populate with data    │
│  - Add to container      │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Display Results         │ (User sees repos)
└──────────────────────────┘
```

---

## 👥 Team Collaboration Roles

| Role | Responsibility | Files |
|------|-----------------|-------|
| **API & Authentication Handler** | Setup GitHub API, manage tokens, test endpoints, handle errors | `api.js`, `config.js` |
| **JavaScript Logic Developer** | Implement search logic, validation, error handling, async operations | `script.js`, `api.js` |
| **UI/UX & Frontend Designer** | Responsive layouts, styling, animations, accessibility | `style.css`, `index.html`, `dom.js` |
| **GitHub & Docs Manager** | Repository setup, PRs, documentation, issue tracking | `README.md`, branch management |

---

## 🤝 GitHub Workflow for Team Collaboration

### Repository Setup
1. One member creates GitHub repository
2. Add all team members as collaborators
3. Clone repository to local machine: `git clone <repo-url>`
4. Install dependencies (if any): `npm install`

### Development Workflow

#### 1. Create Feature Branch
```bash
git checkout -b feature/api-integration
```

Branch naming convention:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code improvements

#### 2. Make Changes & Commit
```bash
git add .
git commit -m "feat: add search API integration"
```

Commit message format:
```
feat: add new feature
fix: resolve bug
docs: update documentation
refactor: improve code structure
style: fix formatting
test: add test cases
```

#### 3. Push to Remote
```bash
git push origin feature/api-integration
```

#### 4. Create Pull Request
- Go to GitHub repository
- Click "New Pull Request"
- Compare your branch with `main`
- Add title, description, and reference any issues
- Request reviews from team members

#### 5. Code Review & Merge
- Team members review code
- Request changes or approve
- Once approved, merge to `main`
- Delete feature branch

#### 6. Pull Latest Changes
```bash
git checkout main
git pull origin main
```

### Handling Merge Conflicts
```bash
# Pull latest changes
git pull origin main

# Resolve conflicts in files
# (Edit conflicting files manually)

git add .
git commit -m "resolve merge conflicts"
git push origin feature/branch-name
```

---

## 🔄 Troubleshooting

### Token Issues
**Problem:** "Authentication failed" error  
**Solutions:**
- Verify token is valid at [GitHub Settings](https://github.com/settings/tokens)
- Check token hasn't expired
- Ensure token has `public_repo` scope
- Paste token correctly in `config.js`

### CORS Error
**Problem:** "No 'Access-Control-Allow-Origin' header"  
**Solutions:**
- Use a local server (Live Server, http-server, Python)
- Don't open `index.html` directly in browser
- For production, consider using GitHub Pages or a backend proxy

### Rate Limit
**Problem:** "You have exceeded the API rate limit"  
**Solutions:**
- Authenticated requests: 60 requests/hour per IP
- Wait an hour or use a new IP
- For higher limits, authenticate properly
- Implement request caching

### No Results
**Problem:** "No repositories found for..."  
**Solutions:**
- Try different search keywords
- Use simpler terms
- Check GitHub search syntax: [Advanced search](https://github.com/search/advanced)

### Blank Results
**Problem:** Results display but cards are empty  
**Solutions:**
- Check browser console for errors (F12)
- Verify API response in Network tab
- Check `dom.js` rendering function
- Ensure data fields match API response

---

## 📚 Resources & Documentation

- **GitHub REST API:** [Official Documentation](https://docs.github.com/en/rest)
- **Personal Access Tokens:** [Authentication Guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- **Search Repositories:** [Search API Documentation](https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-repositories)
- **Fetch API:** [MDN Fetch Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- **ES6 Modules:** [JavaScript Modules Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

---

## 🚀 Future Enhancement Ideas

### Phase 1 (Easy)
- [ ] Add repository language filter (JavaScript, Python, Go, etc.)
- [ ] Add sorting options (by stars, forks, updated date)
- [ ] Add pagination for more results
- [ ] Display additional info (forks count, issues count)
- [ ] Add repository topics/tags display

### Phase 2 (Medium)
- [ ] Implement local caching to reduce API calls
- [ ] Add "View User Profile" feature
- [ ] Show contributor list for repositories
- [ ] Add trending repositories (no search needed)
- [ ] Dark mode toggle

### Phase 3 (Advanced)
- [ ] Repository comparison tool
- [ ] Advanced filter system
- [ ] Save favorite repositories (localStorage)
- [ ] Build a backend to manage API requests
- [ ] Deploy to production (Vercel, GitHub Pages, Netlify)

---

## Team Members

- Vincent Cayabyab – Project Lead / API Integration
- Maria Lorena Sheen Velasco – Frontend & UI Design 
- Fiona Ley Maramba – Documentation & Testing 

## 📄 License & Attribution

This project is created for educational purposes as part of an API Group Project assignment.

**Created:** December 2025  
**Last Updated:** December 25, 2025  
**Version:** 1.0.0

---

## ✅ Checklist for Running the Project

- [ ] Generated GitHub Personal Access Token
- [ ] Updated `config.js` with actual token
- [ ] Started local server (Live Server / http-server / Python)
- [ ] Opened project in browser
- [ ] Tested with sample search (e.g., "React")
- [ ] Verified results display correctly
- [ ] Tested error handling (invalid token, no results)
- [ ] Checked responsive design on different screen sizes
- [ ] Reviewed all team contributions
- [ ] Committed final changes to GitHub
