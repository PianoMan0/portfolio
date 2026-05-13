(async function () {
  const endpoint = '/slack-status.php';
  const username = 'pianoman0';

  const onlineDot = document.getElementById('online-dot');
  const indicator = document.getElementById('slack-status-indicator');
  const dot = onlineDot || (indicator && indicator.querySelector('.dot'));
  const text = indicator && indicator.querySelector('.text');

  function setLoading() {
    if (indicator) indicator.className = 'loading';
    if (dot) dot.style.background = '#9e9e9e';
    if (text) text.textContent = 'Checking Slack...';
    if (onlineDot) { onlineDot.classList.remove('online','offline'); }
  }

  function setOnline() {
    if (indicator) indicator.className = 'online';
    if (dot) dot.style.background = '#00e676';
    if (text) text.textContent = '@' + username + ' is online';
    if (onlineDot) { onlineDot.classList.remove('offline'); onlineDot.classList.add('online'); }
  }

  function setOffline() {
    if (indicator) indicator.className = 'offline';
    if (dot) dot.style.background = '#9e9e9e';
    if (text) text.textContent = '@' + username + ' is offline';
    if (onlineDot) { onlineDot.classList.remove('online'); onlineDot.classList.add('offline'); }
  }

  function setError() {
    if (indicator) indicator.className = 'offline';
    if (dot) dot.style.background = '#ff7043';
    if (text) text.textContent = 'Status unavailable';
    if (onlineDot) { onlineDot.classList.remove('online'); onlineDot.classList.add('offline'); }
  }

  if (!dot && !indicator && !onlineDot) return;

  async function fetchStatus() {
    try {
      setLoading();
      const res = await fetch(endpoint + '?user=' + encodeURIComponent(username), { cache: 'no-store' });
      if (!res.ok) throw new Error('Network');
      const j = await res.json();
      if (j && j.ok && j.presence) {
        if (j.presence === 'active' || j.presence === 'online') setOnline();
        else setOffline();
      } else {
        setError();
      }
    } catch (e) {
      setError();
    }
  }

  // Fetch status every 30s
  fetchStatus();
  setInterval(fetchStatus, 30000);
})();
