
  
    // Audio Context Setup for Mechanical Relay Click Feedback
    let audioCtx = null;
    let audioEnabled = true;

    function initAudio() {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          audioCtx = new AudioContext();
        }
      }
    }

    function playClickSound() {
      if (!audioEnabled) return;
      try {
        initAudio();
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        
        // Mechanical relay click simulation (Subtle high-pass noise click)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.04);
        
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      } catch (e) {
        // Fallback silently if audio is blocked by user agent
      }
    }

    function toggleAudioFX() {
      audioEnabled = !audioEnabled;
      const icon = document.getElementById('sound-icon');
      if (audioEnabled) {
        icon.className = 'fa-solid fa-volume-high text-bp-forest dark:text-crt-green';
        showToast('RELAY AUDIO: ENABLED');
        playClickSound();
      } else {
        icon.className = 'fa-solid fa-volume-xmark text-bp-crimson dark:text-crt-amber';
        showToast('RELAY AUDIO: MUTED');
      }
    }

    // Workstation Theme Mode Switcher (Parchment Blueprint vs CRT Phosphor)
    function toggleWorkstationTheme() {
      playClickSound();
      const html = document.documentElement;
      const themeLabel = document.getElementById('theme-label');
      
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        themeLabel.textContent = 'CRT Night';
        showToast('WORKSTATION MODE: BLUEPRINT PARCHMENT');
      } else {
        html.classList.add('dark');
        themeLabel.textContent = 'Paper Warm';
        showToast('WORKSTATION MODE: NIGHT CRT PHOSPHOR');
      }
    }

    // System UTC Clock
    function updateClock() {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const timeStr = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} UTC`;
      document.getElementById('utc-clock').textContent = timeStr;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Mobile Navigation Rack Toggle
    document.getElementById('mobile-menu-toggle').addEventListener('click', () => {
      playClickSound();
      const rack = document.getElementById('mobile-rack');
      rack.classList.toggle('hidden');
    });

    document.querySelectorAll('#mobile-rack a').forEach(link => {
      link.addEventListener('click', () => {
        document.getElementById('mobile-rack').classList.add('hidden');
      });
    });

    // Toast HUD Helper
    function showToast(text) {
      const toast = document.getElementById('toast');
      const toastText = document.getElementById('toast-text');
      toastText.textContent = text;
      toast.classList.remove('opacity-0', 'translate-y-24');
      toast.classList.add('opacity-100', 'translate-y-0');
      setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-24');
      }, 2500);
    }

    // Robust Clipboard Copy Function
    function copyContact(text) {
      playClickSound();
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showToast('COPIED COMM ADDRESS: ' + text);
      } catch (err) {
        showToast('MANUAL ADDRESS: ' + text);
      }
      document.body.removeChild(textarea);
    }

    // Teletype Bourne Shell Emulator
    const teletypeOutput = document.getElementById('teletype-output');
    const terminalInput = document.getElementById('terminal-input');
    const terminalScreen = document.getElementById('terminal-screen');

    const TELETYPE_DATA = {
      'help': () => `
        <div class="text-bp-amber dark:text-crt-amber font-bold">SPARC WORKSTATION BUILT-IN COMMANDS:</div>
        <div class="grid grid-cols-2 gap-1 text-[11px] text-bp-subtle dark:text-slate-300 mt-1">
          <div><span class="font-bold text-bp-navy dark:text-crt-cyan">cat dossier</span> : Show operator specifications</div>
          <div><span class="font-bold text-bp-navy dark:text-crt-cyan">ping labs</span> : Query testbed nodes latency</div>
          <div><span class="font-bold text-bp-navy dark:text-crt-cyan">show clearance</span> : Inspect restricted vault policy</div>
          <div><span class="font-bold text-bp-navy dark:text-crt-cyan">uname -a</span> : Display OS kernel architecture</div>
          <div><span class="font-bold text-bp-navy dark:text-crt-cyan">clear</span> : Flush terminal screen buffer</div>
        </div>
      `,
      'cat dossier': () => `
        <div class="border-l-2 border-bp-navy dark:border-crt-cyan pl-2 text-[11px] space-y-1 text-bp-ink dark:text-slate-200">
          <div><span class="font-bold text-bp-amber dark:text-crt-amber">OPERATOR:</span> JokesTech (Systems & Network Engineer)</div>
          <div><span class="font-bold">LOCATION:</span> Balikpapan [UTC+8], Indonesia</div>
          <div><span class="font-bold">DOMAINS:</span> RouterOS, WireGuard mesh, Cisco switching, SIEM analysis, Linux internals.</div>
          <div><span class="font-bold">CHANNELS:</span> Active technical content on TikTok, YouTube, and Medium.</div>
        </div>
      `,
      'ping labs': () => `
        <div class="text-[11px] space-y-0.5 text-bp-subtle dark:text-slate-300">
          <div>PING node-blueprint.lab: 56 data bytes -> seq=1 rtt=1.21ms [OK]</div>
          <div>PING wireguard-hub.lab: 56 data bytes -> seq=2 rtt=0.88ms [OK]</div>
          <div>PING wazuh-siem.lab: 56 data bytes -> seq=3 rtt=1.42ms [OK]</div>
          <div class="text-emerald-700 dark:text-crt-green font-bold">--- 3/3 NODES RESPONSIVE // PACKET LOSS: 0% ---</div>
        </div>
      `,
      'show clearance': () => `
        <div class="text-[11px] space-y-1">
          <div class="text-bp-crimson dark:text-crt-amber font-bold">TIER-2 CREDENTIAL VAULT POLICY:</div>
          <div class="text-bp-subtle dark:text-slate-300">Protected archives contain MTCNA certifications, CCNA verify keys, and academic verification dockets.</div>
          <div>Use Demo Passcode <span class="text-bp-amber dark:text-crt-cyan font-bold">'ENG-2026'</span> to decrypt in section [5].</div>
        </div>
      `,
      'uname -a': () => `
        <div class="text-bp-ink dark:text-slate-300 text-[11px]">
          SunOS jokes-station 5.11 11.4.0.15.0 sun4v sparc SUNW,SPARC-Enterprise-T5220
        </div>
      `,
      'clear': () => null
    };

    function runTeletype(cmd) {
      playClickSound();
      const clean = cmd.trim().toLowerCase();
      if (!clean) return;

      if (clean === 'clear') {
        teletypeOutput.innerHTML = '';
        return;
      }

      const row = document.createElement('div');
      row.innerHTML = `<span class="text-bp-amber dark:text-crt-amber font-bold">jt-sparc#</span> <span class="font-bold text-bp-navy dark:text-crt-cyan">${escapeHtml(cmd)}</span>`;
      teletypeOutput.appendChild(row);

      const resp = document.createElement('div');
      resp.className = 'my-1 pl-2';
      if (TELETYPE_DATA[clean]) {
        resp.innerHTML = TELETYPE_DATA[clean]();
      } else {
        resp.innerHTML = `<span class="text-bp-crimson dark:text-red-400 text-[11px]">sh: command not found: ${escapeHtml(cmd)}. Type <span class="underline cursor-pointer text-bp-navy dark:text-crt-cyan" onclick="runTeletype('help')">'help'</span> for list.</span>`;
      }
      teletypeOutput.appendChild(resp);
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value;
        if (val) {
          runTeletype(val);
          terminalInput.value = '';
        }
      }
    });

    function escapeHtml(text) {
      return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Media Transmission Carousel Tuning
    const CHANNELS = [
      {
        channel: 'FEED: CH-01 // TIKTOK NETWORKING',
        badge: 'TIKTOK TRANSMISSION',
        time: 'REC ● 01:45 / 02:00',
        tag: '#NETWORKING #VLAN #SYSADMIN',
        title: 'Cara Kerja VLAN Tagging 802.1Q di Switch Cisco & MikroTik Trunk',
        desc: 'Simulasi paket Ethernet frame asli menunjukkan bagaimana 4-byte 802.1Q header disuntikkan di antara MAC address dan EtherType saat melintasi port trunk.',
        stats: '14.8K Views • 1.9K Likes • 240 Shares',
        link: 'https://tiktok.com',
        btnText: 'Watch on TikTok'
      },
      {
        channel: 'FEED: CH-02 // YOUTUBE LAB WALKTHROUGH',
        badge: 'YOUTUBE TRANSMISSION',
        time: 'REC ● 14:20 / 15:00',
        tag: '#WIREGUARD #MTU #LINUX',
        title: 'Troubleshooting WireGuard MTU, MSS Clamping & PPPoE Drops',
        desc: 'Mengapa tunnel VPN sering stuck saat membuka HTTPS besar? Pembahasan detail fragmentation, TCP handshakes, dan solusi iptables TCPMSS mangle.',
        stats: '8.4K Views • 740 Likes • 98 Comments',
        link: 'https://youtube.com',
        btnText: 'Watch on YouTube'
      },
      {
        channel: 'FEED: CH-03 // TIKTOK WIRESHARK ANALYSIS',
        badge: 'TIKTOK DEEP DIVE',
        time: 'REC ● 02:50 / 03:00',
        tag: '#CYBERSECURITY #WIRESHARK #PCAP',
        title: 'Analisis Paket Wireshark: Deteksi Nmap SYN Stealth Port Scanning',
        desc: 'Membedakan lalu lintas port scanning stealth dengan handshake normal melalui analisis TCP flags, sequence numbers, dan window sizes di packet sniffer.',
        stats: '21.3K Views • 3.2K Likes • 410 Saves',
        link: 'https://tiktok.com',
        btnText: 'Watch on TikTok'
      }
    ];

    function tuneChannel(idx) {
      playClickSound();
      const c = CHANNELS[idx];
      document.getElementById('active-video-channel').textContent = c.channel;
      document.getElementById('screen-badge').textContent = c.badge;
      document.getElementById('screen-time').textContent = c.time;
      document.getElementById('screen-tag').textContent = c.tag;
      document.getElementById('screen-title').textContent = c.title;
      document.getElementById('screen-desc').textContent = c.desc;
      document.getElementById('screen-stats').textContent = c.stats;
      document.getElementById('screen-btn-text').textContent = c.btnText;
      document.getElementById('screen-link').href = c.link;

      const buttons = document.querySelectorAll('.channel-btn');
      buttons.forEach((btn, i) => {
        if (i === idx) {
          btn.classList.add('tactile-btn-primary');
        } else {
          btn.classList.remove('tactile-btn-primary');
        }
      });
    }

    // Tier-2 Clearance Vault Logic
    const VALID_KEYS = ['ENG-2026', 'CLEARANCE-SYSV', 'JOKESTECH-SPARC'];

    function fillDemoKey(key) {
      playClickSound();
      document.getElementById('clearance-key').value = key;
    }

    function verifyClearanceKey() {
      playClickSound();
      const input = document.getElementById('clearance-key');
      const val = input.value.trim().toUpperCase();
      const msg = document.getElementById('vault-msg');
      const card = document.getElementById('passcode-card');

      if (VALID_KEYS.includes(val)) {
        msg.textContent = 'ACCESS GRANTED. INITIALIZING VERIFICATION DOSSIER...';
        msg.className = 'font-mono text-xs mt-2 text-emerald-700 dark:text-crt-green font-bold';
        
        setTimeout(() => {
          document.getElementById('vault-locked-panel').classList.add('hidden');
          document.getElementById('vault-unlocked-panel').classList.remove('hidden');
          document.getElementById('vault-status-text').textContent = 'STATUS: VAULT DECLASSIFIED';
          document.getElementById('vault-status-text').className = 'font-bold text-emerald-700 dark:text-crt-green';
          showToast('CLEARANCE VERIFIED: TIER-2 UNLOCKED');
        }, 500);
      } else {
        card.classList.add('shake-denied');
        setTimeout(() => card.classList.remove('shake-denied'), 450);
        msg.textContent = 'ACCESS DENIED: INVALID OR EXPIRED CLEARANCE KEY.';
        msg.className = 'font-mono text-xs mt-2 text-bp-crimson dark:text-red-400 font-bold';
      }
    }

    function lockVault() {
      playClickSound();
      document.getElementById('vault-unlocked-panel').classList.add('hidden');
      document.getElementById('vault-locked-panel').classList.remove('hidden');
      document.getElementById('vault-status-text').textContent = 'STATUS: VAULT LOCKED';
      document.getElementById('vault-status-text').className = 'font-bold text-bp-crimson dark:text-crt-amber';
      document.getElementById('clearance-key').value = '';
      document.getElementById('vault-msg').textContent = '';
      showToast('VAULT SESSION TERMINATED');
    }

    function requestAccessViaMail() {
      copyContact('contact@jokestech.lab');
      showToast('EMAIL COPIED. PLEASE SEND CREDENTIAL CLEARANCE REQUEST.');
    }

    // Apparatus Modal Handlers
    const appModal = document.getElementById('apparatus-modal');
    function openApparatusModal(title, port, status, desc, repo, features) {
      playClickSound();
      document.getElementById('modal-app-title').textContent = title;
      document.getElementById('modal-app-port').textContent = port;
      document.getElementById('modal-app-status').textContent = status;
      document.getElementById('modal-app-desc').textContent = desc;

      const fList = document.getElementById('modal-app-features');
      fList.innerHTML = '';
      features.forEach(f => {
        const li = document.createElement('li');
        li.className = 'flex items-center gap-2';
        li.innerHTML = `<i class="fa-solid fa-angle-right text-bp-amber dark:text-crt-amber text-[10px]"></i> <span>${f}</span>`;
        fList.appendChild(li);
      });

      appModal.classList.remove('hidden');
      setTimeout(() => appModal.classList.remove('opacity-0'), 10);
    }

    function closeApparatusModal() {
      playClickSound();
      appModal.classList.add('opacity-0');
      setTimeout(() => appModal.classList.add('hidden'), 200);
    }

    function triggerSimulateLab() {
      playClickSound();
      showToast('PROBING LAB SOCKET... TELEMETRY 100% HEALTHY');
      setTimeout(() => {
        closeApparatusModal();
      }, 700);
    }

    // Document Preview Modal Handlers
    const docModal = document.getElementById('doc-modal');
    function openDocPreview(title, docketId, desc) {
      playClickSound();
      document.getElementById('doc-modal-title').textContent = title;
      document.getElementById('doc-modal-body').textContent = desc;
      docModal.classList.remove('hidden');
      setTimeout(() => docModal.classList.remove('opacity-0'), 10);
    }

    function closeDocModal() {
      playClickSound();
      docModal.classList.add('opacity-0');
      setTimeout(() => docModal.classList.add('hidden'), 200);
    }

    // Global Key Listener for Esc
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!appModal.classList.contains('hidden')) closeApparatusModal();
        if (!docModal.classList.contains('hidden')) closeDocModal();
      }
    });

    // Navigasi Scroll Horizontal untuk Card Labs
    function scrollLabRack(direction) {
    playClickSound(); // Membunyikan suara relay switch retro
    const slider = document.getElementById('lab-slider');
    const scrollAmount = 360; // Jarak geser (lebar 1 kartu + gap)
    slider.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
    }
  