document.addEventListener('DOMContentLoaded', function() {
    const menuLinks = document.querySelectorAll('.menu a');
    const categories = document.querySelectorAll('.category');
    const globalSearch = document.getElementById('globalSearch');
    const commandCards = document.querySelectorAll('.command-card');

    function showCategory(categoryId) {
        categories.forEach(cat => {
            cat.classList.remove('active');
        });
        
        menuLinks.forEach(link => {
            link.classList.remove('active');
        });

        const targetCategory = document.getElementById(categoryId);
        if (targetCategory) {
            targetCategory.classList.add('active');
            
            const activeLink = document.querySelector(`[data-category="${categoryId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryId = this.getAttribute('data-category');
            showCategory(categoryId);
            
            history.pushState(null, '', `#${categoryId}`);
        });
    });

    function performSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (term === '') {
            commandCards.forEach(card => {
                card.classList.remove('hide', 'highlight');
            });
            
            categories.forEach(cat => {
                cat.style.display = '';
            });
            return;
        }

        let hasResults = false;
        categories.forEach(category => {
            let categoryHasMatch = false;
            
            const cards = category.querySelectorAll('.command-card');
            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const code = card.querySelector('code').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(term) || code.includes(term) || description.includes(term)) {
                    card.classList.remove('hide');
                    card.classList.add('highlight');
                    categoryHasMatch = true;
                    hasResults = true;
                } else {
                    card.classList.add('hide');
                    card.classList.remove('highlight');
                }
            });
            
            if (categoryHasMatch) {
                category.style.display = 'block';
                category.classList.add('active');
            } else {
                category.style.display = 'none';
                category.classList.remove('active');
            }
        });

        if (hasResults) {
            menuLinks.forEach(link => link.classList.remove('active'));
        }
    }

    globalSearch.addEventListener('input', function() {
        performSearch(this.value);
    });

    globalSearch.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            performSearch('');
            const hash = window.location.hash.slice(1) || 'docker';
            showCategory(hash);
        }
    });

    commandCards.forEach(card => {
        card.addEventListener('click', function() {
            const code = this.querySelector('code').textContent;
            
            navigator.clipboard.writeText(code).then(() => {
                const originalBg = this.style.background;
                this.style.background = '#d4edda';
                
                const message = document.createElement('div');
                message.textContent = 'コピーしました！';
                message.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #28a745;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    font-size: 12px;
                    z-index: 1000;
                `;
                this.style.position = 'relative';
                this.appendChild(message);
                
                setTimeout(() => {
                    this.style.background = originalBg;
                    message.remove();
                }, 1500);
            }).catch(err => {
                console.error('コピーに失敗しました:', err);
            });
        });
    });

    const hash = window.location.hash.slice(1) || 'docker';
    showCategory(hash);

    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            showCategory(hash);
        }
    });

    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            globalSearch.focus();
        }
    });

    const tooltips = [
        { selector: '#globalSearch', text: 'Ctrl+K で検索' },
        { selector: '.command-card', text: 'クリックでコピー' }
    ];

    tooltips.forEach(tooltip => {
        const elements = document.querySelectorAll(tooltip.selector);
        elements.forEach(el => {
            el.setAttribute('title', tooltip.text);
        });
    });
});