// script.js
// Countdown to Dec 28, 2025 11:00 PM
const weddingDate = new Date('2025-12-28T23:00:00');

function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (diff <= 0) {
        if (daysEl) daysEl.textContent = '0';
        if (hoursEl) hoursEl.textContent = '0';
        if (minutesEl) minutesEl.textContent = '0';
        if (secondsEl) secondsEl.textContent = '0';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;
}

// Calendar for October 2025
function renderCalendar() {
    const calendarDaysEl = document.getElementById('calendar-days');
    if (!calendarDaysEl) return;

    const daysInOct = 31;
    const firstDay = new Date(2025, 9, 1).getDay(); // 9 = October (0-based)
    const startOffset = (firstDay + 6) % 7; // Adjust for MON start (0=Sun, 1=Mon... 6=Sat)

    let html = '';
    let dayCount = 1;

    for (let i = 0; i < 6; i++) {
        let weekStarted = false;
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < startOffset) {
                html += '<div class="day empty"></div>';
            } else if (dayCount <= daysInOct) {
                weekStarted = true;
                const isWeddingDay = dayCount === 12;
                html += `<div class="day ${isWeddingDay ? 'today' : ''}">${dayCount}</div>`;
                dayCount++;
            } else {
                if (weekStarted) {
                    html += '<div class="day empty"></div>';
                }
            }
        }
        if (dayCount > daysInOct && i > 3) break;
    }
    calendarDaysEl.innerHTML = html;
}

// Snow Effect Animation
function createSnowEffect() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const snowflakes = [];

    function Snowflake() {
        this.x = Math.random() * canvas.width;
        this.y = -Math.random() * canvas.height;
        this.size = Math.random() * 5 + 3; // Tăng kích thước lên
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 3 + 1; // Tăng tốc độ rơi
        this.opacity = Math.random() * 0.8 + 0.5;
    }

    Snowflake.prototype.update = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }
        
        if (this.x > canvas.width) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = canvas.width;
        }
    };

    Snowflake.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239, 83, 80, ${this.opacity})`; // Màu đỏ
        ctx.fill();
    };

    function handleSnowflakes() {
        if (snowflakes.length < 150) { // Tăng số lượng tuyết
            snowflakes.push(new Snowflake());
        }

        for (let i = 0; i < snowflakes.length; i++) {
            snowflakes[i].update();
            snowflakes[i].draw();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleSnowflakes();
        requestAnimationFrame(animate);
    }

    animate();
}

// Parallax Logic
function setupParallax() {
    const mainPhotoWrapper = document.querySelector('.main-photo-wrapper');
    if (!mainPhotoWrapper) return;

    const photoSection = document.querySelector('.photo-overlay-section');
    // Lấy vị trí scroll bắt đầu của section ảnh
    const scrollOffset = photoSection ? photoSection.offsetTop : 0; 
    
    function handleParallax() {
        const scrollPosition = window.scrollY;
        
        // >>> ĐIỀU CHỈNH: Tốc độ di chuyển Parallax quay về mức TINH TẾ (0.08) <<<
        const moveValue = (scrollPosition - scrollOffset) * 0.00; 
        
        // Giới hạn di chuyển để không bị quá xa
        if (Math.abs(moveValue) < 100) { 
            mainPhotoWrapper.style.transform = `translateY(${moveValue}px)`;
        }
    }
    
    // Gán sự kiện cuộn
    window.addEventListener('scroll', handleParallax);
}

// ----------------------------------------------------
// GỘP TẤT CẢ LOGIC VÀ KHỞI TẠO AOS VÀO KHỐI 'load' DUY NHẤT
// ----------------------------------------------------
window.addEventListener('load', () => {
    // 1. Chạy các hàm chính
    updateCountdown();
    setInterval(updateCountdown, 1000); 
    renderCalendar();
    createSnowEffect();
    // >>> KHÔI PHỤC: Khởi tạo hiệu ứng Parallax <<<
    setupParallax(); 

    // 2. Khởi tạo AOS (Animation On Scroll)
    AOS.init({
        duration: 800, 
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // 3. Pop-up Modal Logic
    const modal = document.getElementById("thankYouModal");
    const closeButton = document.querySelector(".close-button");
    const form = document.getElementById("confirmationForm");
    
    if (form) {
        form.addEventListener('submit', function(event) {
            modal.style.display = "block";
            
            setTimeout(() => {
                form.reset(); 
            }, 1000); 
        });
    }

    if (closeButton) {
        closeButton.onclick = function() {
            modal.style.display = "none";
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Image Modal Logic
    const imageModal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const imageClose = document.querySelector(".image-close");

    // Add click event to all images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('click', function(event) {
            event.preventDefault();
            modalImage.src = this.src;
            imageModal.style.display = "block";
            imageModal.classList.add('show');
        });
    });

    if (imageClose) {
        imageClose.onclick = function() {
            imageModal.classList.remove('show');
            setTimeout(() => {
                imageModal.style.display = "none";
            }, 300);
        }
    }

    window.onclick = function(event) {
        if (event.target == imageModal) {
            imageModal.classList.remove('show');
            setTimeout(() => {
                imageModal.style.display = "none";
            }, 300);
        }
    }
});
// Snow Effect
        const canvas = document.getElementById('snow-canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        const snowflakes = [];

        class Snowflake {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 5 + 2; // Tăng kích thước
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 + 1; // Tăng tốc độ rơi
                this.opacity = Math.random() * 0.8 + 0.5; // Tăng độ mờ
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.y > canvas.height) {
                    this.y = -10;
                    this.x = Math.random() * canvas.width;
                }

                if (this.x > canvas.width) {
                    this.x = 0;
                } else if (this.x < 0) {
                    this.x = canvas.width;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Tạo tuyết rơi - TĂNG SỐ LƯỢNG
        for (let i = 0; i < 150; i++) {
            snowflakes.push(new Snowflake());
        }

        function animateSnow() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            snowflakes.forEach(flake => {
                flake.update();
                flake.draw();
            });

            requestAnimationFrame(animateSnow);
        }

        animateSnow();

        // Log để kiểm tra
        console.log('✅ AOS initialized');
        console.log('✅ Snow effect running');
        console.log('✅ Countdown running');