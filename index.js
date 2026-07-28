const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false,
        syncFullHistory: true,
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'open') {
            console.log('\x1b[32mBot berhasil terhubung ke WhatsApp!\x1b[0m');
        } else if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode;
            console.log(`Koneksi terputus karena ${reason}, mencoba menghubungkan ulang...`);
            if (reason !== DisconnectReason.loggedOut) {
                startBot();
            } else {
                console.log('Perangkat telah keluar dari sesi, hapus folder session untuk pairing ulang.');
                fs.rmSync('./session', { recursive: true, force: true });
            }
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Cek dan minta pairing code otomatis setelah socket siap
    if (!sock.authState.creds.registered) {
        // Beri jeda 3 detik agar koneksi WebSocket siap terlebih dahulu
        setTimeout(async () => {
            const phoneNumber = '628812478704';
            console.log(`Meminta kode pairing untuk nomor: ${phoneNumber}...`);
            try {
                let code = await sock.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join('-') || code;
                console.log(`Kode Pairing WhatsApp kamu: \x1b[32m${code}\x1b[0m`);
            } catch (err) {
                console.error('Gagal mengambil kode pairing:', err);
            }
        }, 3000);
    }

    // Handler Pesan Masuk & Status Masuk
    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek) return;
            
            require('./handler')(sock, mek, chatUpdate);
        } catch (err) {
            console.error('Error di messages.upsert:', err);
        }
    });
}

startBot();
