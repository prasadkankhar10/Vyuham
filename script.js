// ----------------------------------------------------------
// CONFIGURATION & PRESETS
// ----------------------------------------------------------
const USE_VIDEO_BACKGROUND = true; 

// Pollinations.ai API for unique art
const ART_API = "https://image.pollinations.ai/prompt/cinematic%20magical%20landscape%20concept%20art%204k%20wallpaper%20unreal%20engine%205%20render?width=800&height=600&nologin=true&seed=";

const PRESETS = {
    "default": {
        name: "Classic", icon: "🏠", desc: "Balanced everyday setup",
        layout: [
            { id: 'clock', type: 'clock', x: 40, y: 40, w: 300, h: 180 },
            { id: 'search', type: 'search', x: 360, y: 40, w: 400, h: 80 },
            { id: 'art', type: 'art', x: 780, y: 40, w: 200, h: 200 },
            { id: 'quick-launch', type: 'quick-launch', x: 40, y: 240, w: 300, h: 150 },
            { id: 'reading-list', type: 'reading-list', x: 360, y: 140, w: 400, h: 150 },
            { id: 'focus', type: 'focus', x: 40, y: 400, w: 300, h: 100 },
            { id: 'calendar', type: 'calendar', x: 780, y: 260, w: 200, h: 220 },
            { id: 'music', type: 'music', x: 360, y: 310, w: 400, h: 170 },
            { id: 'pomodoro', type: 'pomodoro', x: 40, y: 520, w: 220, h: 220 },
            { id: 'kanban', type: 'kanban', x: 280, y: 520, w: 480, h: 300 },
            { id: 'bookmarks', type: 'bookmarks', x: 780, y: 500, w: 200, h: 300 },
            { id: 'github', type: 'github', x: 40, y: 760, w: 300, h: 150 }
        ]
    },
    "dev": {
        name: "Developer", icon: "👨‍💻", desc: "Code focused layout",
        layout: [
            { id: 'github', type: 'github', x: 40, y: 40, w: 500, h: 150 },
            { id: 'kanban', type: 'kanban', x: 40, y: 210, w: 500, h: 500 },
            { id: 'clock', type: 'clock', x: 560, y: 40, w: 250, h: 150 },
            { id: 'pomodoro', type: 'pomodoro', x: 830, y: 40, w: 200, h: 150 },
            { id: 'search', type: 'search', x: 560, y: 210, w: 470, h: 80 },
            { id: 'quick-launch', type: 'quick-launch', x: 560, y: 310, w: 470, h: 150 },
            { id: 'bookmarks', type: 'bookmarks', x: 560, y: 480, w: 220, h: 300 },
            { id: 'reading-list', type: 'reading-list', x: 800, y: 480, w: 230, h: 300 },
            { id: 'art', type: 'art', x: 560, y: 800, w: 220, h: 150 },
            { id: 'music', type: 'music', x: 800, y: 800, w: 230, h: 150 },
            { id: 'calendar', type: 'calendar', x: 40, y: 730, w: 240, h: 220 },
            { id: 'focus', type: 'focus', x: 300, y: 730, w: 240, h: 100 }
        ]
    }
};

// ----------------------------------------------------------
// UTILS
// ----------------------------------------------------------
function getFaviconUrl(url) {
    return `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=32`;
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function playAlarmLimited() {
    const alarm = new Audio(chrome.runtime.getURL("alarm.mp3"));
    const playPromise = alarm.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Play for 20 seconds then stop
            setTimeout(() => { 
                alarm.pause(); 
                alarm.currentTime = 0; 
            }, 20000);
        }).catch(error => { 
            console.log("Audio blocked by browser policy"); 
        });
    }
}

// --- UNIVERSAL MUSIC EMBEDDER ---
// Converts SoundCloud or Spotify links into working Embed URLs
function getUniversalEmbedUrl(url) {
    try {
        const urlObj = new URL(url);
        
        // 1. SoundCloud (Best Option)
        if (urlObj.hostname.includes('soundcloud.com')) {
            // SoundCloud Widget API
            return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%2360a5fa&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
        }
        
        // 2. Spotify
        if (urlObj.hostname.includes('spotify.com')) {
            // Convert https://open.spotify.com/playlist/xyz -> https://open.spotify.com/embed/playlist/xyz
            if (!url.includes('/embed')) {
                return url.replace('open.spotify.com/', 'open.spotify.com/embed/');
            }
            return url;
        }

        // 3. YouTube (Fallback warning)
        if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
            alert("YouTube blocks extensions (Error 153). Please use SoundCloud or Spotify for reliable music.");
            return null; 
        }

    } catch (e) { console.error(e); }
    return url; // Return as-is if unknown
}

