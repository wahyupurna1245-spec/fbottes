module.exports = {
    command: ['tiktok', 'tt', 'tiktokdl'],
    operate: async ({ sock, m, args, sender }) => {
        try {
            const url = args[0];
            if (!url || !url.includes('tiktok.com')) {
                return await sock.sendMessage(sender, { 
                    text: '⚠️ Masukkan link TikTok yang valid!\n\nContoh: *.tiktok https://vt.tiktok.com/xxxxxx*' 
                }, { quoted: m });
            }

            let loadingMsg = await sock.sendMessage(sender, { text: '⏳ Sedang mengunduh video...' }, { quoted: m });

            const fetch = (await import('node-fetch')).default;
            const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
            const res = await response.json();

            if (!res.data || !res.data.play) {
                return await sock.sendMessage(sender, { 
                    text: '❌ Gagal mengambil video TikTok. Pastikan link benar!',
                    edit: loadingMsg.key 
                });
            }

            const videoUrl = res.data.play;
            const title = res.data.title || 'TikTok Video';

            // Ambil video sebagai buffer terlebih dahulu untuk menghindari gagal upload langsung dari URL
            const bufferRes = await fetch(videoUrl);
            const videoBuffer = await bufferRes.buffer();

            // Kirim video menggunakan buffer lokal
            await sock.sendMessage(sender, { 
                video: videoBuffer, 
                caption: `✅ *TikTok Downloader*\n\n📝 *Judul:* ${title}` 
            }, { quoted: m });

            // Hapus pesan loading
            await sock.sendMessage(sender, { delete: loadingMsg.key });

        } catch (e) {
            console.error(e);
            await sock.sendMessage(sender, { text: 'Terjadi kesalahan sistem saat mengunduh video.' }, { quoted: m });
        }
    }
};