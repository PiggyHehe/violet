// Violet iOS — Minimalist Native iPhone UI & Behaviour
// Uses clean Lucide SVG iconography (24x24, 1.75px stroke, round caps/joins)

(() => {
  if (!localStorage.getItem('muriel_font_scale')) localStorage.setItem('muriel_font_scale', '80');
  const Engine = window.MurielAudioEngine;
  if (!Engine) return;
  Engine.prototype.init = function (audioElement) { this.__element = audioElement || this.__element; };
  Engine.prototype._applyMasterVolume = function () {
    if (this.__element) this.__element.muted = !!this.isMuted || this.volume === 0;
  };
})();

(() => {
  const panel = document.getElementById('right-panel');
  const playbar = document.getElementById('playbar');
  const lyricsBtn = document.getElementById('btn-toggle-lyrics-panel');
  const audio = document.querySelector('audio');
  if (!panel || !playbar || !lyricsBtn) return;

  // Clean Lucide SVG helper (https://lucide.dev)
  const lucide = (paths, size = 20, stroke = 1.75) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

  const ICONS = {
    home: lucide('<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
    heart: lucide('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>'),
    playlists: lucide('<path d="M21 15V6"/><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/>'),
    library: lucide('<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>'),
    clock: lucide('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', 18),
    settings: lucide('<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'),
    chevronDown: lucide('<path d="m6 9 6 6 6-6"/>', 22, 2),
    stats: lucide('<line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>', 18),
    radio: lucide('<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>', 18),
  };

  // ---------- 1. Move Platform Switcher into Top Titlebar & Standardize Icons ----------
  const titlebar = document.getElementById('titlebar');
  const platformSwitch = document.querySelector('.platform-switch-container');
  if (titlebar && platformSwitch) {
    titlebar.appendChild(platformSwitch);
    const ytSpan = document.querySelector('#platform-yt span');
    const ytmSpan = document.querySelector('#platform-ytm span');
    const scSpan = document.querySelector('#platform-sc span');
    if (ytSpan) ytSpan.textContent = 'YT';
    if (ytmSpan) ytmSpan.textContent = 'Music';
    if (scSpan) scSpan.textContent = 'SC';
  }

  // ---------- 2. 5-Tab Native iOS Bottom Tab Bar with Lucide Icons ----------
  const tabConfig = [
    ['nav-discover', 'Home', ICONS.home],
    ['nav-favorites', 'Liked', ICONS.heart],
    ['btn-toggle-playlists-drawer', 'Playlists', ICONS.playlists],
    ['nav-local', 'Files', ICONS.library],
    ['nav-settings', 'Settings', ICONS.settings],
  ];

  tabConfig.forEach(([id, label, svg]) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    const ind = btn.querySelector('.nav-indicator');
    if (ind) {
      const badge = ind.querySelector('.nav-badge');
      ind.innerHTML = svg;
      if (badge) ind.appendChild(badge);
    } else {
      btn.innerHTML = `<div class="nav-indicator">${svg}</div>`;
    }
    if (!btn.querySelector('.violet-nav-label')) {
      const span = document.createElement('span');
      span.className = 'violet-nav-label';
      span.textContent = label;
      btn.appendChild(span);
    }
  });

  // ---------- 3. Minimalist Home Header, Filter Pills & 2x2 Quick Grid ----------
  const discoverEmpty = document.getElementById('discover-empty');
  if (discoverEmpty && !document.getElementById('violet-home-top')) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    const waveLabel = document.querySelector('.my-wave-title');
    if (waveLabel) waveLabel.textContent = 'Daily Mix';
    const playWaveSpan = document.querySelector('#btn-play-my-wave span');
    if (playWaveSpan) playWaveSpan.textContent = 'Play';

    const topBlock = document.createElement('div');
    topBlock.id = 'violet-home-top';
    topBlock.className = 'violet-home-top';
    topBlock.innerHTML = `
      <div class="violet-greeting-row">
        <h1 class="violet-greeting-text">${greeting}</h1>
        <div class="violet-greeting-actions">
          <button type="button" class="violet-header-icon-btn" id="violet-btn-wrapped" title="Listening stats" aria-label="Listening stats">
            ${ICONS.stats}
          </button>
          <button type="button" class="violet-header-icon-btn" id="violet-btn-history" title="Recently played" aria-label="Recently played">
            ${ICONS.clock}
          </button>
        </div>
      </div>
      <div class="violet-filter-pills">
        <button type="button" class="violet-pill active" data-vpill="all">All</button>
        <button type="button" class="violet-pill" data-vpill="favorites">Liked</button>
        <button type="button" class="violet-pill" data-vpill="playlists">Playlists</button>
        <button type="button" class="violet-pill" data-vpill="local">Files</button>
      </div>
      <div class="violet-quick-grid" id="violet-quick-grid">
        <button type="button" class="violet-quick-card" data-qaction="favorites">
          <div class="violet-quick-art">${ICONS.heart}</div>
          <span class="violet-quick-title">Liked Songs</span>
        </button>
        <button type="button" class="violet-quick-card" data-qaction="wave">
          <div class="violet-quick-art">${ICONS.radio}</div>
          <span class="violet-quick-title">Daily Mix</span>
        </button>
        <button type="button" class="violet-quick-card" data-qaction="playlists">
          <div class="violet-quick-art">${ICONS.playlists}</div>
          <span class="violet-quick-title">Playlists</span>
        </button>
        <button type="button" class="violet-quick-card" data-qaction="history">
          <div class="violet-quick-art">${ICONS.clock}</div>
          <span class="violet-quick-title">Recently Played</span>
        </button>
      </div>
    `;
    discoverEmpty.prepend(topBlock);

    topBlock.querySelector('#violet-btn-wrapped')?.addEventListener('click', () => {
      if (window.MurielEncore) window.MurielEncore.open();
      else document.getElementById('btn-open-encore')?.click();
    });
    topBlock.querySelector('#violet-btn-history')?.addEventListener('click', () => {
      document.getElementById('nav-history')?.click();
    });
    topBlock.querySelectorAll('[data-vpill]').forEach((b) => {
      b.addEventListener('click', () => {
        const t = b.dataset.vpill;
        if (t === 'favorites') document.getElementById('nav-favorites')?.click();
        else if (t === 'playlists') document.getElementById('btn-toggle-playlists-drawer')?.click();
        else if (t === 'local') document.getElementById('nav-local')?.click();
      });
    });
    topBlock.querySelectorAll('[data-qaction]').forEach((b) => {
      b.addEventListener('click', () => {
        const a = b.dataset.qaction;
        if (a === 'favorites') document.getElementById('nav-favorites')?.click();
        else if (a === 'wave') document.getElementById('btn-play-my-wave')?.click();
        else if (a === 'playlists') document.getElementById('btn-toggle-playlists-drawer')?.click();
        else if (a === 'history') document.getElementById('nav-history')?.click();
      });
    });
  }

  // ---------- 4. Now Playing Sheet & Close Chevron ----------
  const closeBtn = document.getElementById('btn-close-right-panel');
  if (closeBtn) {
    closeBtn.innerHTML = ICONS.chevronDown;
  }

  const sync = () => document.body.classList.toggle('np-open', !panel.classList.contains('hidden'));
  new MutationObserver(sync).observe(panel, { attributes: true, attributeFilter: ['class'] });
  sync();

  const openSheet = () => { if (panel.classList.contains('hidden')) lyricsBtn.click(); };
  const closeSheet = () => { if (!panel.classList.contains('hidden')) closeBtn?.click(); };

  playbar.addEventListener('click', (e) => {
    if (document.body.classList.contains('np-open')) return;
    if (e.target.closest('button, input, .scrubber-track-container')) return;
    openSheet();
  });

  // Swipe down on the sheet to close
  let startY = null;
  panel.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    const lyrics = document.getElementById('lyrics-container');
    startY = (lyrics && lyrics.contains(e.target) && lyrics.scrollTop > 0) ? null : t.clientY;
  }, { passive: true });
  panel.addEventListener('touchmove', (e) => {
    if (startY === null) return;
    const dy = e.touches[0].clientY - startY;
    if (dy > 0) panel.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  panel.addEventListener('touchend', (e) => {
    if (startY === null) return;
    const dy = e.changedTouches[0].clientY - startY;
    panel.style.transform = '';
    startY = null;
    if (dy > 110) closeSheet();
  });

  // Repair picked media file URLs across iOS container updates
  const fixPickedMedia = async () => {
    const api = window.electronAPI;
    if (!api.fileUrl) return;
    const nameOf = (u) => { const m = typeof u === 'string' && !u.startsWith('blob:') && u.match(/\/backgrounds\/(bg_[\w.-]+)$/); return m ? m[1] : null; };
    const keep = new Set();
    const fresh = async (u) => {
      const name = nameOf(u);
      if (!name) return u;
      const url = await api.fileUrl(`/data/backgrounds/${name}`);
      if (url) keep.add(name);
      return url || u;
    };
    let bgChanged = false;
    for (const key of ['muriel_bg_url', 'muriel_banner_media']) {
      const cur = localStorage.getItem(key);
      if (!cur) continue;
      const next = await fresh(cur);
      if (next !== cur) { localStorage.setItem(key, next); if (key === 'muriel_bg_url') bgChanged = true; }
    }
    let artOk = true;
    try {
      const art = JSON.parse(localStorage.getItem('muriel_track_art') || '{}');
      let dirty = false;
      for (const v of Object.values(art)) {
        for (const f of ['cover', 'banner']) {
          if (!v || !v[f]) continue;
          const next = await fresh(v[f]);
          if (next !== v[f]) { v[f] = next; dirty = true; }
        }
      }
      if (dirty) localStorage.setItem('muriel_track_art', JSON.stringify(art));
    } catch (e) { artOk = false; }
    localStorage.removeItem('muriel_bg_vpath');
    if (bgChanged) window.MurielCore.refreshBackground();
    if (artOk && api.pruneMedia) api.pruneMedia(keep);
  };
  if (window.MurielCore) fixPickedMedia(); else window.addEventListener('muriel:ready', fixPickedMedia, { once: true });

  const preferWordLyrics = () => {
    const st = window.MurielCore && window.MurielCore.state;
    const btn = document.getElementById('btn-lyrics-mode');
    if (st && btn && st.lyricsMode === 'line' && localStorage.getItem('muriel_adv_karaoke_words') !== 'false') btn.click();
  };
  if (window.MurielCore) preferWordLyrics(); else window.addEventListener('muriel:ready', preferWordLyrics, { once: true });

  const tools = panel.querySelector('.lyrics-header-actions');
  const topRow = panel.querySelector('.right-panel-header-actions');
  if (tools && topRow) { topRow.prepend(tools); tools.classList.add('np-tools-moved'); }

  // ---------- 5. Like Button in Now Playing & on Mini-Player ----------
  const realFav = document.getElementById('btn-toggle-fav');
  const favIcon = document.getElementById('fav-icon');
  const titleRow = panel.querySelector('.right-panel-title-row');
  if (realFav && favIcon && titleRow) {
    const like = document.createElement('button');
    like.id = 'np-like';
    like.type = 'button';
    like.setAttribute('aria-label', 'Like');
    like.innerHTML = ICONS.heart;

    const miniLike = document.createElement('button');
    miniLike.id = 'mini-like';
    miniLike.className = 'mini-like-btn';
    miniLike.type = 'button';
    miniLike.setAttribute('aria-label', 'Like song');
    miniLike.innerHTML = ICONS.heart;
    const playbarCenter = playbar.querySelector('.playbar-center');
    if (playbarCenter) playbar.insertBefore(miniLike, playbarCenter);

    const mirror = () => {
      const on = favIcon.getAttribute('fill') === 'currentColor';
      like.classList.toggle('on', on);
      like.querySelector('svg')?.setAttribute('fill', on ? 'currentColor' : 'none');
      miniLike.classList.toggle('on', on);
      miniLike.querySelector('svg')?.setAttribute('fill', on ? 'currentColor' : 'none');
    };
    const triggerLike = (btn) => {
      realFav.click();
      btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
      if (navigator.vibrate) navigator.vibrate(10);
    };
    like.addEventListener('click', () => triggerLike(like));
    miniLike.addEventListener('click', (e) => { e.stopPropagation(); triggerLike(miniLike); });
    new MutationObserver(mirror).observe(favIcon, { attributes: true, attributeFilter: ['fill'] });
    titleRow.appendChild(like);
    mirror();
  }

  // Subtle ambient wash behind Now Playing
  const ambient = document.createElement('div');
  ambient.className = 'np-ambient';
  ambient.innerHTML = '<i></i>';
  panel.prepend(ambient);

  // Swipe the cover left/right to skip
  const cover = document.getElementById('cover-container');
  if (cover) {
    let x0 = null, y0 = null, dx = 0, horizontal = null;
    cover.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; dx = 0; horizontal = null; cover.style.transition = 'none'; }, { passive: true });
    cover.addEventListener('touchmove', (e) => {
      if (x0 === null) return;
      dx = e.touches[0].clientX - x0;
      const dy = e.touches[0].clientY - y0;
      if (horizontal === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) horizontal = Math.abs(dx) > Math.abs(dy);
      if (horizontal) cover.style.transform = `translateX(${dx}px)`;
    }, { passive: true });
    cover.addEventListener('touchend', () => {
      if (x0 === null) return;
      x0 = null;
      cover.style.transition = 'transform .28s cubic-bezier(.2,.8,.2,1), opacity .28s';
      if (horizontal && Math.abs(dx) > 70) {
        const dir = dx < 0 ? -1 : 1;
        cover.style.transform = `translateX(${dir * window.innerWidth}px)`;
        cover.style.opacity = '0';
        if (navigator.vibrate) navigator.vibrate(10);
        setTimeout(() => {
          if (dir < 0) document.getElementById('btn-next').click(); else document.getElementById('btn-prev').click();
          cover.style.transition = 'none';
          cover.style.transform = `translateX(${-dir * 40}px)`;
          requestAnimationFrame(() => { cover.style.transition = 'transform .32s cubic-bezier(.2,.8,.2,1), opacity .32s'; cover.style.transform = ''; cover.style.opacity = ''; });
        }, 200);
      } else {
        cover.style.transform = '';
      }
    });
  }

  // Mini player progress line
  if (audio) {
    const tick = () => {
      if (document.hidden) return;
      const p = audio.duration ? audio.currentTime / audio.duration : 0;
      playbar.style.setProperty('--mini-progress', String(Math.max(0, Math.min(1, p))));
    };
    audio.addEventListener('timeupdate', tick);
    audio.addEventListener('emptied', tick);
    document.addEventListener('visibilitychange', tick);
  }

  // Storage settings
  const storageGroup = document.querySelector('.settings-section[data-cat="storage"] .m3-group');
  if (storageGroup) {
    const limits = [['1024', '1 GB'], ['2048', '2 GB'], ['5120', '5 GB'], ['10240', '10 GB']];
    const current = localStorage.getItem('muriel_cache_limit_mb') || '2048';
    const limitRow = document.createElement('div');
    limitRow.className = 'setting-item';
    limitRow.innerHTML = `
      <div class="setting-item-top" style="align-items: center;">
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <span class="setting-name">Song storage limit</span>
          <span style="font-size: calc(12px * var(--font-scale, 1)); color: var(--md-sys-color-outline);">Songs you play are kept for offline use. Over this limit, the ones played longest ago are removed.</span>
        </div>
      </div>
      <div class="theme-mode-toggle" style="margin-top: 10px;">
        ${limits.map(([v, l]) => `<button class="fps-cap-btn${v === current ? ' active' : ''}" data-limit="${v}">${l}</button>`).join('')}
      </div>`;
    limitRow.querySelectorAll('[data-limit]').forEach((b) => b.addEventListener('click', () => {
      localStorage.setItem('muriel_cache_limit_mb', b.dataset.limit);
      limitRow.querySelectorAll('[data-limit]').forEach((x) => x.classList.toggle('active', x === b));
      if (window.MurielCache) window.MurielCache.enforceLimit();
    }));
    const logRow = document.createElement('div');
    logRow.className = 'setting-item';
    logRow.innerHTML = `
      <div class="setting-item-top" style="align-items: center;">
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <span class="setting-name">Share error log</span>
          <span style="font-size: calc(12px * var(--font-scale, 1)); color: var(--md-sys-color-outline);">If something breaks, send this so it can be fixed.</span>
        </div>
        <button class="btn-pill-primary" type="button">Share</button>
      </div>`;
    logRow.querySelector('button').addEventListener('click', async () => {
      const res = await window.electronAPI.shareText('Violet error log', window.MurielLog ? window.MurielLog.text() : 'no log');
      if (res === 'copied' && window.MurielCore) window.MurielCore.toast('Log copied to clipboard', 'info');
    });
    storageGroup.append(limitRow, logRow);
  }

  // Live Activities on iPhone lock screen & Dynamic Island
  const trRow = document.getElementById('btn-tr-enabled') && document.getElementById('btn-tr-enabled').closest('.setting-item');
  if (window.MurielLiveActivity && trRow) {
    const la = window.MurielLiveActivity;
    const row = document.createElement('div');
    row.className = 'setting-item';
    row.innerHTML = `
      <div class="setting-item-top" style="align-items: center;">
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <span class="setting-name">Lyrics on lock screen</span>
          <span class="la-hint" style="font-size: calc(12px * var(--font-scale, 1)); color: var(--md-sys-color-outline);">The line being sung, on your lock screen and in the Dynamic Island.</span>
        </div>
        <button class="effect-switch-btn${la.enabled() ? ' active' : ''}" type="button" aria-label="Lyrics on lock screen"><span class="thumb"></span></button>
      </div>`;
    const sw = row.querySelector('button');
    sw.addEventListener('click', () => {
      const on = !sw.classList.contains('active');
      sw.classList.toggle('active', on);
      la.setEnabled(on);
    });
    la.available().then((ok) => {
      if (!ok) row.querySelector('.la-hint').textContent = 'Turn on Live Activities for Violet in the iPhone Settings app first (needs iOS 16.2 or newer).';
    });
    trRow.parentElement.insertBefore(row, trRow);
  }

  const bio = document.getElementById('artist-profile-bio');
  if (bio) bio.addEventListener('click', () => bio.classList.toggle('expanded'));

  ['btn-hw-accel', 'btn-tray-on-close', 'btn-media-keys'].forEach((id) => {
    const row = document.getElementById(id) && document.getElementById(id).closest('.setting-item');
    if (row) row.style.display = 'none';
  });
})();

(() => {
  let last = 0;
  window.addEventListener('muriel:storage-error', () => {
    if (Date.now() - last < 30000 || !window.MurielCore || !window.MurielCore.toast) return;
    last = Date.now();
    window.MurielCore.toast('Could not save to storage. Is your phone full?', 'error');
  });
})();
