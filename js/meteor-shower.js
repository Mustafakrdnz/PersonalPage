document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('meteor-shower');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let meteors = [];
    let explosions = [];

    class Meteor {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = 0;
            this.size = Math.random() * 3 + 2; // Boyutu artırdık
            this.speedX = (Math.random() - 0.5) * 2; // X hızını azalttık
            this.speedY = Math.random() * 3 + 1; // Y hızını azalttık
            this.color = `hsl(${Math.random() * 60 + 200}, 100%, 70%)`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.speedX * 10, this.y - this.speedY * 10);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
            ctx.stroke();
        }
    }

    class Explosion {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.particles = [];
            for (let i = 0; i < 20; i++) {
                this.particles.push({
                    x: this.x,
                    y: this.y,
                    radius: Math.random() * 2 + 1,
                    speed: Math.random() * 3 + 1,
                    angle: Math.random() * Math.PI * 2,
                    opacity: 1
                });
            }
        }

        update() {
            this.particles.forEach(particle => {
                particle.x += Math.cos(particle.angle) * particle.speed;
                particle.y += Math.sin(particle.angle) * particle.speed;
                particle.opacity -= 0.02;
            });
            this.particles = this.particles.filter(particle => particle.opacity > 0);
        }

        draw() {
            this.particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${particle.opacity})`;
                ctx.fill();
            });
        }
    }

    function createMeteor() {
        meteors.push(new Meteor());
    }

    function removeMeteor(index) {
        const meteor = meteors[index];
        explosions.push(new Explosion(meteor.x, meteor.y, '255, 255, 255'));
        meteors.splice(index, 1);
    }

    function updateMeteors() {
        for (let i = meteors.length - 1; i >= 0; i--) {
            meteors[i].update();
            if (meteors[i].y > canvas.height) {
                meteors.splice(i, 1);
            }
        }
    }

    function updateExplosions() {
        for (let i = explosions.length - 1; i >= 0; i--) {
            explosions[i].update();
            if (explosions[i].particles.length === 0) {
                explosions.splice(i, 1);
            }
        }
    }

    function drawMeteors() {
        meteors.forEach(meteor => meteor.draw());
    }

    function drawExplosions() {
        explosions.forEach(explosion => explosion.draw());
    }

    function checkCollision(x, y) {
        for (let i = meteors.length - 1; i >= 0; i--) {
            const dx = meteors[i].x - x;
            const dy = meteors[i].y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 30) { // Çarpışma mesafesini artırdık
                removeMeteor(i);
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateMeteors();
        updateExplosions();
        drawMeteors();
        drawExplosions();
        if (Math.random() < 0.05) createMeteor(); // Meteor oluşturma sıklığını azalttık
        requestAnimationFrame(animate);
    }

    animate();

    document.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        checkCollision(x, y);
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
