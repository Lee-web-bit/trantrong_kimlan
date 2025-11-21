// script.js
// Countdown to Oct 12, 2025 12:00 PM
const weddingDate = new Date('2025-10-12T12:00:00');

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

// Confetti Animation
function createConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const particles = [];
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f', '#d4a373', '#f4e1c1'];

    function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = -Math.random() * canvas.height; 
        this.size = Math.random() * 4 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 0.2 + 0.05;
    }

    Particle.prototype.update = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        
        if (this.y > canvas.height * 0.8 && this.size > 0) {
            this.size -= 0.05;
        }
    };

    Particle.prototype.draw = function() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
    };

    function handleParticles() {
        if (particles.length < 50 && (weddingDate - new Date()) > 0) {
            particles.push(new Particle());
        }

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            if (particles[i].size <= 0.2 || particles[i].y > canvas.height + 20) {
                particles.splice(i, 1);
                i--;
            }
        }
    }

    let animationFrameId;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleParticles();
        animationFrameId = requestAnimationFrame(animate);
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
        const moveValue = (scrollPosition - scrollOffset) * 0.08; 
        
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
    createConfetti();
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
});