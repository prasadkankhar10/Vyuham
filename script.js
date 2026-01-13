// ----------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------
const USE_VIDEO_BACKGROUND = true; 

// Pollinations.ai API for unique art
const ART_API = "https://image.pollinations.ai/prompt/cinematic%20magical%20landscape%20concept%20art%204k%20wallpaper%20unreal%20engine%205%20render?width=800&height=600&nologin=true&seed=";

// Local Quotes Library (Instant, Offline, Reliable Fallback)
const LOCAL_QUOTES = [
    { content: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { content: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { content: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { content: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { content: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { content: "Growth begins at the end of your comfort zone.", author: "Neale Donald Walsch" },
    { content: "Consistency is what transforms average into excellence.", author: "Unknown" },
    { content: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
    { content: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { content: "What we think, we become.", author: "Buddha" },
    { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { content: "Mastery demands all of you.", author: "Preston Smiles" },
    { content: "Be so good they can't ignore you.", author: "Steve Martin" },
    { content: "Optimism is the one quality more associated with success and happiness than any other.", author: "Brian Tracy" }
];

// ----------------------------------------------------------
// PRESETS (LAYOUTS)
// ----------------------------------------------------------
const PRESETS = {
    "default": {
        name: "Classic Wide", icon: "🏠", desc: "Balanced full-screen setup",
        layout: [
            { id: 'clock', type: 'clock', x: 40, y: 40, w: 400, h: 200 },
            { id: 'quick-launch', type: 'quick-launch', x: 40, y: 260, w: 400, h: 300 },
            { id: 'pomodoro', type: 'pomodoro', x: 40, y: 580, w: 400, h: 340 },
            { id: 'search', type: 'search', x: 460, y: 40, w: 980, h: 80 },
            { id: 'kanban', type: 'kanban', x: 460, y: 140, w: 980, h: 500 },
            { id: 'music', type: 'music', x: 460, y: 660, w: 580, h: 260 },
            { id: 'focus', type: 'focus', x: 1060, y: 660, w: 380, h: 100 },
            { id: 'sticky', type: 'sticky', x: 1060, y: 780, w: 380, h: 140 },
            { id: 'art', type: 'art', x: 1460, y: 40, w: 400, h: 250 },
            { id: 'gcal', type: 'gcal', x: 1460, y: 310, w: 400, h: 450 },
            { id: 'shayari', type: 'shayari', x: 1460, y: 780, w: 400, h: 140 }
        ]
    },
    "productivity": {
        name: "Command Center", icon: "🚀", desc: "Maximum info density",
        layout: [
            { id: 'kanban', type: 'kanban', x: 40, y: 40, w: 450, h: 880 },
            { id: 'clock', type: 'clock', x: 510, y: 40, w: 880, h: 200 },
            { id: 'focus', type: 'focus', x: 510, y: 260, w: 880, h: 100 },
            { id: 'pomodoro', type: 'pomodoro', x: 510, y: 380, w: 430, h: 340 },
            { id: 'music', type: 'music', x: 960, y: 380, w: 430, h: 340 },
            { id: 'search', type: 'search', x: 510, y: 740, w: 880, h: 80 },
            { id: 'bookmarks', type: 'bookmarks', x: 510, y: 840, w: 880, h: 80 },
            { id: 'gcal', type: 'gcal', x: 1410, y: 40, w: 450, h: 500 },
            { id: 'sticky', type: 'sticky', x: 1410, y: 560, w: 450, h: 360 }
        ]
    },
    "developer": {
        name: "Dev Mode", icon: "👨‍💻", desc: "GitHub & Docs focus",
        layout: [
            { id: 'github', type: 'github', x: 40, y: 40, w: 1820, h: 200 },
            { id: 'quick-launch', type: 'quick-launch', x: 40, y: 260, w: 500, h: 400 },
            { id: 'kanban', type: 'kanban', x: 560, y: 260, w: 780, h: 400 },
            { id: 'reading-list', type: 'reading-list', x: 1360, y: 260, w: 500, h: 400 },
            { id: 'clock', type: 'clock', x: 40, y: 680, w: 300, h: 240 },
            { id: 'music', type: 'music', x: 360, y: 680, w: 500, h: 240 },
            { id: 'search', type: 'search', x: 880, y: 680, w: 980, h: 80 },
            { id: 'pomodoro', type: 'pomodoro', x: 880, y: 780, w: 480, h: 140 },
            { id: 'sticky', type: 'sticky', x: 1380, y: 780, w: 480, h: 140 }
        ]
    },
    "zen": {
        name: "Zen Mode", icon: "🍃", desc: "Minimalist & Clean",
        layout: [
            { id: 'art', type: 'art', x: 40, y: 40, w: 1820, h: 600 },
            { id: 'clock', type: 'clock', x: 40, y: 660, w: 400, h: 260 },
            { id: 'shayari', type: 'shayari', x: 460, y: 660, w: 980, h: 260 },
            { id: 'search', type: 'search', x: 1460, y: 660, w: 400, h: 80 },
            { id: 'sticky', type: 'sticky', x: 1460, y: 760, w: 400, h: 160 }
        ]
    },
    "all_grid": {
        name: "All Widgets", icon: "🧩", desc: "Everything in a dense grid",
        layout: [
            { id: 'clock', type: 'clock', x: 40, y: 40, w: 440, h: 220 },
            { id: 'quick-launch', type: 'quick-launch', x: 40, y: 280, w: 440, h: 300 },
            { id: 'pomodoro', type: 'pomodoro', x: 40, y: 600, w: 440, h: 320 },
            { id: 'search', type: 'search', x: 500, y: 40, w: 440, h: 80 },
            { id: 'kanban', type: 'kanban', x: 500, y: 140, w: 440, h: 540 },
            { id: 'music', type: 'music', x: 500, y: 700, w: 440, h: 220 },
            { id: 'github', type: 'github', x: 960, y: 40, w: 440, h: 180 },
            { id: 'focus', type: 'focus', x: 960, y: 240, w: 440, h: 100 },
            { id: 'reading-list', type: 'reading-list', x: 960, y: 360, w: 210, h: 320 },
            { id: 'bookmarks', type: 'bookmarks', x: 1190, y: 360, w: 210, h: 320 },
            { id: 'sticky', type: 'sticky', x: 960, y: 700, w: 440, h: 220 },
            { id: 'art', type: 'art', x: 1420, y: 40, w: 440, h: 300 },
            { id: 'gcal', type: 'gcal', x: 1420, y: 360, w: 440, h: 420 },
            { id: 'shayari', type: 'shayari', x: 1420, y: 800, w: 440, h: 120 }
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
            setTimeout(() => { 
                alarm.pause(); 
                alarm.currentTime = 0; 
            }, 20000); 
        }).catch(error => { console.log("Audio blocked"); });
    }
}

function getUniversalEmbedUrl(url) {
    try {
        const urlObj = new URL(url);
        // SoundCloud
        if (urlObj.hostname.includes('soundcloud.com')) {
            return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%2360a5fa&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
        }
        // Spotify
        if (urlObj.hostname.includes('spotify.com') || urlObj.hostname.includes('spotify.link')) {
             if (!urlObj.pathname.startsWith('/embed')) {
                 return url.replace('/track/', '/embed/track/').replace('/playlist/', '/embed/playlist/').replace('/album/', '/embed/album/');
            }
            return url;
        }
    } catch (e) {}
    return url;
}

// ----------------------------------------------------------
// STORAGE ENGINE
// ----------------------------------------------------------
const Storage = {
    async getLayout() { const r = await chrome.storage.local.get('layout'); return r.layout || null; },
    async saveLayout(layout) { await chrome.storage.local.set({ layout }); },
    async getWidgetData(id) { const r = await chrome.storage.local.get(`data_${id}`); return r[`data_${id}`] || {}; },
    async saveWidgetData(id, data) { await chrome.storage.local.set({ [`data_${id}`]: data }); },
    async getSettings() {
        const res = await chrome.storage.local.get('settings');
        return res.settings || {
            quickLaunch: [
                { name: 'GitHub', url: 'https://github.com' },
                { name: 'ChatGPT', url: 'https://chat.openai.com' },
                { name: 'YouTube', url: 'https://youtube.com' }
            ],
            readingList: [], customBookmarks: [], layoutLocked: false
        };
    },
    async saveSettings(settings) { await chrome.storage.local.set({ settings }); },
    async getCustomLayouts() { const r = await chrome.storage.local.get('custom_layouts'); return r.custom_layouts || []; },
    async saveCustomLayout(name, layout) { 
        const c = await this.getCustomLayouts(); 
        c.push({name, layout, icon:'💾', desc:'User Saved'}); 
        await chrome.storage.local.set({custom_layouts:c}); 
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
        el.id = item.id; el.dataset.type = item.type;
        el.style.transform = `translate(${item.x}px, ${item.y}px)`;
        el.style.width = `${item.w}px`; el.style.height = `${item.h}px`;

        const content = document.createElement('div');
        content.className = 'widget-content'; content.id = `content-${item.id}`;
        el.appendChild(content);

        const dragHandle = document.createElement('div'); dragHandle.className = 'drag-handle'; el.appendChild(dragHandle);
        const resizeHandle = document.createElement('div'); resizeHandle.className = 'resize-handle'; el.appendChild(resizeHandle);

        this.attachEvents(el, dragHandle, resizeHandle);
        return el;
    }
    attachEvents(el, dragHandle, resizeHandle) {
        dragHandle.addEventListener('mousedown', (e) => {
            if (this.isLocked) return;
            e.preventDefault(); el.classList.add('is-dragging');
            const startX = e.clientX; const startY = e.clientY;
            const matrix = new DOMMatrix(window.getComputedStyle(el).transform);
            const initialX = matrix.m41; const initialY = matrix.m42;
            const onMove = (e) => {
                let newX = Math.max(0, Math.round((initialX + e.clientX - startX) / this.gridSize) * this.gridSize);
                let newY = Math.max(0, Math.round((initialY + e.clientY - startY) / this.gridSize) * this.gridSize);
                el.style.transform = `translate(${newX}px, ${newY}px)`;
            };
            const onUp = () => {
                document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp);
                el.classList.remove('is-dragging'); this.saveState();
            };
            document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
        });
        resizeHandle.addEventListener('mousedown', (e) => {
            if (this.isLocked) return;
            e.preventDefault(); e.stopPropagation(); el.classList.add('is-dragging');
            const startX = e.clientX; const startY = e.clientY;
            const startW = parseInt(window.getComputedStyle(el).width); const startH = parseInt(window.getComputedStyle(el).height);
            const onMove = (e) => {
                let newW = Math.max(50, Math.round((startW + e.clientX - startX) / this.gridSize) * this.gridSize);
                let newH = Math.max(50, Math.round((startH + e.clientY - startY) / this.gridSize) * this.gridSize);
                el.style.width = `${newW}px`; el.style.height = `${newH}px`;
            };
            const onUp = () => {
                document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp);
                el.classList.remove('is-dragging'); el.dispatchEvent(new Event('widget-resize')); this.saveState();
            };
            document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
        });
    }
    saveState() {
        const items = [];
        this.container.querySelectorAll('.widget').forEach(w => {
            const matrix = new DOMMatrix(window.getComputedStyle(w).transform);
            items.push({ id: w.id, type: w.dataset.type, x: matrix.m41, y: matrix.m42, w: parseInt(w.style.width), h: parseInt(w.style.height) });
        });
        this.saveCallback(items);
    }
    setLocked(locked) { this.isLocked = locked; this.container.classList.toggle('locked', locked); }
}

// ----------------------------------------------------------
// WIDGET DEFINITIONS
// ----------------------------------------------------------
const Widgets = {};

// 1. CLOCK / TIMER / STOPWATCH (UPDATED)
Widgets.clock = async (container) => {
    container.className = 'widget-content widget-clock';
    let tState = await Storage.getWidgetData('clock_timer');
    // Added swState for stopwatch
    if(!tState.view) tState = { 
        isRunning: false, endTime: null, duration: 0, remaining: 0, view: 'clock',
        swState: { isRunning: false, startTime: null, elapsed: 0 } 
    };

    container.innerHTML = `
        <button class="toggle-mode-btn">${tState.view === 'clock' ? 'Timer' : (tState.view === 'timer' ? 'Stopwatch' : 'Clock')}</button>
        
        <div class="clock-display" style="display: ${tState.view === 'clock' ? 'block' : 'none'}">
            <div class="clock-time">00:00</div>
            <div class="clock-date">Loading...</div>
        </div>
        
        <div class="timer-ui" style="display: ${tState.view === 'timer' ? 'flex' : 'none'}">
            <div class="timer-inputs ${tState.isRunning || tState.remaining > 0 ? 'hidden' : ''}">
                <input type="number" class="timer-input" id="h-in" placeholder="00"> : 
                <input type="number" class="timer-input" id="m-in" placeholder="00"> : 
                <input type="number" class="timer-input" id="s-in" placeholder="00">
            </div>
            <div class="timer-display ${tState.isRunning || tState.remaining > 0 ? '' : 'hidden'}">00:00:00</div>
            <div class="timer-controls">
                <button id="t-start">${tState.isRunning ? 'Pause' : (tState.remaining > 0 ? 'Resume' : 'Start')}</button>
                <button id="t-reset">Reset</button>
            </div>
        </div>

        <div class="stopwatch-ui" style="display: ${tState.view === 'stopwatch' ? 'flex' : 'none'}; flex-direction:column; align-items:center; width:100%;">
            <div class="timer-display" id="sw-display">00:00:00</div>
            <div class="timer-controls">
                <button id="sw-start">${tState.swState && tState.swState.isRunning ? 'Stop' : 'Start'}</button>
                <button id="sw-reset">Reset</button>
            </div>
        </div>
    `;
    
    const saveState = async () => { await Storage.saveWidgetData('clock_timer', tState); };
    const fmt = (s) => {const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sec=Math.floor(s%60); return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`};

    // --- CLOCK ---
    const timeEl=container.querySelector('.clock-time');
    const dateEl=container.querySelector('.clock-date');
    const updateClock=()=>{const n=new Date();timeEl.textContent=n.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});dateEl.textContent=n.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});};
    setInterval(updateClock,1000); updateClock();

    // --- TIMER ---
    const tDisplay=container.querySelector('.timer-display'), tStart=container.querySelector('#t-start'), tReset=container.querySelector('#t-reset'), tInputs=container.querySelector('.timer-inputs');
    let timerInterval=null;

    const tickTimer=()=>{
        if(!tState.isRunning) { if(tState.remaining>0) tDisplay.textContent=fmt(Math.ceil(tState.remaining/1000)); return; }
        const left=Math.ceil((tState.endTime-Date.now())/1000);
        if(left<=0) { clearInterval(timerInterval); tState.isRunning=false; tState.remaining=0; tDisplay.textContent="00:00:00"; tStart.textContent="Start"; tInputs.classList.remove('hidden'); tDisplay.classList.add('hidden'); saveState(); playAlarmLimited(); alert("Timer Done!"); }
        else tDisplay.textContent=fmt(left);
    };

    tStart.onclick=async()=>{
        if(tState.isRunning) { tState.remaining=tState.endTime-Date.now(); tState.isRunning=false; clearInterval(timerInterval); tStart.textContent="Resume"; await saveState(); }
        else {
            let dur = tState.remaining > 0 ? tState.remaining : ((parseInt(container.querySelector('#h-in').value)||0)*3600 + (parseInt(container.querySelector('#m-in').value)||0)*60 + (parseInt(container.querySelector('#s-in').value)||0))*1000;
            if(dur<=0) return;
            tState.endTime=Date.now()+dur; tState.isRunning=true;
            tInputs.classList.add('hidden'); tDisplay.classList.remove('hidden'); tStart.textContent="Pause";
            await saveState(); tickTimer(); timerInterval=setInterval(tickTimer,1000);
        }
    };
    tReset.onclick=async()=>{ clearInterval(timerInterval); tState.isRunning=false; tState.remaining=0; tStart.textContent="Start"; tInputs.classList.remove('hidden'); tDisplay.classList.add('hidden'); await saveState(); };

    // --- STOPWATCH ---
    const swDisplay = container.querySelector('#sw-display');
    const swStart = container.querySelector('#sw-start');
    const swReset = container.querySelector('#sw-reset');
    let swInterval = null;

    // Ensure swState exists (backward compatibility)
    if(!tState.swState) tState.swState = { isRunning: false, startTime: null, elapsed: 0 };

    const updateSW = () => {
        let time = tState.swState.elapsed;
        if(tState.swState.isRunning) {
            time += (Date.now() - tState.swState.startTime);
        }
        swDisplay.textContent = fmt(time / 1000);
    };

    swStart.onclick = async () => {
        if(tState.swState.isRunning) {
            // Stop
            tState.swState.elapsed += (Date.now() - tState.swState.startTime);
            tState.swState.isRunning = false;
            swStart.textContent = "Start";
            clearInterval(swInterval);
        } else {
            // Start
            tState.swState.startTime = Date.now();
            tState.swState.isRunning = true;
            swStart.textContent = "Stop";
            swInterval = setInterval(updateSW, 100);
        }
        await saveState();
        updateSW();
    };

    swReset.onclick = async () => {
        tState.swState.isRunning = false;
        tState.swState.elapsed = 0;
        clearInterval(swInterval);
        swStart.textContent = "Start";
        updateSW();
        await saveState();
    };

    // --- TOGGLE MODES ---
    container.querySelector('.toggle-mode-btn').onclick=async(e)=>{
        if(tState.view === 'clock') tState.view = 'timer';
        else if(tState.view === 'timer') tState.view = 'stopwatch';
        else tState.view = 'clock';
        
        e.target.textContent = tState.view === 'clock' ? 'Timer' : (tState.view === 'timer' ? 'Stopwatch' : 'Clock');
        
        container.querySelector('.clock-display').style.display = tState.view==='clock'?'block':'none';
        container.querySelector('.timer-ui').style.display = tState.view==='timer'?'flex':'none';
        container.querySelector('.stopwatch-ui').style.display = tState.view==='stopwatch'?'flex':'none';
        await saveState();
    };

    // Init Logic on Load
    if(tState.isRunning) timerInterval=setInterval(tickTimer,1000);
    else if(tState.remaining>0) { tInputs.classList.add('hidden'); tDisplay.classList.remove('hidden'); tDisplay.textContent=fmt(Math.ceil(tState.remaining/1000)); }
    
    if(tState.swState.isRunning) swInterval=setInterval(updateSW, 100);
    updateSW();
};

// 2. POMODORO
Widgets.pomodoro = async (container) => {
    container.className = 'widget-content widget-pomodoro';
    let s = await Storage.getWidgetData('pomo_state');
    if(!s.mode) s = { isRunning: false, endTime: null, remaining: 0, mode: 'work', workTime: 25, breakTime: 5, autoStart: false };
    
    container.innerHTML = `
        <div class="pomo-header"><div class="pomo-status">${s.mode==='work'?'🔥 Focus':'☕ Break'}</div><label class="pomo-auto"><input type="checkbox" id="p-auto" ${s.autoStart?'checked':''}> Auto</label></div>
        <div class="pomo-display">00:00</div>
        <div class="pomo-inputs ${s.isRunning||s.remaining>0?'hidden':''}"><input id="p-work" value="${s.workTime}" class="pomo-input"><input id="p-break" value="${s.breakTime}" class="pomo-input"></div>
        <div class="pomo-controls"><button id="p-start" class="action-btn">${s.isRunning?'Pause':(s.remaining>0?'Resume':'Start')}</button><button id="p-add" class="outline">+5m</button><button id="p-skip" class="outline">Skip</button><button id="p-reset" class="danger-btn">↺</button></div>`;

    const disp=container.querySelector('.pomo-display'), stat=container.querySelector('.pomo-status'), inputs=container.querySelector('.pomo-inputs');
    const start=container.querySelector('#p-start');
    const workIn=container.querySelector('#p-work'), breakIn=container.querySelector('#p-break');
    let interval=null;

    const fmt=(sec)=>`${Math.floor(sec/60).toString().padStart(2,'0')}:${(sec%60).toString().padStart(2,'0')}`;
    const save=async()=>{ s.workTime=parseInt(workIn.value)||25; s.breakTime=parseInt(breakIn.value)||5; s.autoStart=container.querySelector('#p-auto').checked; await Storage.saveWidgetData('pomo_state', s); };
    
    workIn.onchange=save; breakIn.onchange=save; container.querySelector('#p-auto').onchange=save;

    const tick=()=>{
        if(!s.isRunning){ disp.textContent=fmt(s.remaining>0?Math.ceil(s.remaining/1000):(s.mode==='work'?s.workTime:s.breakTime)*60); return;}
        const rem=Math.ceil((s.endTime-Date.now())/1000);
        document.title=`(${fmt(rem)}) ${s.mode}`;
        if(rem<=0){
            playAlarmLimited(); if(s.autoStart){ s.mode=s.mode==='work'?'break':'work'; s.endTime=Date.now()+(s.mode==='work'?s.workTime:s.breakTime)*60000; }
            else { s.isRunning=false; s.remaining=0; s.mode=s.mode==='work'?'break':'work'; start.textContent="Start"; inputs.classList.remove('hidden'); clearInterval(interval); alert("Done!"); }
            stat.textContent=s.mode==='work'?'🔥 Focus':'☕ Break'; save(); if(s.autoStart) tick();
        } else disp.textContent=fmt(rem);
    };

    start.onclick=async()=>{
        if(s.isRunning){ s.remaining=s.endTime-Date.now(); s.isRunning=false; start.textContent="Resume"; clearInterval(interval); }
        else { 
            s.endTime = Date.now() + (s.remaining>0?s.remaining:(s.mode==='work'?s.workTime:s.breakTime)*60000);
            s.isRunning=true; start.textContent="Pause"; inputs.classList.add('hidden');
            interval=setInterval(tick,1000);
        }
        await save(); tick();
    };
    
    container.querySelector('#p-skip').onclick=async()=>{ clearInterval(interval); s.isRunning=false; s.remaining=0; s.mode=s.mode==='work'?'break':'work'; stat.textContent=s.mode==='work'?'🔥 Focus':'☕ Break'; start.textContent="Start"; inputs.classList.remove('hidden'); await save(); tick(); };
    container.querySelector('#p-reset').onclick=async()=>{ clearInterval(interval); s.isRunning=false; s.remaining=0; start.textContent="Start"; inputs.classList.remove('hidden'); await save(); tick(); };
    container.querySelector('#p-add').onclick=async()=>{ if(s.isRunning) s.endTime+=300000; else if(s.remaining>0) s.remaining+=300000; else if(s.mode==='work') {s.workTime+=5; workIn.value=s.workTime;} else {s.breakTime+=5; breakIn.value=s.breakTime;} await save(); tick(); };

    if(s.isRunning) {
         if(Date.now()>s.endTime) { s.isRunning=false; s.remaining=0; s.mode=s.mode==='work'?'break':'work'; stat.textContent=s.mode==='work'?'🔥 Focus':'☕ Break'; start.textContent="Start"; inputs.classList.remove('hidden'); save(); tick(); } 
         else { start.textContent="Pause"; inputs.classList.add('hidden'); tick(); interval=setInterval(tick,1000); }
    } else if(s.remaining>0) { inputs.classList.add('hidden'); start.textContent="Resume"; tick(); } else tick();
};

// 3. STICKY NOTE
Widgets.sticky = async (container) => {
    container.className = 'widget-content widget-sticky';
    const saved = await Storage.getWidgetData('sticky');
    container.innerHTML = `<textarea class="sticky-area" placeholder="Type thoughts here...">${saved.text || ''}</textarea>`;
    const area = container.querySelector('textarea');
    area.addEventListener('input', debounce(async (e) => {
        await Storage.saveWidgetData('sticky', { text: e.target.value });
    }, 500));
};

// 4. SHAYARI (With Fallback)
Widgets.shayari = async (container) => {
    container.className = 'widget-content widget-shayari';
    let data = await Storage.getWidgetData('shayari');
    if(!data.mode) data = { mode: 'api', custom: '' }; 

    container.innerHTML = `
        <div class="shayari-controls">
            <button id="s-toggle">${data.mode === 'api' ? 'Write Own' : 'Get Quote'}</button>
            <button id="s-refresh" class="${data.mode === 'custom' ? 'hidden' : ''}">🔄</button>
        </div>
        <div class="shayari-display ${data.mode === 'custom' ? 'hidden' : ''}">
            <p class="q-text">Loading...</p>
            <p class="q-author"></p>
        </div>
        <textarea class="shayari-input ${data.mode === 'api' ? 'hidden' : ''}" placeholder="Write your Shayari here...">${data.custom}</textarea>
    `;

    const display = container.querySelector('.shayari-display');
    const input = container.querySelector('.shayari-input');
    const toggleBtn = container.querySelector('#s-toggle');
    const refreshBtn = container.querySelector('#s-refresh');
    const qText = container.querySelector('.q-text');
    const qAuthor = container.querySelector('.q-author');

    const fetchQuote = async () => {
        qText.textContent = "Loading...";
        try {
            // Try API
            const res = await fetch("https://api.quotable.io/random?maxLength=100");
            if (!res.ok) throw new Error("API failed");
            const json = await res.json();
            qText.textContent = `"${json.content}"`;
            qAuthor.textContent = `- ${json.author}`;
        } catch (e) {
            // Fallback
            const rand = LOCAL_QUOTES[Math.floor(Math.random() * LOCAL_QUOTES.length)];
            qText.textContent = `"${rand.content}"`;
            qAuthor.textContent = `- ${rand.author}`;
        }
    };

    if(data.mode === 'api') fetchQuote();

    toggleBtn.onclick = async () => {
        data.mode = data.mode === 'api' ? 'custom' : 'api';
        await Storage.saveWidgetData('shayari', data);
        if(data.mode === 'custom') {
            display.classList.add('hidden'); refreshBtn.classList.add('hidden');
            input.classList.remove('hidden'); toggleBtn.textContent = 'Get Quote';
        } else {
            input.classList.add('hidden'); display.classList.remove('hidden');
            refreshBtn.classList.remove('hidden'); toggleBtn.textContent = 'Write Own';
            fetchQuote();
        }
    };

    refreshBtn.onclick = fetchQuote;
    input.addEventListener('input', debounce(async (e) => {
        data.custom = e.target.value;
        await Storage.saveWidgetData('shayari', data);
    }, 500));
};

// 5. GOOGLE CALENDAR
Widgets.gcal = async (container) => {
    container.className = 'widget-content widget-gcal';
    let data = await Storage.getWidgetData('gcal');
    container.innerHTML = `<button class="gcal-edit-btn">✏️</button><div class="gcal-view" style="width:100%; height:100%;">${data.url ? `<iframe src="${data.url}" scrolling="no"></iframe>` : `<div class="gcal-placeholder"><h3>📅 Google Calendar</h3><p style="font-size:12px; margin-top:10px;">Click ✏️ to add your Public Calendar Embed URL.</p></div>`}</div><div class="music-input-container" id="gcal-settings" style="display: none;"><p style="font-size:12px; color:#aaa; margin-bottom:10px;">Paste 'Embed Code' src from Google Calendar:</p><input type="text" class="music-url-input" value="${data.url || ''}"><div style="display:flex; gap:5px;"><button class="action-btn" id="gcal-save">Save</button><button class="danger-btn" id="gcal-cancel">Cancel</button></div></div>`;
    const settingsDiv = container.querySelector('#gcal-settings'), saveBtn = container.querySelector('#gcal-save'), cancelBtn = container.querySelector('#gcal-cancel'), editBtn = container.querySelector('.gcal-edit-btn'), input = container.querySelector('input'), view = container.querySelector('.gcal-view');
    editBtn.onclick = () => settingsDiv.style.display = 'flex';
    cancelBtn.onclick = () => settingsDiv.style.display = 'none';
    saveBtn.onclick = async () => {
        let url = input.value; if(url.includes('<iframe')) { const match = url.match(/src="([^"]+)"/); if(match) url = match[1]; }
        data.url = url; await Storage.saveWidgetData('gcal', data); settingsDiv.style.display = 'none'; view.innerHTML = `<iframe src="${url}" scrolling="no"></iframe>`;
    };
};

// 6. MUSIC PLAYER
Widgets.music = async (container) => {
    container.className = 'widget-content widget-music';
    let data = await Storage.getWidgetData('music_url');
    // Default to Lofi Girl
    if(!data.url) data.url = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1154746414&color=%2360a5fa&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true";
    container.innerHTML = `<button class="music-edit-btn">🎵</button><div class="music-input-container" style="display:none;"><input class="music-url-input" value="${data.url}"><button class="action-btn save">Save</button></div><iframe src="${data.url}" width="100%" height="100%"></iframe>`;
    const edit=container.querySelector('.music-edit-btn'), box=container.querySelector('.music-input-container'), frame=container.querySelector('iframe');
    edit.onclick=()=>box.style.display='flex';
    container.querySelector('.save').onclick=async()=>{
        const url=getUniversalEmbedUrl(container.querySelector('input').value);
        if(url){ frame.src=url; await Storage.saveWidgetData('music_url',{url}); box.style.display='none'; }
    };
};

// 7. OTHERS
Widgets.search = (c) => {
    c.className = 'widget-content widget-search';
    c.innerHTML = `<form action="https://google.com/search" method="GET" class="search-wrapper"><input type="text" name="q" placeholder="Search Google..." class="search-box"><div class="search-icons">🔍</div></form>`;
};
Widgets.art = (c) => {
    c.className = 'widget-content widget-art';
    const url = `${ART_API}${Math.floor(Math.random()*1000)}`;
    c.style.backgroundImage = `url('${url}')`;
    c.onclick = () => window.open(url, '_blank');
};
Widgets.focus = async (c) => {
    c.className='widget-content widget-focus';
    const s=await Storage.getWidgetData('focus');
    c.innerHTML=`<div class="focus-title">Main Focus</div><input class="focus-input" value="${s.text||''}">`;
    c.querySelector('input').oninput=debounce(async(e)=>await Storage.saveWidgetData('focus',{text:e.target.value}),500);
};
Widgets.kanban = async (c) => {
    c.className='widget-content kanban-board';
    let d=await Storage.getWidgetData('kanban'); if(!d.cols) d={cols:{todo:['Task 1'],doing:[],done:[]}};
    const render=()=>{
        c.innerHTML='';
        ['todo','doing','done'].forEach(k=>{
            const col=document.createElement('div'); col.className='kanban-col';
            col.innerHTML=`<div class="kanban-header">${k}</div><div class="kanban-items"></div><button class="kanban-add">+</button>`;
            const list=col.querySelector('.kanban-items');
            list.ondragover=e=>e.preventDefault();
            list.ondrop=async(e)=>{ try{const src=JSON.parse(e.dataTransfer.getData('text')); d.cols[k].push(d.cols[src.k].splice(src.i,1)[0]); await Storage.saveWidgetData('kanban',d); render();}catch(e){} };
            d.cols[k].forEach((t,i)=>{
                const card=document.createElement('div'); card.className='kanban-card'; card.textContent=t; card.draggable=true;
                card.ondragstart=e=>e.dataTransfer.setData('text',JSON.stringify({k,i}));
                card.ondblclick=async()=>{ d.cols[k].splice(i,1); await Storage.saveWidgetData('kanban',d); render(); };
                list.appendChild(card);
            });
            col.querySelector('button').onclick=async()=>{const t=prompt('Task:'); if(t){d.cols[k].push(t); await Storage.saveWidgetData('kanban',d); render();}};
            c.appendChild(col);
        });
    };
    render();
};
Widgets.github = (c) => c.innerHTML = `<div class="widget-content widget-github" style="filter:invert(1) hue-rotate(180deg);"><img src="https://ghchart.rshah.org/409ba5/prasadkankhar10" alt="Github Chart" style="width:100%; height:100%; object-fit:contain; padding:5px 5px 0 5px;"></div>`;
Widgets['quick-launch'] = async (c) => {
    c.className='widget-content icon-grid'; const s=await Storage.getSettings();
    (s.quickLaunch||[]).forEach(l=>{c.innerHTML+=`<a href="${l.url}" class="app-icon" title="${l.name}"><img src="${getFaviconUrl(l.url)}"></a>`});
};
Widgets['reading-list'] = async (c) => {
    c.className='widget-content icon-grid'; const s=await Storage.getSettings();
    (s.readingList||[]).forEach(l=>{c.innerHTML+=`<a href="${l.url}" class="app-icon" title="${l.name}"><img src="${getFaviconUrl(l.url)}"></a>`});
};
Widgets.bookmarks = async (c) => {
    c.className='widget-content widget-bookmarks';
    const tree=await chrome.bookmarks.getTree();
    const render=(n,p)=>{
        if(n.children) {
            const f=document.createElement('div'); f.className='bm-folder'; f.innerHTML=`<span class="bm-title">📁 ${n.title}</span><div class="bm-list"></div>`;
            f.querySelector('span').onclick=()=>f.querySelector('.bm-list').classList.toggle('open');
            n.children.forEach(ch=>render(ch,f.querySelector('.bm-list'))); p.appendChild(f);
        } else {
            p.innerHTML+=`<a href="${n.url}" class="bm-item"><img src="${getFaviconUrl(n.url)}" class="bm-icon">${n.title}</a>`;
        }
    };
    tree[0].children.forEach(n=>render(n,c));
    const s=await Storage.getSettings();
    if(s.customBookmarks && s.customBookmarks.length > 0) {
        const f=document.createElement('div'); f.className='bm-folder';
        f.innerHTML=`<span class="bm-title">⭐ Custom</span><div class="bm-list open"></div>`;
        s.customBookmarks.forEach(b => { f.querySelector('.bm-list').innerHTML+=`<a href="${b.url}" class="bm-item"><img src="${getFaviconUrl(b.url)}" class="bm-icon">${b.name}</a>`; });
        c.appendChild(f);
    }
};

// ----------------------------------------------------------
// MAIN
// ----------------------------------------------------------
async function main() {
    const s = await Storage.getSettings();
    let layout = await Storage.getLayout();
    if (!layout) { layout = PRESETS['default'].layout; await Storage.saveLayout(layout); }

    const grid = new GridEngine('dashboard-grid', async (newLayout) => await Storage.saveLayout(newLayout));
    grid.render(layout);
    grid.setLocked(s.layoutLocked);

    layout.forEach(item => {
        const c = document.getElementById(`content-${item.id}`);
        if (Widgets[item.type]) Widgets[item.type](c);
    });

    initSettings(grid);
    
    if(USE_VIDEO_BACKGROUND){ document.getElementById('bg-video').style.display='block'; document.getElementById('bg-image').style.display='none'; }
    else { document.getElementById('bg-video').style.display='none'; document.getElementById('bg-image').style.display='block'; }
}

function initSettings(grid) {
    document.getElementById('settings-btn').onclick=()=>document.getElementById('settings-modal').classList.remove('hidden');
    document.getElementById('close-settings').onclick=()=>document.getElementById('settings-modal').classList.add('hidden');
    
    // Panel Navigation
    document.querySelectorAll('.settings-nav button').forEach(b => {
        b.onclick = () => {
            document.querySelectorAll('.settings-nav button').forEach(n => n.classList.remove('active'));
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            b.classList.add('active');
            document.getElementById(`panel-${b.dataset.tab}`).classList.add('active');
        };
    });

    // Preset Layouts UI
    const layoutPanel = document.getElementById('panel-layout');
    layoutPanel.innerHTML = `
        <div class="setting-row"><label>Lock Layout</label><input type="checkbox" id="lock-layout"></div>
        <h3 style="color:white;margin-top:15px;">Preset Layouts</h3>
        <div class="layout-grid" id="layout-grid"></div>
    `;
    
    const lockCheck = document.getElementById('lock-layout');
    Storage.getSettings().then(s => lockCheck.checked = s.layoutLocked);
    lockCheck.onchange = async (e) => {
        const s = await Storage.getSettings(); s.layoutLocked = e.target.checked;
        await Storage.saveSettings(s); grid.setLocked(s.layoutLocked);
    };

    const gridEl = document.getElementById('layout-grid');
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

    // List Managers
    initListManager('ql-manager', 'quickLaunch');
    initListManager('rl-manager', 'readingList');
    initListManager('bm-manager', 'customBookmarks');
    
    document.getElementById('add-ql-btn').onclick = () => addListItem('quickLaunch');
    document.getElementById('add-rl-btn').onclick = () => addListItem('readingList');
    document.getElementById('add-bm-btn').onclick = () => addListItem('customBookmarks');

    // Export/Import
    document.getElementById('export-btn').onclick = async () => {
        const layout = await Storage.getLayout();
        const settings = await Storage.getSettings();
        const blob = new Blob([JSON.stringify({layout, settings})], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'vyuham-backup.json'; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    document.getElementById('import-file').onchange = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            try {
                const json = JSON.parse(ev.target.result);
                if(json.layout) await Storage.saveLayout(json.layout);
                if(json.settings) await Storage.saveSettings(json.settings);
                location.reload();
            } catch(e) { alert("Invalid JSON"); }
        };
        reader.readAsText(file);
    };
}

async function initListManager(containerId, key) {
    const container = document.getElementById(containerId);
    if(!container) return;
    const s = await Storage.getSettings();
    const list = s[key] || [];
    container.innerHTML = '';
    list.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'manager-item';
        div.innerHTML = `<input type="text" value="${item.name}" class="name-in"><input type="text" value="${item.url}" class="url-in"><button class="danger-btn">×</button>`;
        const save = async () => { list[index].name = div.querySelector('.name-in').value; list[index].url = div.querySelector('.url-in').value; s[key] = list; await Storage.saveSettings(s); };
        div.querySelectorAll('input').forEach(i => i.onchange = save);
        div.querySelector('button').onclick = async () => { list.splice(index, 1); s[key] = list; await Storage.saveSettings(s); initListManager(containerId, key); };
        container.appendChild(div);
    });
}

async function addListItem(key) {
    const s = await Storage.getSettings();
    s[key] = s[key] || [];
    s[key].push({ name: 'New Item', url: 'https://' });
    await Storage.saveSettings(s);
    initListManager(key === 'quickLaunch' ? 'ql-manager' : key === 'readingList' ? 'rl-manager' : 'bm-manager', key);
}

document.addEventListener('DOMContentLoaded', main);