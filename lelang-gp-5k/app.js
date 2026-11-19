/**
 * ============================================================================
 * LELANG GP 5K — CORE ENGINE (LINEAR & APPLE EDITION)
 * Ultra-Lightweight • Zero Lag • Clean Native Performance
 * ============================================================================
 */

class LelangApp {
  constructor() {
    this.defaultConfig = {
      totalSlots: 15,
      pricePerSlot: 5000,
      prizePool: '35.000 GP',
      adminPhone: '6287747091072',
      headline: 'Lelang GP 5K'
    };

    this.config = this.loadConfig();
    this.slots = this.loadSlots();
    this.audioEnabled = true;
    this.adminMode = false;
    this.audioCtx = null;

    // Wheel state
    this.wheelRotation = 0;
    this.isSpinning = false;
    this.lastTickIndex = -1;

    this.initAudio();
    this.initElements();
    this.bindEvents();
    this.render();
    this.initWheel();
    this.updateAIScript();
  }

  // --- Persistence ---

  loadConfig() {
    try {
      const saved = localStorage.getItem('lelang_gp_config_v2');
      return saved ? { ...this.defaultConfig, ...JSON.parse(saved) } : { ...this.defaultConfig };
    } catch {
      return { ...this.defaultConfig };
    }
  }

  saveConfig() {
    localStorage.setItem('lelang_gp_config_v2', JSON.stringify(this.config));
  }

  loadSlots() {
    try {
      const saved = localStorage.getItem('lelang_gp_slots_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return this.generateSlots(this.config.totalSlots);
  }

  saveSlots() {
    localStorage.setItem('lelang_gp_slots_v2', JSON.stringify(this.slots));
  }

  generateSlots(total) {
    const list = [];
    for (let i = 1; i <= total; i++) {
      list.push({
        id: i,
        occupied: false,
        username: '',
        isPaid: false
      });
    }
    return list;
  }

  // --- Audio Engine (Zero External Assets) ---

  initAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    } catch {}
  }

