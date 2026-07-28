const fs = require('fs');
const path = require('path');

module.exports = {
    command: ['all'],
    operate: async ({ sock, m, sender, pushName }) => {
        try {
            const pluginsDir = __dirname;
            const files = fs.readdirSync(pluginsDir);
            
            let allCmds = [];

            files.forEach(file => {
                if (file.endsWith('.js')) {
                    try {
                        const plugin = require(path.join(pluginsDir, file));
                        if (plugin.command) {
                            if (Array.isArray(plugin.command)) {
                                allCmds.push(...plugin.command);
                            } else {
                                allCmds.push(plugin.command);
                            }
                        }
                    } catch (e) {}
                }
            });

            // Urutkan dan buang duplikat command
            const uniqueCmds = [...new Set(allCmds)].sort();

            // Mengambil nama pengirim (fallback ke 'Kak' jika tidak terdeteksi)
            const targetName = pushName || m.pushName || 'Pengguna';

            let menuText = `╭──〔 *DAFTAR PERINTAH BOT* 〕──⬣\n`;
            menuText += `│ Halo *${targetName}*! Berikut adalah\n`;
            menuText += `│ semua perintah yang tersedia:\n`;
            menuText += `├────────────────────────⬣\n`;

            uniqueCmds.forEach((cmd) => {
                menuText += `│ • .${cmd}\n`;
            });

            menuText += `╰────────────────────────⬣\n`;
            menuText += `_Total: ${uniqueCmds.length} Perintah Aktif_`;

            await sock.sendMessage(sender, { text: menuText }, { quoted: m });

        } catch (e) {
            console.error(e);
            await sock.sendMessage(sender, { text: 'Gagal memuat daftar perintah.' }, { quoted: m });
        }
    }
};