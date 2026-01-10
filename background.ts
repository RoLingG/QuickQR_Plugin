export {}

// 1. 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
    // 每次重载插件时先清空，防止 ID 冲突报错
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: "scan-qr",
            title: "QuickQR: 解析此二维码",
            contexts: ["image"]
        });
        chrome.contextMenus.create({
            id: "transform-qr",
            title: "QuickQR: 为选中内容生成二维码",
            contexts: ["selection", "page", "link"]
        });
    });
})

// 2. 处理点击事件
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab?.windowId) {
        console.error("No windowId found.");
        return;
    }
    // --- 场景 A: 识别图片二维码 ---
    if (info.menuItemId === "scan-qr" && info.srcUrl) {
        try {
            await chrome.sidePanel.open({ windowId: tab.windowId });
            setTimeout(() => {
                chrome.runtime.sendMessage({
                    type: "QR_SCAN_REQUEST",
                    srcUrl: info.srcUrl
                });
            }, 500);
        } catch (error) {
            console.error("Failed to open side panel (scan):", error);
        }
    }
    // --- 场景 B: 选中文字/链接 生成二维码 ---
    else if (info.menuItemId === "transform-qr") {
        const textToConvert = info.selectionText || info.linkUrl || info.pageUrl || tab.url;
        if (textToConvert) {
            try {
                // 尝试打开侧边栏
                await chrome.sidePanel.open({ windowId: tab.windowId });
                // 侧边栏打开后发送消息
                setTimeout(() => {
                    console.log("Sending QR_GENERATE_REQUEST...");
                    chrome.runtime.sendMessage({
                        type: "QR_GENERATE_REQUEST",
                        text: textToConvert
                    });
                }, 500);
            } catch (error) {
                console.error("Failed to open side panel (transform):", error);
            }
        }
    }
})