// ----------------------------------------------------------
// STORAGE WRAPPER
// ----------------------------------------------------------
const Storage = {
    async getLayout() {
        const result = await chrome.storage.local.get('layout');
        return result.layout || null;
    },
    async saveLayout(layout) {
        await chrome.storage.local.set({ layout });
    },
    async getWidgetData(widgetId) {
        const result = await chrome.storage.local.get(`data_${widgetId}`);
        return result[`data_${widgetId}`] || {};
    },
    async saveWidgetData(widgetId, data) {
        await chrome.storage.local.set({ [`data_${widgetId}`]: data });
    },
    async getCustomLayouts() {
        const result = await chrome.storage.local.get('custom_layouts');
        return result.custom_layouts || [];
    },
    async saveCustomLayout(name, layout) {
        const current = await this.getCustomLayouts();
        current.push({ name, layout, icon: '💾', desc: 'User Saved' });
        await chrome.storage.local.set({ custom_layouts: current });
    },
    async getSettings() {
        const res = await chrome.storage.local.get('settings');
        return res.settings || {
            quickLaunch: [
                { name: 'GitHub', url: 'https://github.com' },
                { name: 'ChatGPT', url: 'https://chat.openai.com' },
                { name: 'LeetCode', url: 'https://leetcode.com' },
                { name: 'YouTube', url: 'https://youtube.com' },
                { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org' },
                { name: 'Unreal Engine', url: 'https://www.unrealengine.com' },
                { name: 'React Docs', url: 'https://react.dev' },
                { name: 'Firebase', url: 'https://firebase.google.com' },
                { name: 'Stack Overflow', url: 'https://stackoverflow.com' }
            ],
            readingList: [
                { name: 'Roadmap.sh', url: 'https://roadmap.sh' },
                { name: 'Dev.to', url: 'https://dev.to' },
                { name: 'Hacker News', url: 'https://news.ycombinator.com' },
                { name: 'Unreal Blog', url: 'https://www.unrealengine.com/en-US/blog' },
                { name: 'React Blog', url: 'https://react.dev/blog' },
                { name: 'TechCrunch', url: 'https://techcrunch.com' }
            ],
            customBookmarks: [],
            layoutLocked: false
        };
    },
    async saveSettings(settings) {
        await chrome.storage.local.set({ settings });
    }
};

// ----------------------------------------------------------
// GRID ENGINE
// ----------------------------------------------------------
class GridEngine {
    constructor(containerId, saveCallback) {
        this.container = document.getElementById(containerId);
        this.saveCallback = saveCallback;
        this.isLocked = false;
        this.gridSize = 10;
    }

    render(items) {
        this.container.innerHTML = '';
        items.forEach(item => {
            const el = this.createWidgetElement(item);
            this.container.appendChild(el);
        });
    }

    createWidgetElement(item) {
        const el = document.createElement('div');
        el.className = `widget widget-${item.type}`;
        el.id = item.id;
        el.dataset.type = item.type;
        
        el.style.transform = `translate(${item.x}px, ${item.y}px)`;
        el.style.width = `${item.w}px`;
        el.style.height = `${item.h}px`;

        const content = document.createElement('div');
        content.className = 'widget-content';
        content.id = `content-${item.id}`;
        el.appendChild(content);

        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.title = "Drag to move";
        el.appendChild(dragHandle);

        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        el.appendChild(resizeHandle);

        this.attachEvents(el, dragHandle, resizeHandle);
        return el;
    }

    attachEvents(el, dragHandle, resizeHandle) {
        dragHandle.addEventListener('mousedown', (e) => {
            if (this.isLocked) return;
            e.preventDefault();
            el.classList.add('is-dragging');
            const startX = e.clientX;
            const startY = e.clientY;
            const style = window.getComputedStyle(el);
            const matrix = new WebKitCSSMatrix(style.transform);
            const initialX = matrix.m41;
            const initialY = matrix.m42;

            const onMove = (e) => {
                let dx = e.clientX - startX;
                let dy = e.clientY - startY;
                let newX = Math.round((initialX + dx) / this.gridSize) * this.gridSize;
                let newY = Math.round((initialY + dy) / this.gridSize) * this.gridSize;
                if (newX < 0) newX = 0;
                if (newY < 0) newY = 0;
                el.style.transform = `translate(${newX}px, ${newY}px)`;
            };

            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                el.classList.remove('is-dragging');
                this.saveState();
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });

        resizeHandle.addEventListener('mousedown', (e) => {
            if (this.isLocked) return;
            e.preventDefault();
            e.stopPropagation();
            el.classList.add('is-dragging');
            const startX = e.clientX;
            const startY = e.clientY;
            const startW = parseInt(window.getComputedStyle(el).width);
            const startH = parseInt(window.getComputedStyle(el).height);

            const onMove = (e) => {
                let dx = e.clientX - startX;
                let dy = e.clientY - startY;
                let newW = Math.round((startW + dx) / this.gridSize) * this.gridSize;
                let newH = Math.round((startH + dy) / this.gridSize) * this.gridSize;
                if (newW < 50) newW = 50;
                if (newH < 50) newH = 50;
                el.style.width = `${newW}px`;
                el.style.height = `${newH}px`;
            };

            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                el.classList.remove('is-dragging');
                el.dispatchEvent(new Event('widget-resize'));
                this.saveState();
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
    }

    saveState() {
        const items = [];
        const widgets = this.container.querySelectorAll('.widget');
        widgets.forEach(w => {
            const style = window.getComputedStyle(w);
            const matrix = new WebKitCSSMatrix(style.transform);
            items.push({
                id: w.id,
                type: w.dataset.type,
                x: matrix.m41,
                y: matrix.m42,
                w: parseInt(style.width),
                h: parseInt(style.height)
            });
        });
        this.saveCallback(items);
    }

    setLocked(locked) {
        this.isLocked = locked;
        this.container.classList.toggle('locked', locked);
    }
}

// ----------------------------------------------------------
// WIDGET DEFINITIONS
// ----------------------------------------------------------
const Widgets = {
    clock: async (container) => {
        container.className = 'widget-content widget-clock';
        
        let tState = await Storage.getWidgetData('clock_timer');
        if(!tState.view) tState = { isRunning: false, endTime: null, duration: 0, view: 'clock' };

        container.innerHTML = `
            <button class="toggle-mode-btn">${tState.view === 'clock' ? 'Timer' : 'Clock'}</button>
            <div class="clock-display" style="display: ${tState.view === 'clock' ? 'block' : 'none'}">
                <div class="clock-time">00:00</div>
                <div class="clock-date">Loading...</div>
            </div>
            <div class="timer-ui" style="display: ${tState.view === 'timer' ? 'flex' : 'none'}">
                <div class="timer-inputs ${tState.isRunning ? 'hidden' : ''}">
                    <input type="number" class="timer-input" id="h-in" placeholder="00"> : 
                    <input type="number" class="timer-input" id="m-in" placeholder="00"> : 
                    <input type="number" class="timer-input" id="s-in" placeholder="00">
                </div>
                <div class="timer-display ${tState.isRunning ? '' : 'hidden'}">00:00:00</div>
                <div class="timer-controls">
                    <button id="t-start">${tState.isRunning ? 'Stop' : 'Start'}</button>
                    <button id="t-reset">Reset</button>
                </div>
            </div>
        `;

        const timeEl = container.querySelector('.clock-time');
        const dateEl = container.querySelector('.clock-date');
        function updateClock() {
            const now = new Date();
            timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            dateEl.textContent = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
        }
        setInterval(updateClock, 1000);
        updateClock();

        const timerInputs = container.querySelector('.timer-inputs');
        const timerDisplay = container.querySelector('.timer-display');
        const startBtn = container.querySelector('#t-start');
        const resetBtn = container.querySelector('#t-reset');
        let tickInterval = null;

        function formatTime(sec) {
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const s = sec % 60;
            return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
        }

        const saveState = async () => { await Storage.saveWidgetData('clock_timer', tState); };

        function tick() {
            if (!tState.isRunning || !tState.endTime) return;
            const now = Date.now();
            const remaining = Math.ceil((tState.endTime - now) / 1000);

            if (remaining <= 0) {
                clearInterval(tickInterval);
                tState.isRunning = false;
                tState.endTime = null;
                playAlarmLimited(); 
                alert("Timer Done!");
                timerInputs.classList.remove('hidden');
                timerDisplay.classList.add('hidden');
                startBtn.textContent = 'Start';
                saveState();
            } else {
                timerDisplay.textContent = formatTime(remaining);
            }
        }

        startBtn.onclick = async () => {
            if (tState.isRunning) {
                tState.isRunning = false;
                tState.endTime = null;
                clearInterval(tickInterval);
                startBtn.textContent = 'Start';
                timerInputs.classList.remove('hidden');
                timerDisplay.classList.add('hidden');
                await saveState();
            } else {
                const h = parseInt(container.querySelector('#h-in').value) || 0;
                const m = parseInt(container.querySelector('#m-in').value) || 0;
                const s = parseInt(container.querySelector('#s-in').value) || 0;
                const duration = h*3600 + m*60 + s;
                if(duration <= 0) return;
                tState.duration = duration;
                tState.endTime = Date.now() + (duration * 1000);
                tState.isRunning = true;
                timerInputs.classList.add('hidden');
                timerDisplay.classList.remove('hidden');
                startBtn.textContent = 'Stop';
                await saveState();
                tick();
                tickInterval = setInterval(tick, 1000);
            }
        };

        resetBtn.onclick = async () => {
            clearInterval(tickInterval);
            tState.isRunning = false;
            tState.endTime = null;
            startBtn.textContent = 'Start';
            timerInputs.classList.remove('hidden');
            timerDisplay.classList.add('hidden');
            container.querySelector('#h-in').value = '';
            container.querySelector('#m-in').value = '';
            container.querySelector('#s-in').value = '';
            await saveState();
        };

        container.querySelector('.toggle-mode-btn').onclick = async () => {
            const clockDiv = container.querySelector('.clock-display');
            const timerDiv = container.querySelector('.timer-ui');
            const btn = container.querySelector('.toggle-mode-btn');
            if(tState.view === 'clock') {
                tState.view = 'timer';
                clockDiv.style.display = 'none';
                timerDiv.style.display = 'flex';
                btn.textContent = 'Clock';
            } else {
                tState.view = 'clock';
                clockDiv.style.display = 'block';
                timerDiv.style.display = 'none';
                btn.textContent = 'Timer';
            }
            await saveState();
        };

        if(tState.isRunning && tState.endTime) {
            const now = Date.now();
            if(now > tState.endTime) {
                tState.isRunning = false;
                tState.endTime = null;
                startBtn.textContent = 'Start';
                timerInputs.classList.remove('hidden');
                timerDisplay.classList.add('hidden');
                await saveState();
            } else {
                timerInputs.classList.add('hidden');
                timerDisplay.classList.remove('hidden');
                startBtn.textContent = 'Stop';
                tick();
                tickInterval = setInterval(tick, 1000);
            }
        }
    },
    
    search: (container) => {
        container.className = 'widget-content widget-search';
        const micIcon = `<svg focusable="false" viewBox="0 0 24 24"><path d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"></path><path d="m11 18.08h2v3.92h-2z"></path><path d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z"></path><path d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.41c1.36 1.36 3.14 2.04 4.95 2.04 3.8 0 6.93-3.08 6.93-6.88h-2c0 2.65-2.08 4.73-4.93 4.98z"></path></svg>`;
        const lensIcon = `<svg focusable="false" viewBox="0 0 24 24"><path d="M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z M12,22c5.52,0,10-4.48,10-10S17.52,2,12,2S2,6.48,2,12S6.48,22,12,22z"></path><circle cx="12" cy="12" r="3"></circle><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12zm2 0c0 4.41 3.59 8 8 8s8-3.59 8-8s-3.59-8-8-8s-8 3.59-8 8z"></path></svg>`;

        container.innerHTML = `
            <form action="https://google.com/search" method="GET" class="search-wrapper" target="_self">
                <input type="text" name="q" placeholder="Search Google..." class="search-box" autocomplete="off">
                <div class="search-icons">
                    <a href="https://www.google.com/" class="search-icon-btn" title="Voice Search">${micIcon}</a>
                    <a href="https://www.google.com/imghp" class="search-icon-btn" title="Google Lens">${lensIcon}</a>
                </div>
            </form>
        `;
    },
    
    art: (container) => {
        container.className = 'widget-content widget-art';
        
        const seed = Math.floor(Math.random() * 1000000);
        const imgUrl = `${ART_API}${seed}`;
        
        container.style.backgroundImage = `url('${imgUrl}')`;
        container.style.cursor = 'pointer';
        container.title = "Click to open full resolution";
        container.onclick = () => window.open(imgUrl, '_blank');

        container.innerHTML = `<div class="art-credit">AI Generated Art</div>`;
    },
    
    'quick-launch': async (container) => {
        container.className = 'widget-content icon-grid';
        const settings = await Storage.getSettings();
        const links = settings.quickLaunch || [];
        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.className = 'app-icon';
            a.title = link.name;
            a.innerHTML = `<img src="${getFaviconUrl(link.url)}" alt="${link.name[0]}">`;
            container.appendChild(a);
        });
    },
    
    'reading-list': async (container) => {
        container.className = 'widget-content icon-grid';
        const settings = await Storage.getSettings();
        const links = settings.readingList || [];
        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.className = 'app-icon';
            a.title = link.name;
            a.innerHTML = `<img src="${getFaviconUrl(link.url)}" alt="${link.name[0]}">`;
            container.appendChild(a);
        });
    },
    
    bookmarks: async (container) => {
        container.className = 'widget-content widget-bookmarks';
        function renderNode(node) {
            const wrapper = document.createElement('div');
            if (node.children) {
                wrapper.className = 'bm-folder';
                const title = document.createElement('span');
                title.className = 'bm-title';
                title.textContent = `📁 ${node.title}`;
                title.onclick = () => {
                    const list = wrapper.querySelector('.bm-list');
                    list.classList.toggle('open');
                };
                const list = document.createElement('div');
                list.className = 'bm-list';
                node.children.forEach(child => list.appendChild(renderNode(child)));
                wrapper.appendChild(title);
                wrapper.appendChild(list);
            } else {
                const link = document.createElement('a');
                link.href = node.url;
                link.className = 'bm-item';
                link.innerHTML = `<img src="${getFaviconUrl(node.url)}" class="bm-icon">${node.title}`;
                wrapper.appendChild(link);
            }
            return wrapper;
        }
        chrome.bookmarks.getTree((tree) => {
            const root = tree[0].children;
            root.forEach(node => container.appendChild(renderNode(node)));
        });
        const settings = await Storage.getSettings();
        if(settings.customBookmarks.length > 0) {
            const customDiv = document.createElement('div');
            customDiv.className = 'bm-folder';
            customDiv.innerHTML = `<span class="bm-title">⭐ Custom</span>`;
            const list = document.createElement('div');
            list.className = 'bm-list open';
            settings.customBookmarks.forEach(bm => {
                const link = document.createElement('a');
                link.href = bm.url;
                link.className = 'bm-item';
                link.innerHTML = `<img src="${getFaviconUrl(bm.url)}" class="bm-icon">${bm.name}`;
                list.appendChild(link);
            });
            customDiv.appendChild(list);
            container.appendChild(customDiv);
        }
    },
    
    calendar: (container) => {
        container.className = 'widget-content widget-calendar';
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.innerHTML = `<span>${monthNames[month]}</span> <span>${year}</span>`;
        container.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'calendar-grid';
        const days = ['M','T','W','T','F','S','S'];
        days.forEach(d => {
            const el = document.createElement('div');
            el.style.opacity = '0.6';
            el.textContent = d;
            grid.appendChild(el);
        });
        const firstDay = new Date(year, month, 1).getDay(); 
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let startOffset = firstDay === 0 ? 6 : firstDay - 1;
        for(let i=0; i<startOffset; i++) grid.appendChild(document.createElement('div'));
        const today = now.getDate();
        for(let i=1; i<=daysInMonth; i++) {
            const el = document.createElement('div');
            el.className = 'cal-day';
            if(i === today) el.classList.add('cal-today');
            el.textContent = i;
            grid.appendChild(el);
        }
        container.appendChild(grid);
    },
    
    pomodoro: async (container) => {
        container.className = 'widget-content widget-pomodoro';
        if (Notification.permission !== "granted") Notification.requestPermission();
        
        let state = await Storage.getWidgetData('pomo_state');
        if(!state.mode) state = { isRunning: false, endTime: null, mode: 'work', workTime: 25, breakTime: 5 };
        
        let timerInterval = null;

        container.innerHTML = `
            <div class="pomo-status">${state.mode === 'work' ? 'Focus' : 'Break'}</div>
            <div class="pomo-display">00:00</div>
            <div class="pomo-inputs ${state.isRunning ? 'hidden' : ''}">
                <div class="pomo-group"><label>Work</label><input type="number" id="p-work" class="pomo-input" value="${state.workTime}"></div>
                <div class="pomo-group"><label>Break</label><input type="number" id="p-break" class="pomo-input" value="${state.breakTime}"></div>
            </div>
            <div class="pomo-controls">
                <button id="p-start">${state.isRunning ? 'Pause' : 'Start'}</button>
                <button id="p-stop" class="btn-stop">Stop</button>
                <button id="p-reset">Reset</button>
            </div>
        `;

        const display = container.querySelector('.pomo-display');
        const status = container.querySelector('.pomo-status');
        const inputsDiv = container.querySelector('.pomo-inputs');
        const startBtn = container.querySelector('#p-start');
        const stopBtn = container.querySelector('#p-stop');
        const resetBtn = container.querySelector('#p-reset');

        const saveState = async () => {
            state.workTime = parseInt(container.querySelector('#p-work').value) || 25;
            state.breakTime = parseInt(container.querySelector('#p-break').value) || 5;
            await Storage.saveWidgetData('pomo_state', state);
        };

        function formatTime(seconds) {
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
        }

        function notifyUser() {
            playAlarmLimited();
            if (Notification.permission === "granted") {
                new Notification("Pomodoro Timer", {
                    body: `${state.mode === 'work' ? 'Focus' : 'Break'} time is over!`,
                    icon: getFaviconUrl("https://google.com")
                });
            }
        }

        function tick() {
            if (!state.isRunning || !state.endTime) {
                const duration = state.mode === 'work' ? state.workTime : state.breakTime;
                display.textContent = formatTime(duration * 60);
                document.title = "New Tab"; 
                return;
            }
            const now = Date.now();
            const remaining = Math.ceil((state.endTime - now) / 1000);
            document.title = `(${formatTime(remaining)}) ${state.mode === 'work' ? 'Focus' : 'Break'}`;

            if (remaining <= 0) {
                clearInterval(timerInterval);
                state.isRunning = false;
                state.endTime = null;
                notifyUser();
                alert(`${state.mode.toUpperCase()} Finished!`);
                state.mode = state.mode === 'work' ? 'break' : 'work';
                status.textContent = state.mode === 'work' ? 'Focus' : 'Break';
                startBtn.textContent = 'Start';
                inputsDiv.classList.remove('hidden');
                document.title = "New Tab";
                saveState();
                tick(); 
            } else {
                display.textContent = formatTime(remaining);
            }
        }

        startBtn.onclick = async () => {
            if (state.isRunning) {
                state.isRunning = false;
                state.endTime = null;
                clearInterval(timerInterval);
                startBtn.textContent = 'Start';
                inputsDiv.classList.remove('hidden');
                document.title = "New Tab";
                await saveState();
                tick();
            } else {
                await saveState(); 
                const duration = state.mode === 'work' ? state.workTime : state.breakTime;
                state.endTime = Date.now() + (duration * 60 * 1000);
                state.isRunning = true;
                startBtn.textContent = 'Pause';
                inputsDiv.classList.add('hidden');
                await saveState();
                timerInterval = setInterval(tick, 1000);
                tick();
            }
        };

        stopBtn.onclick = async () => {
            clearInterval(timerInterval);
            state.isRunning = false;
            state.endTime = null;
            startBtn.textContent = 'Start';
            inputsDiv.classList.remove('hidden');
            document.title = "New Tab";
            await saveState();
            tick();
        };

        resetBtn.onclick = async () => {
            clearInterval(timerInterval);
            state.isRunning = false;
            state.endTime = null;
            state.mode = 'work'; 
            status.textContent = 'Focus';
            startBtn.textContent = 'Start';
            inputsDiv.classList.remove('hidden');
            document.title = "New Tab";
            await saveState();
            tick();
        };

        if (state.isRunning && state.endTime) {
            const now = Date.now();
            if (now > state.endTime) {
                state.isRunning = false;
                state.endTime = null;
                notifyUser();
                state.mode = state.mode === 'work' ? 'break' : 'work';
                status.textContent = state.mode === 'work' ? 'Focus' : 'Break';
                startBtn.textContent = 'Start';
                inputsDiv.classList.remove('hidden');
                await saveState();
            } else {
                startBtn.textContent = 'Pause';
                inputsDiv.classList.add('hidden');
                timerInterval = setInterval(tick, 1000);
            }
        }
        tick();
    },
    
    music: async (container) => {
        container.className = 'widget-content widget-music';
        
        let data = await Storage.getWidgetData('music_url');
        // Default to a nice SoundCloud Lofi if no data
        if(!data.url) data.url = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1259482549&color=%2360a5fa&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true";

        container.innerHTML = `
            <button class="music-edit-btn">🎵</button>
            <div class="music-input-container" style="display: none;">
                <input type="text" class="music-url-input" placeholder="Paste SoundCloud or Spotify URL..." value="${data.url}">
                <div style="display:flex; gap:5px;">
                    <button class="action-btn save-music-btn">Save</button>
                    <button class="danger-btn cancel-music-btn">Cancel</button>
                </div>
            </div>
            <iframe src="${data.url}" width="100%" height="100%" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>
        `;

        const editBtn = container.querySelector('.music-edit-btn');
        const inputContainer = container.querySelector('.music-input-container');
        const iframe = container.querySelector('iframe');
        const input = container.querySelector('.music-url-input');
        const saveBtn = container.querySelector('.save-music-btn');
        const cancelBtn = container.querySelector('.cancel-music-btn');

        editBtn.onclick = () => { inputContainer.style.display = 'flex'; };
        cancelBtn.onclick = () => { inputContainer.style.display = 'none'; };

        saveBtn.onclick = async () => {
            const newUrl = getUniversalEmbedUrl(input.value);
            if (newUrl) {
                iframe.src = newUrl;
                await Storage.saveWidgetData('music_url', { url: newUrl });
                inputContainer.style.display = 'none';
            }
        };
    },
    
    focus: async (container) => {
        container.className = 'widget-content widget-focus';
        const saved = await Storage.getWidgetData('focus');
        container.innerHTML = `
            <div class="focus-title">Main Focus Today</div>
            <input type="text" class="focus-input" value="${saved.text || ''}">
        `;
        const input = container.querySelector('input');
        input.addEventListener('input', debounce(async (e) => {
            await Storage.saveWidgetData('focus', { text: e.target.value });
        }, 500));
    },
    
    github: (container) => {
        container.className = 'widget-content widget-github';
        container.innerHTML = `<img src="https://ghchart.rshah.org/409ba5/prasadkankhar10" alt="Github Chart" />`;
    },
    
    kanban: async (container) => {
        container.className = 'widget-content kanban-board';
        let data = await Storage.getWidgetData('kanban');
        if (!data.cols) {
            data = {
                cols: {
                    todo: ['Task 1', 'Task 2'],
                    doing: ['Task 3'],
                    done: ['Task 4']
                }
            };
        }

        function render() {
            container.innerHTML = '';
            ['todo', 'doing', 'done'].forEach(key => {
                const col = document.createElement('div');
                col.className = 'kanban-col';
                const header = document.createElement('div');
                header.className = 'kanban-header';
                header.textContent = key;
                const itemsDiv = document.createElement('div');
                itemsDiv.className = 'kanban-items';
                itemsDiv.dataset.key = key;

                data.cols[key].forEach((text, idx) => {
                    const card = document.createElement('div');
                    card.className = 'kanban-card';
                    card.textContent = text;
                    card.draggable = true;
                    card.ondragstart = (e) => {
                        e.dataTransfer.setData('text/plain', JSON.stringify({key, idx}));
                    };
                    card.ondblclick = async () => {
                        data.cols[key].splice(idx, 1);
                        await Storage.saveWidgetData('kanban', data);
                        render();
                    };
                    itemsDiv.appendChild(card);
                });

                itemsDiv.ondragover = e => e.preventDefault();
                itemsDiv.ondrop = async (e) => {
                    e.preventDefault();
                    try {
                        const source = JSON.parse(e.dataTransfer.getData('text/plain'));
                        const item = data.cols[source.key][source.idx];
                        data.cols[source.key].splice(source.idx, 1);
                        data.cols[key].push(item);
                        await Storage.saveWidgetData('kanban', data);
                        render();
                    } catch(e){}
                };

                const addBtn = document.createElement('button');
                addBtn.className = 'kanban-add';
                addBtn.textContent = '+';
                addBtn.onclick = async () => {
                    const text = prompt('New Task:');
                    if(text) {
                        data.cols[key].push(text);
                        await Storage.saveWidgetData('kanban', data);
                        render();
                    }
                };

                col.appendChild(header);
                col.appendChild(itemsDiv);
                col.appendChild(addBtn);
                container.appendChild(col);
            });
        }
        render();
    }
};

