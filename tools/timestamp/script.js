function timestampToDatetime() {
    const timestampInput = document.getElementById('timestampInput').value.trim();
    if (!timestampInput) {
        showResult('请输入时间戳', 'error');
        return;
    }
    
    try {
        // 检查是否为数字
        if (!/^\d+$/.test(timestampInput)) {
            throw new Error('时间戳必须为数字');
        }
        
        let timestamp = parseInt(timestampInput);
        
        // 自动识别秒级或毫秒级时间戳
        if (timestampInput.length <= 10) {
            // 秒级时间戳，转换为毫秒
            timestamp *= 1000;
        }
        
        const date = new Date(timestamp);
        
        // 检查日期是否有效
        if (isNaN(date.getTime())) {
            throw new Error('无效的时间戳');
        }
        
        // 格式化日期时间
        const localTime = date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        const utcTime = date.toUTCString();
        
        // 更新日期时间输入框
        const isoString = date.toISOString().slice(0, 16);
        document.getElementById('datetimeInput').value = isoString;
        
        const result = `本地时间：${localTime}\nUTC时间：${utcTime}\n时间戳类型：${timestampInput.length <= 10 ? '秒级' : '毫秒级'}`;
        showResult(result, 'success');
        
    } catch (error) {
        showResult(`转换失败：${error.message}`, 'error');
    }
}

function datetimeToTimestamp() {
    const datetimeInput = document.getElementById('datetimeInput').value;
    if (!datetimeInput) {
        showResult('请选择日期时间', 'error');
        return;
    }
    
    try {
        const date = new Date(datetimeInput);
        
        // 检查日期是否有效
        if (isNaN(date.getTime())) {
            throw new Error('无效的日期时间');
        }
        
        // 获取秒级和毫秒级时间戳
        const timestampSeconds = Math.floor(date.getTime() / 1000);
        const timestampMilliseconds = date.getTime();
        
        // 更新时间戳输入框（默认显示秒级）
        document.getElementById('timestampInput').value = timestampSeconds;
        
        const result = `秒级时间戳：${timestampSeconds}\n毫秒级时间戳：${timestampMilliseconds}\n本地时间：${date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        })}`;
        
        showResult(result, 'success');
        
    } catch (error) {
        showResult(`转换失败：${error.message}`, 'error');
    }
}

function getCurrentTimestamp() {
    const now = new Date();
    const timestampSeconds = Math.floor(now.getTime() / 1000);
    const timestampMilliseconds = now.getTime();
    
    // 更新输入框（默认显示秒级）
    document.getElementById('timestampInput').value = timestampSeconds;
    
    const isoString = now.toISOString().slice(0, 16);
    document.getElementById('datetimeInput').value = isoString;
    
    const localTime = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const result = `当前时间戳（毫秒）：${timestampMilliseconds}\n当前时间戳（秒）：${timestampSeconds}\n当前本地时间：${localTime}`;
    showResult(result, 'success');
}

function showResult(text, type) {
    const resultBox = document.getElementById('resultBox');
    resultBox.textContent = text;
    
    if (type === 'error') {
        resultBox.classList.add('error-result');
        resultBox.classList.remove('success-result');
    } else {
        resultBox.classList.add('success-result');
        resultBox.classList.remove('error-result');
    }
}

function copyResult() {
    const resultText = document.getElementById('resultBox').textContent;
    if (resultText === '结果将显示在这里...' || resultText.includes('失败')) {
        return;
    }
    
    navigator.clipboard.writeText(resultText).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '已复制！';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }).catch(() => {
        showResult('复制失败，请手动复制', 'error');
    });
}

function clearAll() {
    document.getElementById('timestampInput').value = '';
    document.getElementById('datetimeInput').value = '';
    document.getElementById('resultBox').textContent = '结果将显示在这里...';
    document.getElementById('resultBox').classList.remove('error-result', 'success-result');
    document.getElementById('copyBtn').textContent = '复制结果';
}

// 输入框事件监听
document.getElementById('timestampInput').addEventListener('input', function() {
    if (this.value.trim()) {
        timestampToDatetime();
    }
});

document.getElementById('datetimeInput').addEventListener('change', function() {
    if (this.value) {
        datetimeToTimestamp();
    }
});

// 快捷键支持
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch(event.key) {
            case 'Enter':
                event.preventDefault();
                timestampToDatetime();
                break;
            case 'd':
                event.preventDefault();
                datetimeToTimestamp();
                break;
            case 'n':
                event.preventDefault();
                getCurrentTimestamp();
                break;
            case 'c':
                if (document.activeElement.id !== 'timestampInput' && document.activeElement.id !== 'datetimeInput') {
                    event.preventDefault();
                    copyResult();
                }
                break;
        }
    }
});

// 页面加载时显示当前时间
window.addEventListener('load', function() {
    getCurrentTimestamp();
});