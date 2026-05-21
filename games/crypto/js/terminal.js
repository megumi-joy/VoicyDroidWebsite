const Term = {
    el: document.getElementById('terminal'),
    
    log(message, cssClass = '') {
        const line = document.createElement('div');
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        line.innerHTML = `<span style="color:var(--text-muted)">[${timestamp}]</span> ${message}`;
        if (cssClass) line.classList.add(cssClass);
        this.el.appendChild(line);
        this.el.scrollTop = this.el.scrollHeight;
    },
    
    clear() {
        this.el.innerHTML = '';
    }
};
