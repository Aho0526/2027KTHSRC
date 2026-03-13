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
                // 一度表示されたら監視を解除する場合は以下を有効化
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // アニメーション対象の要素を取得
    const animateElements = document.querySelectorAll('.about-text, .about-image, .gallery-item, .rowing-item, .schedule-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });

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