// ----------------------------------------------------------
// SETTINGS UI
// ----------------------------------------------------------
function initSettings(gridEngine) {
    const modal = document.getElementById('settings-modal');
    const btn = document.getElementById('settings-btn');
    const close = document.getElementById('close-settings');
    const navBtns = document.querySelectorAll('.settings-nav button');
    const panels = document.querySelectorAll('.panel');

    btn.onclick = () => {
        modal.classList.remove('hidden');
        loadSettingsUI();
    };
    close.onclick = () => modal.classList.add('hidden');

    navBtns.forEach(b => {
        b.onclick = () => {
            navBtns.forEach(n => n.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            b.classList.add('active');
            document.getElementById(`panel-${b.dataset.tab}`).classList.add('active');
        };
    });

    // 1. Layout Panel
    const layoutPanel = document.getElementById('panel-layout');
    layoutPanel.innerHTML = `
        <div class="setting-row">
            <label>Lock Layout</label>
            <input type="checkbox" id="lock-layout">
        </div>
        
        <h3 style="color:white;margin-top:15px;">My Saved Layouts</h3>
        <div style="display:flex; gap:10px; margin-bottom:15px;">
            <input type="text" id="save-layout-name" placeholder="Enter Layout Name" style="flex:1; padding:8px; background:rgba(255,255,255,0.1); border:none; color:white;">
            <button id="save-layout-btn" class="action-btn" style="margin:0;">Save Current</button>
        </div>
        <div class="layout-grid" id="custom-layout-grid"></div>

        <h3 style="color:white;margin-top:20px;">Preset Layouts</h3>
        <div class="layout-grid" id="layout-grid"></div>
        <br>
        <button id="reset-layout-btn" class="danger-btn">Reset to Classic Default</button>
    `;

    // Render Layout Buttons (Presets & Custom)
    async function renderLayoutButtons() {
        const gridEl = document.getElementById('layout-grid');
        gridEl.innerHTML = '';
        Object.keys(PRESETS).forEach(key => {
            const p = PRESETS[key];
            const card = document.createElement('div');
            card.className = 'layout-card';
            card.innerHTML = `<div class="layout-icon">${p.icon}</div><div class="layout-name">${p.name}</div><div class="layout-desc">${p.desc}</div>`;
            card.onclick = async () => {
                if(confirm(`Switch to ${p.name}? Unsaved changes will be lost.`)) {
                    await Storage.saveLayout(p.layout);
                    location.reload();
                }
            };
            gridEl.appendChild(card);
        });

        // Custom Layouts
        const customGrid = document.getElementById('custom-layout-grid');
        customGrid.innerHTML = '';
        const saved = await Storage.getCustomLayouts();
        if(saved.length === 0) {
            customGrid.innerHTML = '<p style="color:#666; font-size:12px;">No saved layouts yet.</p>';
        } else {
            saved.forEach((p, index) => {
                const card = document.createElement('div');
                card.className = 'layout-card';
                card.innerHTML = `
                    <div class="layout-icon">${p.icon}</div>
                    <div class="layout-name">${p.name}</div>
                    <div class="layout-desc" style="color:var(--accent);">Load User Layout</div>
                    <button class="danger-btn" style="margin-top:5px; padding:2px 8px; font-size:10px;" id="del-layout-${index}">Delete</button>
                `;
                
                card.onclick = async (e) => {
                    if(e.target.id === `del-layout-${index}`) {
                        e.stopPropagation();
                        if(confirm('Delete this layout?')) {
                            saved.splice(index, 1);
                            await chrome.storage.local.set({ custom_layouts: saved });
                            renderLayoutButtons();
                        }
                        return;
                    }
                    if(confirm(`Load your "${p.name}" layout?`)) {
                        await Storage.saveLayout(p.layout);
                        location.reload();
                    }
                };
                customGrid.appendChild(card);
            });
        }
    }
    renderLayoutButtons();

    document.getElementById('save-layout-btn').onclick = async () => {
        const name = document.getElementById('save-layout-name').value;
        if(!name) return alert("Please enter a name");
        const currentLayout = await Storage.getLayout();
        await Storage.saveCustomLayout(name, currentLayout);
        document.getElementById('save-layout-name').value = '';
        renderLayoutButtons();
    };

    const lockCheck = document.getElementById('lock-layout');
    lockCheck.onchange = async (e) => {
        const s = await Storage.getSettings();
        s.layoutLocked = e.target.checked;
        await Storage.saveSettings(s);
        gridEngine.setLocked(s.layoutLocked);
    };

    document.getElementById('reset-layout-btn').onclick = async () => {
        if(confirm('Reset layout to Default?')) {
            await Storage.saveLayout(PRESETS['default'].layout);
            location.reload();
        }
    };

    const qlManager = document.getElementById('ql-manager');
    const rlManager = document.getElementById('rl-manager');
    const bmManager = document.getElementById('bm-manager');

    document.getElementById('add-ql-btn').onclick = () => addItem('quickLaunch');
    document.getElementById('add-rl-btn').onclick = () => addItem('readingList');
    document.getElementById('add-bm-btn').onclick = () => addItem('customBookmarks');

    async function addItem(key) {
        const s = await Storage.getSettings();
        s[key].push({ name: 'New Link', url: 'https://' });
        await Storage.saveSettings(s);
        loadSettingsUI();
    }

    document.getElementById('export-btn').onclick = async () => {
        const layout = await Storage.getLayout();
        const settings = await Storage.getSettings();
        const data = JSON.stringify({ layout, settings });
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vyuham-backup.json'; // Vyuham backup file
        a.click();
    };

    document.getElementById('import-file').onchange = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            try {
                const json = JSON.parse(ev.target.result);
                await Storage.saveLayout(json.layout);
                await Storage.saveSettings(json.settings);
                location.reload();
            } catch(err) {
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    };

    async function loadSettingsUI() {
        const s = await Storage.getSettings();
        lockCheck.checked = s.layoutLocked;
        renderListManager(qlManager, s.quickLaunch, 'quickLaunch');
        renderListManager(rlManager, s.readingList, 'readingList');
        renderListManager(bmManager, s.customBookmarks, 'customBookmarks');
    }

    function renderListManager(container, list, key) {
        container.innerHTML = '';
        list.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'manager-item';
            div.innerHTML = `
                <input type="text" value="${item.name}" class="name-in">
                <input type="text" value="${item.url}" class="url-in">
                <button class="danger-btn">×</button>
            `;
            const nameIn = div.querySelector('.name-in');
            const urlIn = div.querySelector('.url-in');
            const delBtn = div.querySelector('button');

            const update = async () => {
                list[index].name = nameIn.value;
                list[index].url = urlIn.value;
                const s = await Storage.getSettings();
                s[key] = list;
                await Storage.saveSettings(s);
            };
            nameIn.onchange = update;
            urlIn.onchange = update;
            delBtn.onclick = async () => {
                list.splice(index, 1);
                const s = await Storage.getSettings();
                s[key] = list;
                await Storage.saveSettings(s);
                renderListManager(container, list, key);
            };
            container.appendChild(div);
        });
    }
}

// ----------------------------------------------------------
// MAIN INIT
// ----------------------------------------------------------
async function main() {
    const imgBg = document.getElementById('bg-image');
    const videoBg = document.getElementById('bg-video');
    
    if (USE_VIDEO_BACKGROUND) {
        videoBg.style.display = 'block';
        imgBg.style.display = 'none';
    } else {
        videoBg.style.display = 'none';
        imgBg.style.display = 'block';
    }

    const settings = await Storage.getSettings();
    let layout = await Storage.getLayout();
    if (!layout) {
        layout = PRESETS['default'].layout;
        await Storage.saveLayout(layout);
    }

    const grid = new GridEngine('dashboard-grid', async (newLayout) => {
        await Storage.saveLayout(newLayout);
    });

    grid.render(layout);
    grid.setLocked(settings.layoutLocked);

    layout.forEach(item => {
        const container = document.getElementById(`content-${item.id}`);
        const widgetEl = document.getElementById(item.id);
        if (Widgets[item.type]) {
            Widgets[item.type](container, widgetEl);
        }
    });

    initSettings(grid);
}

document.addEventListener('DOMContentLoaded', main);