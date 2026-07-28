const fs = require('fs');
const path = require('path');
const modeFile = path.join(__dirname, '../mode.json');

module.exports = {
    command: ['self', 'public', 'grouponly', 'privateonly', 'mode'],
    ownerOnly: true, // Hanya bisa diubah oleh owner
    operate: async ({ sock, m, command, sender }) => {
        let settings = { isSelf: false, groupOnly: false, privateOnly: false };
        if (fs.existsSync(modeFile)) {
            try {
                settings = JSON.parse(fs.readFileSync(modeFile));
            } catch (e) {}
        }

        // Jika ketik .mode untuk cek status
        if (command === 'mode') {
            let activeMode = 'PUBLIC (Bebas)';
            if (settings.isSelf) activeMode = 'SELF (Khusus Owner)';
            else if (settings.groupOnly) activeMode = 'GROUP ONLY (Khusus Grup)';
            else if (settings.privateOnly) activeMode = 'PRIVATE ONLY (Khusus Chat Pribadi)';

            return await sock.sendMessage(sender, { 
                text: `╭──〔 *BOT STATUS SETTING* 〕──⬣\n` +
                      `│ Status Saat Ini: *${activeMode}*\n` +
                      `│\n` +
                      `│ *Daftar Perintah Mode:*\n` +
                      `│ • .public (Semua bisa akses di mana saja)\n` +
                      `│ • .self (Hanya owner)\n` +
                      `│ • .grouponly (Hanya di dalam grup)\n` +
                      `│ • .privateonly (Hanya di chat pribadi)\n` +
                      `╰──────────────────────⬣` 
            }, { quoted: m });
        }

        // Atur status berdasarkan perintah yang diketik
        if (command === 'self') {
            settings.isSelf = true;
            settings.groupOnly = false;
            settings.privateOnly = false;
        } else if (command === 'public') {
            settings.isSelf = false;
            settings.groupOnly = false;
            settings.privateOnly = false;
        } else if (command === 'grouponly') {
            settings.isSelf = false;
            settings.groupOnly = true;
            settings.privateOnly = false;
        } else if (command === 'privateonly') {
            settings.isSelf = false;
            settings.groupOnly = false;
            settings.privateOnly = true;
        }

        // Simpan ke mode.json
        fs.writeFileSync(modeFile, JSON.stringify(settings, null, 2));

        await sock.sendMessage(sender, { 
            text: `✅ Berhasil mengubah mode bot menjadi: *${command.toUpperCase()}*` 
        }, { quoted: m });
    }
};