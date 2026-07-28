const fs = require('fs');
const path = require('path');
const settingFile = path.join(__dirname, '../setting.json');

module.exports = {
    command: ['autoreadsw', 'readsw'],
    ownerOnly: true, // Hanya bisa diakses oleh owner
    operate: async ({ sock, m, args, sender }) => {
        let settings = { autoTyping: false, autoReadSw: false };
        if (fs.existsSync(settingFile)) {
            try {
                settings = JSON.parse(fs.readFileSync(settingFile));
            } catch (e) {}
        }

        const action = args[0]?.toLowerCase();

        if (action === 'on') {
            settings.autoReadSw = true;
        } else if (action === 'off') {
            settings.autoReadSw = false;
        } else {
            return await sock.sendMessage(sender, { 
                text: `Status Auto Read SW saat ini: *${settings.autoReadSw ? 'ON' : 'OFF'}*\n\nCara mengubah:\n- Ketik *.autoreadsw on*\n- Ketik *.autoreadsw off*` 
            }, { quoted: m });
        }

        fs.writeFileSync(settingFile, JSON.stringify(settings, null, 2));

        await sock.sendMessage(sender, { 
            text: `✅ Berhasil mengubah Auto Read SW menjadi: *${action.toUpperCase()}*` 
        }, { quoted: m });
    }
};