const fs = require('fs');
const path = require('path');
const settingFile = path.join(__dirname, '../setting.json');

module.exports = {
    command: ['autoreadgrup', 'autoreadprivate', 'autoreadchat'],
    ownerOnly: true, // Hanya bisa diakses oleh owner
    operate: async ({ sock, m, command, args, sender }) => {
        let settings = { autoTyping: false, autoReadSw: false, autoReadGroup: false, autoReadPrivate: false };
        if (fs.existsSync(settingFile)) {
            try {
                settings = JSON.parse(fs.readFileSync(settingFile));
            } catch (e) {}
        }

        const action = args[0]?.toLowerCase();
        let targetType = '';

        if (command === 'autoreadgrup') targetType = 'autoReadGroup';
        else if (command === 'autoreadprivate') targetType = 'autoReadPrivate';

        // Jika ketik .autoreadchat (untuk cek status keduanya)
        if (command === 'autoreadchat' || !targetType) {
            return await sock.sendMessage(sender, { 
                text: `╭──〔 *STATUS AUTO READ* 〕──⬣\n` +
                      `│ • Auto Read Grup: *${settings.autoReadGroup ? 'ON' : 'OFF'}*\n` +
                      `│ • Auto Read Pribadi: *${settings.autoReadPrivate ? 'ON' : 'OFF'}*\n` +
                      `│\n` +
                      `│ *Cara Mengubah:*\n` +
                      `│ • .autoreadgrup on / off\n` +
                      `│ • .autoreadprivate on / off\n` +
                      `╰────────────────────────⬣` 
            }, { quoted: m });
        }

        if (action === 'on') {
            settings[targetType] = true;
        } else if (action === 'off') {
            settings[targetType] = false;
        } else {
            const currentStatus = settings[targetType] ? 'ON' : 'OFF';
            return await sock.sendMessage(sender, { 
                text: `Status *${command.toUpperCase()}* saat ini: *${currentStatus}*\n\nGunakan perintah:\n- *.${command} on*\n- *.${command} off*` 
            }, { quoted: m });
        }

        fs.writeFileSync(settingFile, JSON.stringify(settings, null, 2));

        const labelName = targetType === 'autoReadGroup' ? 'Auto Read Grup' : 'Auto Read Pribadi';
        await sock.sendMessage(sender, { 
            text: `✅ Berhasil mengubah ${labelName} menjadi: *${action.toUpperCase()}*` 
        }, { quoted: m });
    }
};