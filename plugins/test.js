const os = require('os');
const { performance } = require('perf_hooks');

function formatSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
}

function runtime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + "d " : "";
    var hDisplay = h > 0 ? h + "h " : "";
    var mDisplay = m > 0 ? m + "m " : "";
    var sDisplay = s > 0 ? s + "s" : "";
    return (dDisplay + hDisplay + mDisplay + sDisplay).trim() || "0s";
}

module.exports = {
    command: ['ping', 'p', 'test', 'speed', 'bot'],
    operate: async ({ sock, m, sender }) => {
        const start = performance.now();
        
        // Kirim pesan awal dengan gaya modern
        let initialMsg = await sock.sendMessage(sender, { text: '🚀 *Mengukur kecepatan & performa sistem...* [■□□□□] 25%' }, { quoted: m });
        
        const end = performance.now();
        const latency = (end - start).toFixed(2);

        // Informasi Sistem (RAM, CPU, & Uptime)
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const cpuCore = os.cpus().length;
        const cpuModel = os.cpus()[0]?.model?.trim() || 'Generic CPU';
        const uptime = runtime(process.uptime());
        const platform = os.platform();

        const caption = `INFO

🏓 *Response Speed:* ${latency} ms
⏱️ *Bot Uptime:* ${uptime}
💻 *Platform:* ${platform.toUpperCase()} (${cpuCore} Core)
🧠 *CPU Model:* ${cpuModel}
📊 *RAM Usage:* ${formatSize(usedMem)} / ${formatSize(totalMem)} (${((usedMem / totalMem) * 100).toFixed(1)}%)
💽 *Free RAM:* ${formatSize(freeMem)}


*Status:* 🟢 Online & Stable`;

        // Update pesan awal dengan hasil akhir yang keren
        await sock.sendMessage(sender, { 
            text: caption, 
            edit: initialMsg.key 
        });
    }
};
