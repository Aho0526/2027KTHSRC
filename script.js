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

    // ギャラリースライダーのロジック (無限ループ対応)
    const initGallerySlider = () => {
        const slider = document.querySelector('.gallery-slider');
        const slides = document.querySelectorAll('.gallery-slide');
        const dotsContainer = document.querySelector('.gallery-nav');
        const prevBtn = document.querySelector('.gallery-btn.prev');
        const nextBtn = document.querySelector('.gallery-btn.next');

        if (!slider || slides.length === 0) return;

        // ドットの生成
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('gallery-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i + 1));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.gallery-dot');

        // 無限ループのためのクローン作成
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);

        slider.appendChild(firstClone);
        slider.prepend(lastClone);

        const allSlides = document.querySelectorAll('.gallery-slide');
        let currentIndex = 1; // クローンした最後の画像が最初に来るので、インデックス1(本物の1枚目)から開始
        let isMoving = false;
        let autoPlayInterval;

        // 初期位置の設定
        slider.style.transition = 'none';
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;

        const updateSlider = (withTransition = true) => {
            if (withTransition) {
                slider.style.transition = 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)';
            } else {
                slider.style.transition = 'none';
            }
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;

            // ドットの更新 (クローンを考慮した論理的なインデックス)
            let dotIndex = currentIndex - 1;
            if (currentIndex === 0) dotIndex = slides.length - 1;
            if (currentIndex === allSlides.length - 1) dotIndex = 0;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === dotIndex);
            });
        };

        const goToSlide = (index) => {
            if (isMoving) return;
            currentIndex = index;
            updateSlider();
            resetAutoPlay();
        };

        const nextSlide = () => {
            if (isMoving) return;
            currentIndex++;
            updateSlider();
            resetAutoPlay();
        };

        const prevSlide = () => {
            if (isMoving) return;
            currentIndex--;
            updateSlider();
            resetAutoPlay();
        };

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // トランジション終了時のループ処理
        slider.addEventListener('transitionend', () => {
            isMoving = false;
            // 最後(クローン1枚目)に到達したら、本物の1枚目にワープ
            if (allSlides[currentIndex] === firstClone) {
                currentIndex = 1;
                updateSlider(false);
            }
            // 最初(クローン最後)に到達したら、本物の最後にワープ
            if (allSlides[currentIndex] === lastClone) {
                currentIndex = allSlides.length - 2;
                updateSlider(false);
            }
        });

        slider.addEventListener('transitionstart', () => {
            isMoving = true;
        });

        // タッチ / スワイプ対応
        let startX = 0;
        let isDragging = false;

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            clearInterval(autoPlayInterval);
        }, { passive: true });

        slider.addEventListener('touchmove', (e) => {
            if (!isDragging || isMoving) return;
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;

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

        // オートプレイ
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
