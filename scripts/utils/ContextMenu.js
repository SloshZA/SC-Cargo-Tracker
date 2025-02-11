class ContextMenu {
    constructor() {
        this.menu = null;
    }

    show(items, x, y) {
        // Remove any existing menu
        this.hide();

        // Create menu container
        this.menu = document.createElement('div');
        this.menu.className = 'context-menu';
        
        // Add menu items
        items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'context-menu-item';
            menuItem.textContent = item.label;
            menuItem.onclick = () => {
                item.action();
                this.hide();
            };
            this.menu.appendChild(menuItem);
        });

        // Position menu
        this.menu.style.left = `${x}px`;
        this.menu.style.top = `${y}px`;
        
        // Add to document
        document.body.appendChild(this.menu);

        // Add click outside listener
        setTimeout(() => {
            document.addEventListener('click', this.hide.bind(this), { once: true });
        }, 0);
    }

    hide() {
        if (this.menu) {
            this.menu.remove();
            this.menu = null;
        }
    }
}

// Export single instance
export const contextMenu = new ContextMenu(); 