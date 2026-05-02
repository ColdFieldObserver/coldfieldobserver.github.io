function encodeURL() {
    const input = document.getElementById('inputText').value;
    if (!input.trim()) {
        showResult('请输入要编码的URL文本', 'error');
        return;
    }
    
    try {
        const encoded = encodeURI(input);
        showResult(encoded, 'success');
    } catch (error) {
        showResult('编码失败：输入包含无效字符', 'error');
    }
}

function decodeURL() {
    const input = document.getElementById('inputText').value;
    if (!input.trim()) {
        showResult('请输入要解码的URL文本', 'error');
        return;
    }
    
    try {
        const decoded = decodeURI(input);
        showResult(decoded, 'success');
    } catch (error) {
        showResult('解码失败：请输入有效的URL编码', 'error');
    }
}

function encodeURLComponent() {
    const input = document.getElementById('inputText').value;
    if (!input.trim()) {
        showResult('请输入要编码的URL组件文本', 'error');
        return;
    }
    
    try {
        const encoded = encodeURIComponent(input);
        showResult(encoded, 'success');
    } catch (error) {
        showResult('编码失败：输入包含无效字符', 'error');
    }
}

function decodeURLComponent() {
    const input = document.getElementById('inputText').value;
    if (!input.trim()) {
        showResult('请输入要解码的URL组件文本', 'error');
        return;
    }
    
    try {
        const decoded = decodeURIComponent(input);
        showResult(decoded, 'success');
    } catch (error) {
        showResult('解码失败：请输入有效的URL组件编码', 'error');
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

// 快捷键支持
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch(event.key) {
            case 'Enter':
                event.preventDefault();
                encodeURL();
                break;
            case 'd':
                event.preventDefault();
                decodeURL();
                break;
            case 'e':
                event.preventDefault();
                encodeURLComponent();
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

// 示例说明
window.addEventListener('load', function() {
    const exampleText = '示例：https://example.com/测试页面?参数=值&name=张三';
    document.getElementById('inputText').placeholder = exampleText;
    
    // 添加示例按钮
    const exampleBtn = document.createElement('button');
    exampleBtn.textContent = '加载示例';
    exampleBtn.className = 'btn btn-secondary btn-sm';
    exampleBtn.style.marginLeft = '0.5rem';
    exampleBtn.onclick = function() {
        document.getElementById('inputText').value = exampleText;
    };
    
    const formGroup = document.querySelector('.form-group');
    formGroup.appendChild(exampleBtn);
});