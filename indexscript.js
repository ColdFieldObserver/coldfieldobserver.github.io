(function() {
    // 仅仅为了维持整洁的Fluent动态感，不做强制交互，保留复古静默风格
    console.log("冷域观者 · 个人站点已装载 | 云母材质 + 复古排版");
    // 可选：为导航加平滑滚动 (无锚点跳转，但如果有#可以使用)
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if(this.getAttribute('href') === '#') {
                e.preventDefault();
                // 只是演示占位，保持静默
            }
        });
    });
})();