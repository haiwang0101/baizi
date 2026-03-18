// api/collect.js
export default async function handler(req, res) {
    const { id, ua, screen, chat } = req.query;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const BOT_TOKEN = "你的机器人TOKEN"; // 填入你的机器人Token
    const REPORT_CHAT = "-1003659768706"; // 1280报告群ID

    // 1. 发送情报到报告群 (Topic 5)
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: REPORT_CHAT,
            message_thread_id: 5,
            text: `🚨 #抓获指纹\n👤 ID: \`${id}\`\n🌐 IP: \`${ip}\`\n📱 设备: \`${ua}\`\n📍 来源: ${chat}`,
            parse_mode: 'Markdown'
        })
    });

    // 2. 【核心】让机器人去大群解禁并欢迎 (这里我们发个指令给机器人)
    // 技巧：我们直接通过Bot API给大群发一个隐藏的指令，或者调用你的解禁逻辑
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chat,
            text: `/active_user ${id}` // 这是一个触发暗号
        })
    });

    res.status(200).send("ok");
}
