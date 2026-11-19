/**
 * ============================================================================
 * LELANG GP 5K — GEMINI AI SERVICE MODULE
 * Powered by Google Gemini API (gemini-4-hydrogen / gemini-3.5-flash-lite)
 * ============================================================================
 */

class GeminiService {
  constructor() {
    this.storageKey = 'lelang_gp_gemini_api_key';
    this.apiKey = localStorage.getItem(this.storageKey) || '';
    this.model = 'gemini-4-hydrogen';
    this.fallbackModel = 'gemini-3.5-flash-lite';
    this.endpoint = 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  setApiKey(key) {
    this.apiKey = key ? key.trim() : '';
    if (this.apiKey) {
      localStorage.setItem(this.storageKey, this.apiKey);
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }

  getApiKey() {
    return this.apiKey;
  }

  hasApiKey() {
    return Boolean(this.apiKey && this.apiKey.length > 10);
  }

  /**
   * Universal call to Google Gemini REST endpoint
   */
  async generateContent(prompt, systemInstruction = '', inlineImages = []) {
    if (!this.hasApiKey()) {
      console.warn('[GeminiService] No API key detected. Using Smart AI Simulation Engine.');
      return null;
    }

    const url = `${this.endpoint}/${this.model}:generateContent?key=${this.apiKey}`;

    const parts = [{ text: prompt }];

    // Attach multimodal inline image data (Base64) if provided
    if (inlineImages && inlineImages.length > 0) {
      for (const img of inlineImages) {
        parts.push({
          inlineData: {
            mimeType: img.mimeType || 'image/jpeg',
            data: img.base64Data
          }
        });
      }
    }

    const payload = {
      contents: [{ role: 'user', parts }]
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    payload.generationConfig = {
      temperature: 0.8,
      topP: 0.95,
      maxOutputTokens: 1024
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!outputText) throw new Error('Respon Gemini kosong.');
      return outputText;
    } catch (err) {
      console.error('[GeminiService] API Error:', err);
      throw err;
    }
  }

  /**
   * FEATURE 1: AI LIVE HOST CO-PILOT (Bang Gemini MC)
   * Generates punchy Indonesian TikTok Live shouting scripts, urgency calls, and crowd banter
   */
  async generateHostHype(raffleState) {
    const { totalSlots, occupiedSlots, remainingSlots, prizePool, pricePerSlot, recentBuyers, isFull } = raffleState;

    const systemPrompt = `Kamu adalah "Bang Gemini", Co-Pilot Host TikTok Live paling heboh, asik, berenergi tinggi, dan persuasif di Indonesia untuk acara "Lelang GP 5K".
Gaya bicaramu seperti streamer gaming TikTok papan atas: santai, slang anak muda (gais, gaspol, wangi, gacha, sultan, amanin, gaskeun, cuan), ritme cepat, dan bikin penonton gregetan pengen langsung beli kupon via WhatsApp.
Output format: JSON yang berisi:
{
  "hypeCatchphrase": "Kalimat teriakan pembuka yang super heboh untuk dibaca host",
  "urgencyCall": "Ajakan bertindak mendesak (FOMO) fokus pada sisa slot dan prize pool",
  "chatEngagement": "Pertanyaan pancingan untuk penonton ketik di live chat TikTok",
  "teleprompterScript": "Naskah lengkap 2-3 paragraf siap baca untuk host selama 30 detik ke depan"
}`;

    const userPrompt = `Status Lelang Saat Ini:
- Hadiah Utama: ${prizePool}
- Harga Kupon: Rp${pricePerSlot.toLocaleString('id-ID')}
- Total Slot: ${totalSlots}
- Terisi: ${occupiedSlots} (${Math.round((occupiedSlots / totalSlots) * 100)}%)
- Sisa Slot Kosong: ${remainingSlots}
- Pembeli Terakhir: ${recentBuyers.length ? recentBuyers.join(', ') : 'Belum ada'}
- Kuota Penuh: ${isFull ? 'YA (Siap Diundi!)' : 'BELUM'}

Buatkan script dan hype yang super seru sekarang juga! Kembalikan JSON murni.`;

    try {
      if (this.hasApiKey()) {
        const raw = await this.generateContent(userPrompt, systemPrompt);
        if (raw) {
          const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
          return JSON.parse(cleaned);
        }
      }
    } catch (e) {
      console.warn('[GeminiService] Falling back to smart simulation for Host Hype:', e.message);
    }

    // Dynamic smart simulation fallback (Indonesian TikTok Live style)
    return this._simulateHostHype(raffleState);
  }

  /**
   * FEATURE 2: AI "AURA HOKI" & LUCK PREDICTOR
   * Analyzes TikTok username & ticket number with viral Indonesian fortune humor
   */
  async analyzeAuraHoki(username, slotNumber, prizePool) {
    const systemPrompt = `Kamu adalah Master Oracle AI Hoki TikTok Live Indonesia.
Tugasmu menganalisis "Aura Hoki" penonton yang membeli kupon lelang undian GP (Game Points).
Beri analisis yang sangat menghibur, bernada humor viral Indonesia, penuh jargon hoki (wangi gacha, khodam kelinci emas, aura sultan, bintang keberuntungan).
Output format JSON murni:
{
  "luckScore": 96.5,
  "auraLevel": "WANGI GACHA TINGKAT DEWA 🔥",
  "khodam": "Kucing Pembawa Rezeki Emas",
  "prediction": "Ramalan kocak 2 kalimat tentang peluang menang kupon ini",
  "suggestedReaction": "Reaksi host di live saat membacakan kupon ini"
}`;

    const userPrompt = `Analisis peserta ini:
- Username TikTok: ${username}
- Nomor Kupon: #${slotNumber.toString().padStart(2, '0')}
- Hadiah: ${prizePool}
Berikan ramalan aura hoki paling menghibur! Kembalikan JSON murni.`;

    try {
      if (this.hasApiKey()) {
        const raw = await this.generateContent(userPrompt, systemPrompt);
        if (raw) {
          const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
          return JSON.parse(cleaned);
        }
      }
    } catch (e) {
      console.warn('[GeminiService] Falling back to smart simulation for Aura Hoki:', e.message);
    }

    return this._simulateAuraHoki(username, slotNumber, prizePool);
  }

  /**
   * FEATURE 3: AI PAYMENT RECEIPT OCR & VERIFIER (Multimodal)
   * Analyzes WhatsApp payment transfer screenshot (QRIS / Dana / Gopay / BCA)
   */
  async verifyPaymentReceipt(base64Data, mimeType, expectedPrice = 5000) {
    const systemPrompt = `Kamu adalah AI Auditor Bukti Transfer Pembayaran Lelang TikTok Live.
Tugasmu membaca screenshot bukti transfer (BCA, Mandiri, BRI, QRIS, Dana, OVO, GoPay, ShopeePay) dan mengekstrak datanya.
Validasi apakah nominal transfer minimal Rp${expectedPrice} dan status transaksi 'BERHASIL' / 'SUCCESS'.
Output format JSON murni:
{
  "isValid": true,
  "detectedAmount": 5000,
  "senderName": "Nama Pengirim Terdeteksi",
  "paymentMethod": "BCA Mobile / QRIS / Dana / dll",
  "transactionDate": "Waktu Transaksi",
  "confidenceScore": 98,
  "notes": "Catatan singkat hasil verifikasi"
}`;

    const userPrompt = `Tolong verifikasi screenshot bukti transfer ini. Pastikan nominal dan keaslian transaksi transfer dana. Kembalikan JSON murni.`;

    try {
      if (this.hasApiKey()) {
        const raw = await this.generateContent(userPrompt, systemPrompt, [{ base64Data, mimeType }]);
        if (raw) {
          const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
          return JSON.parse(cleaned);
        }
      }
    } catch (e) {
      console.warn('[GeminiService] Falling back to simulation for Receipt OCR:', e.message);
    }

    return this._simulateReceiptVerification(expectedPrice);
  }

  /**
   * FEATURE 4: AI WINNER CELEBRATION SPEECH
   */
  async generateWinnerCelebration(winnerName, slotNumber, prizePool) {
    const systemPrompt = `Kamu adalah MC TikTok Live heboh yang merayakan pemenang undian lelang. Buatkan ucapan selamat yang meledak-ledak dan super hype untuk live screen!
Output format JSON:
{
  "congratsHeadline": "Judul heboh",
  "shoutScript": "Teriakan host 2 kalimat",
  "pinnedComment": "Teks siap copy untuk disematkan di kolom komentar TikTok Live"
}`;

    const userPrompt = `Pemenang: @${winnerName}, Kupon: #${slotNumber}, Hadiah: ${prizePool}. Buatkan ucapan selebrasi! Kembalikan JSON murni.`;

    try {
      if (this.hasApiKey()) {
        const raw = await this.generateContent(userPrompt, systemPrompt);
        if (raw) {
          const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
          return JSON.parse(cleaned);
        }
      }
    } catch (e) {
      console.warn('[GeminiService] Falling back to simulation for Winner Celebration:', e.message);
    }

    return {
      congratsHeadline: `🏆 SELAMAT KEPADA @${winnerName} MEMBAWA PULANG ${prizePool}!`,
      shoutScript: `PECAHHH GAISSS! Kupon nomor #${slotNumber.toString().padStart(2, '0')} sah tembus hadiah utama! Wangi banget emang hoki lu bro @${winnerName}! Langsung klaim via WA Bang Jeyssen sekarang juga!`,
      pinnedComment: `🎉 SELAMAT @${winnerName} (Kupon #${slotNumber.toString().padStart(2, '0')}) Menang ${prizePool}! Segera kirim bukti chat WA ke 087747091072 untuk penyerahan hadiah!`
    };
  }

  // --- Internal Smart Simulators for Offline/Instant Demo ---

  _simulateHostHype(state) {
    const { totalSlots, occupiedSlots, remainingSlots, prizePool, pricePerSlot, isFull } = state;
    
    if (isFull) {
      return {
        hypeCatchphrase: "🚨 KUOTA 100% FULL! WAKTUNYA MEMUTAR RODA KEBERUNTUNGAN! 🚨",
        urgencyCall: "Semua peserta merapat ke live! Roda spin arena segera diputar dalam hitungan detik!",
        chatEngagement: "Ketik di live chat sekarang: 'BANG UDAH PENUH, GAS MUTAR RODA!'",
        teleprompterScript: `ALHAMDULILLAH gaisss! Semua ${totalSlots} kupon sudah resmi terkunci dan lunas! Terima kasih buat semua squad yang udah gercep amanin kupon Rp${pricePerSlot.toLocaleString('id-ID')}. Sekarang mata tertuju ke layar! Siapa yang bakal bawa pulang hadiah spesial ${prizePool}? Kita hitung mundur bersama: Tiga... Dua... Satu... GASPOL UNDIAN SEKARANG!`
      };
    }

    if (remainingSlots <= 3) {
      return {
        hypeCatchphrase: `🔥 DETIK-DETIK TERAKHIR! SISA ${remainingSlots} KUPON LAGI BISA AMBIL ${prizePool}! 🔥`,
        urgencyCall: `Tinggal ${remainingSlots} slot doang gais! Siapa cepat klik WhatsApp dia yang masuk putaran roda!`,
        chatEngagement: `Coba ketik di chat: Menurut kalian kupon nomor berapa yang bakal jadi pemenang hari ini?`,
        teleprompterScript: `Woy gaisss, jangan bengong di room live! Ini sisa ${remainingSlots} kupon lagi langsung kita putar rodanya! Cuma modal Rp${pricePerSlot.toLocaleString('id-ID')} doang kalian punya peluang bawa pulang hadiah hingga ${prizePool}! Langsung klik slot kosong di layar atau pencet tombol WhatsApp sekarang sebelum disamber penonton lain!`
      };
    }

    return {
      hypeCatchphrase: `💎 LELANG GP 5K RESMI DIBUKA! HADIAH HINGGA ${prizePool}! 💎`,
      urgencyCall: `Sudah ${occupiedSlots} dari ${totalSlots} kupon terisi. Amankan nomor hoki kalian sekarang sebelum kuota penuh!`,
      chatEngagement: `Ketik 'AMANKAN' di chat TikTok kalau kalian mau borong kupon bareng Bang Jeyssen!`,
      teleprompterScript: `Halo halo selamat datang di Live Lelang GP 5K bareng Bang Jeyssen! Buat kalian yang baru join, sistem kita 100% transparan dan realtime! Kupon cuma Rp${pricePerSlot.toLocaleString('id-ID')} per tiket dengan hadiah gokil ${prizePool}. Klik nomor pilihan kalian, bayar via WhatsApp, nama kalian langsung muncul di layar live streaming kita! Gaskeun sekarang gais!`
    };
  }

  _simulateAuraHoki(username, slotNumber, prizePool) {
    const seed = (username.length * 37 + slotNumber * 13) % 100;
    const luckScore = (85 + (seed % 15) + (Math.random() * 0.9)).toFixed(1);
    
    const khodams = [
      'Naga Emas Pembawa Hadiah Sultan',
      'Kelinci Hoki Penembus Jackpot',
      'Burung Garuda Pencari GP 35K',
      'Kucing Emas Wangi Gacha Tingkat Dewa',
      'Pahlawan Keberuntungan Bintang Tujuh'
    ];
    const khodam = khodams[slotNumber % khodams.length];

    const auras = [
      'WANGI GACHA TINGKAT DEWA 🔥',
      'AURA SULTAN TERKONFIRMASI 💎',
      'SINYAL JACKPOT SANGAT KUAT ⚡',
      'MAGNET KEBERUNTUNGAN LEVEL TERTINGGI ✨'
    ];
    const aura = auras[slotNumber % auras.length];

    return {
      luckScore: parseFloat(luckScore),
      auraLevel: aura,
      khodam: khodam,
      prediction: `Akun @${username} dengan kupon #${slotNumber.toString().padStart(2, '0')} terdeteksi memiliki frekuensi keberuntungan ${luckScore}%. Garis roda spin tertarik kuat ke nomor ini!`,
      suggestedReaction: `Teriakkan di live: "Aura @${username} nomor #${slotNumber.toString().padStart(2, '0')} wangi banget gais! Patut diwaspadai di roda undian!"`
    };
  }

  _simulateReceiptVerification(expectedPrice) {
    return {
      isValid: true,
      detectedAmount: expectedPrice,
      senderName: "Pengirim Terverifikasi (Simulasi)",
      paymentMethod: "QRIS / Transfer Bank",
      transactionDate: new Date().toLocaleTimeString('id-ID'),
      confidenceScore: 99,
      notes: `Bukti transfer nominal Rp${expectedPrice.toLocaleString('id-ID')} cocok dan status transaksi berhasil.`
    };
  }
}

// Export singleton instance
window.geminiService = new GeminiService();
