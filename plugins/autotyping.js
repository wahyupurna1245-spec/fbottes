const fs = require('fs');
const path = require('path');
const settingFile = path.join(__dirname, '../setting.json');

module.exports = {
    command: ['autotyping', 'typing'],
    ownerOnly: true, // Hanya bisa diakses oleh owner
    operate: async ({ sock, m, args, sender }) => {
        let settings = { autoTyping: false };
        if (fs.existsSync(settingFile)) {
            try {
                settings = JSON.parse(fs.readFileSync(settingFile));
            } catch (e) {}
        }

        const action = args[0]?.toLowerCase();

        if (action === 'on') {
            settings.autoTyping = true;
        } else if (action === 'off') {
            settings.autoTyping = false;
        } else {
            return await sock.sendMessage(sender, { 
                text: `Status Auto Typing saat ini: *${settings.autoTyping ? 'ON' : 'OFF'}*\n\nCara mengubah:\n- Ketik *.autotyping on*\n- Ketik *.autotyping off*` 
            }, { quoted: m });
        }

        fs.writeFileSync(settingFile, JSON.stringify(settings, null, 2));

        await sock.sendMessage(sender, { 
            text: `✅ Berhasil mengubah Auto Typing menjadi: *${action.toUpperCase()}*` 
        }, { quoted: m });
    }
};