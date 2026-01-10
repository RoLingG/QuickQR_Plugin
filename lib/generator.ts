import QRCode from 'qrcode'

export interface QRConfig {
    text: string
    fgColor: string
    bgColor: string
    logoUrl?: string
}

export const generateQRToCanvas = async (canvas: HTMLCanvasElement, config: QRConfig) => {
    try {
        // 1. 生成基础二维码
        await QRCode.toCanvas(canvas, config.text, {
            width: 200,
            margin: 2,
            color: {
                dark: config.fgColor,
                light: config.bgColor
            },
            errorCorrectionLevel: 'H'
        })
        if (config.logoUrl) {
            const ctx = canvas.getContext('2d')
            if (!ctx) return
            const img = new Image()
            // 关键修改：为了防止图片加载极快导致 onload 没触发，
            // 必须先定义 Promise 和 onload，再赋值 src
            await new Promise((resolve, reject) => {
                img.onload = resolve
                img.onerror = reject
                img.crossOrigin = 'anonymous'
                img.src = config.logoUrl!
            })
            // 计算 Logo 大小和位置 (占二维码 25% 左右比较合适)
            const logoSize = canvas.width * 0.25
            const x = (canvas.width - logoSize) / 2
            const y = (canvas.height - logoSize) / 2
            // 绘制背景框 (使用 bgColor)
            ctx.fillStyle = config.bgColor
            // 边框稍微大一点点 (padding)
            const border = 3
            ctx.fillRect(x - border, y - border, logoSize + border * 2, logoSize + border * 2)
            ctx.drawImage(img, x, y, logoSize, logoSize)
        }
    } catch (err) {
        console.error(err)
    }
}
