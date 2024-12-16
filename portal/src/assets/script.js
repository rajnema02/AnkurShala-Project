document.querySelectorAll('.accordion-toggle').forEach(button => {
    button.addEventListener('click', function () {
        const content = this.closest('.accordion-panel').querySelector('.accordion-panel-content');
        const expanded = this.getAttribute('aria-expanded') === 'true';
        
        // Toggle expanded state
        this.setAttribute('aria-expanded', !expanded);
        content.setAttribute('aria-hidden', expanded);
    });
    });