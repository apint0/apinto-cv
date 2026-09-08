document.getElementById('yr').textContent = new Date().getFullYear();

// Live GitHub repos — reads the GitHub user & repo count from the #repo-grid data
// attributes (set from content/projects.yaml + content/site.yaml at build time),
// so this file never needs editing when that config changes.
(function loadRepos() {
  const grid = document.getElementById('repo-grid');
  const user = grid.dataset.githubUser;
  const maxRepos = parseInt(grid.dataset.maxRepos, 10) || 6;
  const browseUrl = `https://github.com/${user}?tab=repositories`;
  // Mirrors the "github" entry in content/icons.yaml.
  const gh = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.72 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0112 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.03 10.03 0 0022 12.25C22 6.58 17.52 2 12 2z"/></svg>';
  const esc = s => (s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const fallback = () => {
    grid.className = '';
    grid.innerHTML = '<div class="repo-more" style="margin-top:0;"><a href="' + browseUrl + '" target="_blank" rel="noopener">' + gh + ' Browse my repositories on GitHub</a></div>';
  };
  fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(repos => {
      const list = repos
        .filter(r => !r.fork && !r.archived)
        .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)))
        .slice(0, maxRepos);
      if (!list.length) return fallback();
      grid.innerHTML = list.map(r => `
        <a class="card repo-card" href="${r.html_url}" target="_blank" rel="noopener">
          <div class="repo-top">${gh}<span class="repo-name">${esc(r.name)}</span></div>
          <div class="repo-desc">${esc(r.description) || 'No description provided.'}</div>
          <div class="repo-meta">
            ${r.language ? `<span class="lang">${esc(r.language)}</span>` : ''}
            <span>★ ${r.stargazers_count}</span>
            ${r.forks_count ? `<span>⑂ ${r.forks_count}</span>` : ''}
          </div>
        </a>`).join('');
      grid.insertAdjacentHTML('afterend',
        '<div class="repo-more"><a href="' + browseUrl + '" target="_blank" rel="noopener">' + gh + ' View all on GitHub</a></div>');
    })
    .catch(fallback);
})();

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
