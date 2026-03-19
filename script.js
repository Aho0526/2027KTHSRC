document.addEventListener('DOMContentLoaded', () => {
    // ローディング画面の非表示
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
    }, 2500);

    // ヒーロー動画の切り替え（6秒ごと）
    const heroVideos = document.querySelectorAll('.hero-video');
    let currentVideoIndex = 0;
    
    if (heroVideos.length > 1) {
        setInterval(() => {
            heroVideos[currentVideoIndex].classList.remove('active');
            // 次の動画を再生してから表示させる
            currentVideoIndex = (currentVideoIndex + 1) % heroVideos.length;
            const nextVideo = heroVideos[currentVideoIndex];
            nextVideo.currentTime = 0;
            nextVideo.play();
            nextVideo.classList.add('active');
        }, 6000); // 6秒
    }

    // ヘッダーのスクロールエフェクト
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // スクロールアニメーション (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // アニメーション対象の要素を取得
    const animateElements = document.querySelectorAll('.about-text, .about-image, .gallery-container, .rowing-item, .schedule-item, .manager-content, .boat-type-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // ギャラリースライダーのロジック
    const initGallerySlider = () => {
        const slider = document.querySelector('.gallery-slider');
        const slides = document.querySelectorAll('.gallery-slide');
        const dotsContainer = document.querySelector('.gallery-nav');
        const prevBtn = document.querySelector('.gallery-btn.prev');
        const nextBtn = document.querySelector('.gallery-btn.next');

        if (!slider || slides.length === 0) return;

        let currentIndex = 0;
        let startX = 0;
        let isDragging = false;
        let autoPlayInterval;

        // ドットの生成
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('gallery-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.gallery-dot');

        const updateSlider = () => {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = (index + slides.length) % slides.length;
            updateSlider();
            resetAutoPlay();
        };

        const nextSlide = () => goToSlide(currentIndex + 1);
        const prevSlide = () => goToSlide(currentIndex - 1);

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // タッチ / スワイプ対応
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            clearInterval(autoPlayInterval);
        }, { passive: true });

        slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            
            // X方向への移動が大きい場合のみスワイプと判定し、デフォルトスクロールを防止
            if (Math.abs(diff) > 10 && e.cancelable) {
                e.preventDefault();
            }

            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
                isDragging = false;
            }
        }, { passive: false });

        slider.addEventListener('touchend', () => {
            isDragging = false;
            resetAutoPlay();
        });

        // オートプレイ (4秒)
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(nextSlide, 4000);
        };

        const resetAutoPlay = () => {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        };

        startAutoPlay();
    };

    initGallerySlider();

    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
