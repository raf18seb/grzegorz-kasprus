/* Editorial — minimal interactivity: scroll reveal + smooth anchors */
(function () {
    'use strict';

    const targets = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
        targets.forEach((el) => io.observe(el));
    } else {
        targets.forEach((el) => el.classList.add('in'));
    }

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id.length > 1) {
                const el = document.querySelector(id);
                if (el) {
                    e.preventDefault();
                    window.scrollTo({
                        top: el.getBoundingClientRect().top + window.pageYOffset - 30,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
})();