  resumeAudio() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playTick() {
    if (!this.audioEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540 + Math.random() * 30, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.audioCtx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.035);
    } catch {}
  }

  playChime() {
    if (!this.audioEnabled || !this.audioCtx) return;
    try {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const start = this.audioCtx.currentTime + idx * 0.1;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(start);
        osc.stop(start + 0.65);
      });
    } catch {}
  }

  // --- Elements & Events ---

  initElements() {
    this.displayHeadline = document.getElementById('displayHeadline');
    this.prizeMeta = document.getElementById('prizeMeta');
    this.displayPrice = document.getElementById('displayPrice');
    this.txtOccupied = document.getElementById('txtOccupied');
    this.txtTotal = document.getElementById('txtTotal');
    this.txtRemaining = document.getElementById('txtRemaining');
    this.txtPercent = document.getElementById('txtPercent');
    this.progressFill = document.getElementById('progressFill');
    this.fullBanner = document.getElementById('fullBanner');
    this.couponGrid = document.getElementById('couponGrid');

    this.adminDrawer = document.getElementById('adminDrawer');
    this.btnToggleAdmin = document.getElementById('btnToggleAdmin');
    this.btnToggleAudio = document.getElementById('btnToggleAudio');

    // Admin Inputs
    this.cfgTotalSlots = document.getElementById('cfgTotalSlots');
    this.cfgPrizePool = document.getElementById('cfgPrizePool');
    this.cfgPrice = document.getElementById('cfgPrice');
    this.cfgPhone = document.getElementById('cfgPhone');
    this.btnSaveConfig = document.getElementById('btnSaveConfig');
    this.btnDemoFill = document.getElementById('btnDemoFill');
    this.btnResetRound = document.getElementById('btnResetRound');
    this.btnDirectSpin = document.getElementById('btnDirectSpin');

    // AI Elements
    this.aiScriptBox = document.getElementById('aiScriptBox');
    this.btnRefreshAI = document.getElementById('btnRefreshAI');
    this.btnSpeakAI = document.getElementById('btnSpeakAI');
    this.btnCopyAI = document.getElementById('btnCopyAI');
    this.btnGeminiKey = document.getElementById('btnGeminiKey');

    // Modals
    this.bookingModal = document.getElementById('bookingModal');
    this.winnerModal = document.getElementById('winnerModal');
    this.bookingSlotSelect = document.getElementById('bookingSlotSelect');
    this.bookingUsername = document.getElementById('bookingUsername');
    this.bookingPriceTag = document.getElementById('bookingPriceTag');
    this.bookingForm = document.getElementById('bookingForm');

    // Wheel
    this.wheelCanvas = document.getElementById('wheelCanvas');
    this.wheelCtx = this.wheelCanvas ? this.wheelCanvas.getContext('2d') : null;
    this.btnSpinWheel = document.getElementById('btnSpinWheel');
  }

  bindEvents() {
    document.addEventListener('click', () => this.resumeAudio(), { once: true });

    // Audio Toggle
    if (this.btnToggleAudio) {
      this.btnToggleAudio.onclick = () => {
        this.audioEnabled = !this.audioEnabled;
        this.btnToggleAudio.textContent = this.audioEnabled ? 'Audio ON' : 'Audio Muted';
        this.btnToggleAudio.classList.toggle('active', !this.audioEnabled);
      };
    }

    // Admin Mode Toggle
    if (this.btnToggleAdmin) {
      this.btnToggleAdmin.onclick = () => {
        this.adminMode = !this.adminMode;
        document.body.classList.toggle('admin-mode', this.adminMode);
        this.btnToggleAdmin.classList.toggle('active', this.adminMode);
        this.btnToggleAdmin.textContent = this.adminMode ? 'Tutup Admin' : 'Admin Mode';
        this.populateAdminFields();
        this.render();
      };
    }

    // Save Admin Config
    if (this.btnSaveConfig) {
      this.btnSaveConfig.onclick = () => {
        const newTotal = parseInt(this.cfgTotalSlots.value, 10) || 15;
        this.config.totalSlots = newTotal;
        this.config.prizePool = this.cfgPrizePool.value.trim() || '35.000 GP';
        this.config.pricePerSlot = parseInt(this.cfgPrice.value, 10) || 5000;
        this.config.adminPhone = this.cfgPhone.value.trim() || '6287747091072';

        if (this.slots.length !== newTotal) {
          this.slots = this.generateSlots(newTotal);
        }

        this.saveConfig();
        this.saveSlots();
        this.render();
        alert('Pengaturan berhasil diperbarui!');
      };
    }

    // Demo Fill (12 of 15 slots)
    if (this.btnDemoFill) {
      this.btnDemoFill.onclick = () => this.fillDemo();
    }

    // Reset Round
    if (this.btnResetRound) {
      this.btnResetRound.onclick = () => {
        if (confirm('Kosongkan semua kupon dan mulai putaran baru?')) {
          this.slots = this.generateSlots(this.config.totalSlots);
          this.saveSlots();
          this.render();
          this.updateAIScript();
        }
      };
    }

    // Direct Spin from Admin
    if (this.btnDirectSpin) {
      this.btnDirectSpin.onclick = () => {
        const el = document.getElementById('wheelSection');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => this.spinWheel(), 400);
      };
    }

    // Gemini AI Refresh
    if (this.btnRefreshAI) {
      this.btnRefreshAI.onclick = () => this.updateAIScript();
    }

    // Gemini TTS Speak
    if (this.btnSpeakAI) {
      this.btnSpeakAI.onclick = () => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(this.aiScriptBox.textContent);
        utt.lang = 'id-ID';
        utt.rate = 1.05;
        window.speechSynthesis.speak(utt);
      };
    }

    // Gemini Copy Script
    if (this.btnCopyAI) {
      this.btnCopyAI.onclick = () => {
        navigator.clipboard.writeText(this.aiScriptBox.textContent.trim());
        alert('Naskah host berhasil disalin!');
      };
    }

    // Gemini Key Setup
    if (this.btnGeminiKey) {
      this.btnGeminiKey.onclick = () => {
        const current = window.geminiService.getApiKey();
        const entered = prompt('Masukkan Google Gemini API Key (biarkan kosong untuk mode simulasi):', current);
        if (entered !== null) {
          window.geminiService.setApiKey(entered);
          alert(entered.trim() ? 'Gemini API Key tersimpan.' : 'Kembali ke mode simulasi bawaan.');
          this.updateAIScript();
        }
      };
    }

    // Wheel Spin Button
    if (this.btnSpinWheel) {
      this.btnSpinWheel.onclick = () => this.spinWheel();
    }

    // Booking Form Submit (WhatsApp Checkout)
    if (this.bookingForm) {
      this.bookingForm.onsubmit = (e) => {
        e.preventDefault();
        this.submitBooking(e);
      };
    }

    // Modal Close Buttons (Click & Touch)
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeModals();
      };
    });

    // Close on tapping overlay backdrop
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          this.closeModals();
        }
      };
    });

    // Close modal on Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModals();
    });
  }

  populateAdminFields() {
    if (this.cfgTotalSlots) this.cfgTotalSlots.value = this.config.totalSlots;
    if (this.cfgPrizePool) this.cfgPrizePool.value = this.config.prizePool;
    if (this.cfgPrice) this.cfgPrice.value = this.config.pricePerSlot;
    if (this.cfgPhone) this.cfgPhone.value = this.config.adminPhone;
  }

  // --- Rendering ---

  render() {
    const total = this.slots.length;
    const occupied = this.slots.filter(s => s.occupied).length;
    const remaining = total - occupied;
    const percent = Math.round((occupied / total) * 100);
    const isFull = occupied === total;

    if (this.prizeMeta) this.prizeMeta.textContent = `Hadiah ${this.config.prizePool}`;
    if (this.displayPrice) this.displayPrice.textContent = `Rp${this.config.pricePerSlot.toLocaleString('id-ID')} / kupon`;

    if (this.txtOccupied) this.txtOccupied.textContent = occupied;
    if (this.txtTotal) this.txtTotal.textContent = total;
    if (this.txtRemaining) this.txtRemaining.textContent = isFull ? 'Kuota penuh' : `Sisa ${remaining} kupon`;
    if (this.txtPercent) this.txtPercent.textContent = `${percent}%`;

    if (this.progressFill) {
      this.progressFill.style.width = `${percent}%`;
    }

    if (this.fullBanner) {
      this.fullBanner.style.display = isFull ? 'flex' : 'none';
    }

    if (this.btnSpinWheel) {
      this.btnSpinWheel.disabled = occupied < 2 || this.isSpinning;
      this.btnSpinWheel.textContent = this.isSpinning
        ? 'Mengundi...'
        : `Putar Undian (${occupied} Peserta)`;
    }

    this.renderGrid();
    this.drawWheel();
  }

  renderGrid() {
    if (!this.couponGrid) return;
    this.couponGrid.innerHTML = '';

    this.slots.forEach(slot => {
      const card = document.createElement('div');
      card.className = `slot-card ${slot.occupied ? 'occupied' : 'available'}`;
      const numStr = `#${slot.id.toString().padStart(2, '0')}`;

      if (slot.occupied) {
        card.innerHTML = `
          <div>
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span class="slot-num tabular">${numStr}</span>
              <span class="slot-paid-tag">✓ Lunas</span>
            </div>
            <div class="slot-username">${slot.username}</div>
          </div>
          <div class="slot-btn-hint" style="color: var(--text-tertiary);">Terkunci</div>
          <div class="admin-card-actions">
            <button class="btn-card-xs btn-edit-slot">Edit</button>
            <button class="btn-card-xs btn-clear-slot">Kosongkan</button>
          </div>
        `;

        // Admin actions inside card
        const btnEdit = card.querySelector('.btn-edit-slot');
        const btnClear = card.querySelector('.btn-clear-slot');

        if (btnEdit) {
          btnEdit.onclick = (e) => {
            e.stopPropagation();
            const newName = prompt(`Ubah username TikTok untuk kupon ${numStr}:`, slot.username);
            if (newName !== null) {
              slot.username = newName.trim().startsWith('@') ? newName.trim() : `@${newName.trim()}`;
              this.saveSlots();
              this.render();
            }
          };
        }

        if (btnClear) {
          btnClear.onclick = (e) => {
            e.stopPropagation();
            if (confirm(`Kosongkan kupon ${numStr}?`)) {
              slot.occupied = false;
              slot.username = '';
              slot.isPaid = false;
              this.saveSlots();
              this.render();
            }
          };
        }
      } else {
        card.innerHTML = `
          <div>
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span class="slot-num tabular">${numStr}</span>
              <span class="slot-state-text">Tersedia</span>
            </div>
            <div class="slot-price-label tabular">Rp${this.config.pricePerSlot.toLocaleString('id-ID')}</div>
          </div>
          <div class="slot-btn-hint">Pilih kupon →</div>
          <div class="admin-card-actions">
            <button class="btn-card-xs btn-quick-fill">Isi Cepat</button>
          </div>
        `;

        card.onclick = () => this.openBooking(slot.id);

        const btnQuick = card.querySelector('.btn-quick-fill');
        if (btnQuick) {
          btnQuick.onclick = (e) => {
            e.stopPropagation();
            const name = prompt(`Masukkan username TikTok untuk kupon ${numStr}:`, '@peserta');
            if (name) {
              slot.occupied = true;
              slot.username = name.trim().startsWith('@') ? name.trim() : `@${name.trim()}`;
              slot.isPaid = true;
              this.saveSlots();
              this.render();
            }
          };
        }
      }

      this.couponGrid.appendChild(card);
    });
  }

  // --- Booking & WhatsApp ---

  openBooking(slotId) {
    if (!this.bookingModal) return;

    if (this.bookingSlotSelect) {
      this.bookingSlotSelect.innerHTML = '';
      const available = this.slots.filter(s => !s.occupied);
      if (available.length === 0) {
        alert('Semua kupon lelang sudah penuh.');
        return;
      }
      available.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `Nomor #${s.id.toString().padStart(2, '0')}`;
        if (s.id === slotId) opt.selected = true;
        this.bookingSlotSelect.appendChild(opt);
      });
    }

    if (this.bookingUsername) {
      this.bookingUsername.value = '';
      setTimeout(() => this.bookingUsername.focus(), 100);
    }

    if (this.bookingPriceTag) {
      this.bookingPriceTag.textContent = `Rp${this.config.pricePerSlot.toLocaleString('id-ID')}`;
    }

    this.bookingModal.classList.add('active');
  }

  submitBooking(e) {
    if (e && e.preventDefault) e.preventDefault();
    let username = this.bookingUsername.value.trim();
    if (!username) {
      alert('Silakan masukkan username TikTok kamu.');
      this.bookingUsername.focus();
      return;
    }
    if (!username.startsWith('@')) username = `@${username}`;

    const slotId = parseInt(this.bookingSlotSelect.value, 10);
    const slot = this.slots.find(s => s.id === slotId);

    if (!slot || slot.occupied) {
      alert('Nomor kupon ini baru saja dipesan oleh peserta lain. Silakan pilih nomor lainnya.');
      return;
    }

    // Reserve slot locally
    slot.occupied = true;
    slot.username = username;
    slot.isPaid = true;
    this.saveSlots();
    this.render();
    this.closeModals();

    // Direct WhatsApp Template
    const slotStr = `#${slotId.toString().padStart(2, '0')}`;
    const priceStr = `Rp${this.config.pricePerSlot.toLocaleString('id-ID')}`;

    const msg = 
`Halo Bang Jeyssen! Saya mau beli kupon Lelang GP 5K:
• Username TikTok: ${username}
• Nomor Kupon: ${slotStr}
• Total: ${priceStr}
Mohon dicek ya Bang! Terima kasih.`;

    // Use api.whatsapp.com deep link with window.location.href (instant native app trigger on iOS & Android, no popup block)
    const waUrl = `https://api.whatsapp.com/send?phone=${this.config.adminPhone}&text=${encodeURIComponent(msg)}`;

    try {
      window.location.href = waUrl;
    } catch (err) {
      window.open(waUrl, '_self');
    }

    this.updateAIScript();
  }

  closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => {
      m.classList.remove('active');
    });
  }

  // --- Wheel Physics ---

  initWheel() {
    if (!this.wheelCanvas) return;
    this.wheelCanvas.width = 600;
    this.wheelCanvas.height = 600;
    this.drawWheel();
  }

  drawWheel() {
    if (!this.wheelCtx || !this.wheelCanvas) return;
    const ctx = this.wheelCtx;
    const size = this.wheelCanvas.width;
    const center = size / 2;
    const radius = center - 16;

    ctx.clearRect(0, 0, size, height = size);

    let list = this.slots.filter(s => s.occupied);
    const isEmpty = list.length === 0;
    if (isEmpty) list = this.slots;

    const count = list.length;
    const sliceAngle = (Math.PI * 2) / count;

    // Dark slate & charcoal wedges
    const colors = ['#131519', '#1a1d24', '#21252d'];

    for (let i = 0; i < count; i++) {
      const item = list[i];
      const start = this.wheelRotation + (i * sliceAngle);
      const end = start + sliceAngle;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();

      // Hairline border
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();

      // Text
      ctx.translate(center, center);
      ctx.rotate(start + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      ctx.font = '700 18px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`#${item.id.toString().padStart(2, '0')}`, radius - 24, 0);

      ctx.font = '500 13px "Inter", sans-serif';
      ctx.fillStyle = item.occupied ? '#94a3b8' : '#475569';
      const label = item.occupied ? (item.username.length > 12 ? item.username.slice(0, 10) + '..' : item.username) : 'Tersedia';
      ctx.fillText(label, radius - 75, 0);

      ctx.restore();
    }

    // Outer subtle rim
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    // Center hub
    ctx.beginPath();
    ctx.arc(center, center, 32, 0, Math.PI * 2);
    ctx.fillStyle = '#08090a';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.stroke();
  }

  spinWheel() {
    if (this.isSpinning) return;
    const participants = this.slots.filter(s => s.occupied);
    if (participants.length === 0) {
      alert('Belum ada kupon terisi untuk diundi.');
      return;
    }

    this.isSpinning = true;
    this.render();

    const duration = 5500;
    const spins = 5 + Math.random() * 3;
    const totalAngle = spins * Math.PI * 2 + Math.random() * Math.PI * 2;
    const startRotation = this.wheelRotation;
    const startTime = performance.now();
    const sliceAngle = (Math.PI * 2) / participants.length;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Apple-style cubic ease out
      const ease = 1 - Math.pow(1 - progress, 4);
      this.wheelRotation = startRotation + totalAngle * ease;

      // Tick detection (pointer at top 1.5 * PI)
      const norm = (1.5 * Math.PI - (this.wheelRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const wedgeIdx = Math.floor(norm / sliceAngle) % participants.length;

      if (wedgeIdx !== this.lastTickIndex) {
        this.lastTickIndex = wedgeIdx;
        this.playTick();
      }

      this.drawWheel();

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        this.isSpinning = false;
        const winner = participants[wedgeIdx];
        this.showWinner(winner);
        this.render();
      }
    };

    requestAnimationFrame(tick);
  }

  showWinner(winner) {
    this.playChime();
    const nameEl = document.getElementById('winnerName');
    const slotEl = document.getElementById('winnerSlot');
    const prizeEl = document.getElementById('winnerPrize');
    const pinnedEl = document.getElementById('winnerPinnedText');

    if (nameEl) nameEl.textContent = winner.username;
    if (slotEl) slotEl.textContent = `Kupon Resmi: #${winner.id.toString().padStart(2, '0')}`;
    if (prizeEl) prizeEl.textContent = `Hadiah: ${this.config.prizePool}`;
    if (pinnedEl) pinnedEl.value = `Selamat kepada ${winner.username} (Kupon #${winner.id.toString().padStart(2, '0')}) pemenang hadiah ${this.config.prizePool}! Silakan chat WA 087747091072 untuk klaim.`;

    if (this.winnerModal) this.winnerModal.classList.add('active');
  }

  // --- Gemini AI Host Assistant ---

  async updateAIScript() {
    if (!this.aiScriptBox) return;

    const total = this.slots.length;
    const occupied = this.slots.filter(s => s.occupied).length;
    const remaining = total - occupied;
    const isFull = occupied === total;

    // Natural, refined streamer copy (Linear-grade, zero cringe)
    if (isFull) {
      this.aiScriptBox.textContent = `“Semua ${total} kupon sudah resmi terkunci! Kuota lelang hari ini 100% penuh. Langsung kita putar roda undian untuk menentukan siapa yang berhak membawa pulang ${this.config.prizePool}!”`;
      return;
    }

    if (remaining <= 3) {
      this.aiScriptBox.textContent = `“Sisa ${remaining} kupon terakhir gais. Bagi yang mau mengamankan nomor undian sebelum kuota ditutup, langsung pilih kupon dan selesaikan via WhatsApp sekarang.”`;
      return;
    }

    this.aiScriptBox.textContent = `“Lelang kupon edisi ${this.config.prizePool} sedang berlangsung. Tersedia ${remaining} kupon dengan harga Rp${this.config.pricePerSlot.toLocaleString('id-ID')} per tiket. Cek nomor pilihanmu di layar.”`;
  }

  // --- Demo Fill ---

  fillDemo() {
    const demos = [
      '@jeyssen', '@rafli_gaming', '@bima_putra', '@aldi_sultan',
      '@doni_pro', '@yoga_88', '@kevin_clash', '@dimas_king',
      '@adit_point', '@rendy_esport', '@gilang_win', '@rizky_gacha'
    ];

    this.slots.forEach((s, i) => {
      if (i < 12) {
        s.occupied = true;
        s.username = demos[i % demos.length];
        s.isPaid = true;
      } else {
        s.occupied = false;
        s.username = '';
        s.isPaid = false;
      }
    });

    this.saveSlots();
    this.render();
    this.updateAIScript();
  }
}

// Boot
window.addEventListener('DOMContentLoaded', () => {
  window.lelangApp = new LelangApp();
});
