function encodeBase64() {
    const input = document.getElementById('inputText').value;
    if (!input.trim()) {
        showResult('请输入要编码的文本', 'error');
        return;
    }
    
    try {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        showResult(encoded, 'success');
    } catch (error) {
        showResult('编码失败：输入包含无效字符', 'error');
    }
}

function decodeBase64() {
    const input = document.getElementById('inputText').value;
    if (!input.trim()) {
        showResult('请输入要解码的Base64文本', 'error');
        return;
    }
    
    try {
        const decoded = decodeURIComponent(escape(atob(input)));
        showResult(decoded, 'success');
    } catch (error) {
        showResult('解码失败：请输入有效的Base64编码', 'error');
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
                encodeBase64();
                break;
            case 'd':
                event.preventDefault();
                decodeBase64();
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