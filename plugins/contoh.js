module.exports = {
    command: ['contoh', 'c'], // Perintah yang memicu plugin ini
    ownerOnly: false,          // True jika hanya bisa dipakai owner
    operate: async ({ sock, m, sender, prefix, command }) => {
        // Tulis logika atau balasan bot di sini
        const teksBalasan = `Halo! Bot WhatsApp kamu aktif menggunakan sistem plugin.`;
        await sock.sendMessage(sender, { text: teksBalasan }, { quoted: m });
    }
};
