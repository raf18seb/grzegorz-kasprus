/* ============================================
   Grzegorz Kasprus — interactivity
   ============================================ */

(function () {
    'use strict';

    /* ---------- Scroll reveal ---------- */
    const revealTargets = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
        revealTargets.forEach((el) => io.observe(el));
    } else {
        revealTargets.forEach((el) => el.classList.add('in'));
    }

    /* ---------- Signature draw on load ---------- */
    window.addEventListener('load', () => {
        const sig = document.querySelector('.hero__signature');
        if (sig) setTimeout(() => sig.classList.add('draw'), 500);
    });

    /* ---------- Piano (regenerate with proper layout) ---------- */
    const piano = document.querySelector('.piano__keys');
    if (piano) {
        piano.innerHTML = '';
        // 2 octaves = 14 white keys. Black key pattern per octave (between whites): after 0, 1, 3, 4, 5
        const whiteCount = 14;
        const blackPattern = [0, 1, 3, 4, 5]; // zero-indexed positions after which a black key sits, within an octave
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

        // Create white keys
        for (let i = 0; i < whiteCount; i++) {
            const w = document.createElement('div');
            w.className = 'key white';
            w.dataset.note = notes[i % 7] + (Math.floor(i / 7) + 4);
            piano.appendChild(w);
        }

        // Create black keys absolutely positioned
        for (let oct = 0; oct < 2; oct++) {
            blackPattern.forEach((pos) => {
                const whiteIndex = oct * 7 + pos;
                const b = document.createElement('div');
                b.className = 'key black';
                // Each white key is 100/whiteCount % wide; center the black on boundary
                const whiteWidth = 100 / whiteCount;
                b.style.left = ((whiteIndex + 1) * whiteWidth) + '%';
                piano.appendChild(b);
            });
        }

        // Simple tone synth on click
        let audioCtx = null;
        function playTone(freq) {
            try {
                if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.18, now + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
                osc.connect(gain).connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 1.3);
            } catch (e) { /* silent */ }
        }

        // Frequencies for white keys (C4..B5) and black keys following blackPattern
        const whiteFreqs = [
            261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88,
            523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77
        ];
        const blackFreqs = [
            277.18, 311.13, 369.99, 415.30, 466.16,
            554.37, 622.25, 739.99, 830.61, 932.33
        ];

        const whiteEls = piano.querySelectorAll('.key.white');
        const blackEls = piano.querySelectorAll('.key.black');

        whiteEls.forEach((el, i) => {
            el.addEventListener('click', () => {
                playTone(whiteFreqs[i]);
                el.classList.add('active');
                setTimeout(() => el.classList.remove('active'), 150);
            });
        });
        blackEls.forEach((el, i) => {
            el.addEventListener('click', (ev) => {
                ev.stopPropagation();
                playTone(blackFreqs[i]);
                el.classList.add('active');
                setTimeout(() => el.classList.remove('active'), 150);
            });
        });
    }

    /* ---------- Subtle parallax on hero portrait ---------- */
    const frame = document.querySelector('.hero__frame');
    if (frame && window.matchMedia('(hover: hover)').matches) {
        const hero = document.querySelector('.hero');
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            frame.style.transform = `rotate(${-1.5 + x * 1.5}deg) translate(${x * 6}px, ${y * 6}px)`;
        });
        hero.addEventListener('mouseleave', () => {
            frame.style.transform = '';
        });
    }

    /* ---------- Smooth anchor offset for fixed nav ---------- */
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id.length > 1) {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    const y = target.getBoundingClientRect().top + window.pageYOffset - 20;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }
        });
    });

})();
