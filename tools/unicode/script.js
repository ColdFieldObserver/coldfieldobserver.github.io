function encodeUnicode() {
    const input = document.getElementById('inputText').value;
    if (!input.trim()) {
        showResult('请输入要编码的文本', 'error');
        return;
    }
    
    try {
        let result = '';
        for (let i = 0; i < input.length; i++) {
            const charCode = input.charCodeAt(i);
            if (charCode <= 0xFFFF) {
                // 基本多文种平面字符
                result += '\\u' + charCode.toString(16).toUpperCase().padStart(4, '0');
            } else {
                // 辅助平面字符（UTF-16代理对）
                const highSurrogate = Math.floor((charCode - 0x10000) / 0x400) + 0xD800;
                const lowSurrogate = ((charCode - 0x10000) % 0x400) + 0xDC00;
                result += '\\u' + highSurrogate.toString(16).toUpperCase().padStart(4, '0') + 
                          '\\u' + lowSurrogate.toString(16).toUpperCase().padStart(4, '0');
            }
        }
        showResult(result, 'success');
    } catch (error) {
        showResult('编码失败：输入包含无效字符', 'error');
    }
}

function decodeUnicode() {
    const input = document.getElementById('inputText').value;
    if (!input.trim()) {
        showResult('请输入要解码的Unicode文本', 'error');
        return;
    }
    
    try {
        // 匹配 \uXXXX 格式的Unicode转义序列
        const unicodeRegex = /\\u([0-9a-fA-F]{4})/g;
        let result = input.replace(unicodeRegex, function(match, hex) {
            return String.fromCharCode(parseInt(hex, 16));
        });
        
        // 检查是否还有剩余的转义序列（说明输入格式不正确）
        if (result.includes('\\u')) {
            throw new Error('无效的Unicode格式');
        }
        
        showResult(result, 'success');
    } catch (error) {
        showResult('解码失败：请输入有效的Unicode编码格式（如\\u4F60\\u597D）', 'error');
    }
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
    document.getElementById('inputText').value = '';
    document.getElementById('resultBox').textContent = '结果将显示在这里...';
    document.getElementById('resultBox').classList.remove('error-result', 'success-result');
    document.getElementById('copyBtn').textContent = '复制结果';
}

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch(event.key) {
            case 'Enter':
                event.preventDefault();
                encodeUnicode();
                break;
            case 'd':
                event.preventDefault();
                decodeUnicode();
                break;
            case 'c':
                if (document.activeElement.id !== 'inputText') {
                    event.preventDefault();
                    copyResult();
                }
                break;
        }
    }
});