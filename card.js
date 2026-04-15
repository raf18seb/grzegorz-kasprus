/* Wizytówka — tab switching */
(function () {
    'use strict';

    const tabs = document.querySelectorAll('.card__tab');
    const panels = document.querySelectorAll('.card__panel');

    function activate(tabKey) {
        tabs.forEach((t) => {
            const active = t.dataset.tab === tabKey;
            t.classList.toggle('active', active);
            t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        panels.forEach((p) => {
            p.classList.toggle('active', p.dataset.panel === tabKey);
        });
    }

    tabs.forEach((t) => {
        t.addEventListener('click', () => activate(t.dataset.tab));
    });

    // Keyboard navigation across tabs
    const tabList = Array.from(tabs);
    tabList.forEach((t, i) => {
        t.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const dir = e.key === 'ArrowRight' ? 1 : -1;
                const next = tabList[(i + dir + tabList.length) % tabList.length];
                next.focus();
                activate(next.dataset.tab);
            }
        });
    });
})();
