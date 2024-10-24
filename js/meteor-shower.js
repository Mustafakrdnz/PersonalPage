document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('meteor-shower');
    if (!canvas) {
        console.error("Canvas element 'meteor-shower' not found!");
        return;
    }
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let meteors = [];
    let sparks = [];

    class Meteor {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = 0;
            this.size = Math.random() * 5 + 10;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = Math.random() * 3 + 1;
            this.color = this.generateStoneColor();
            this.roughness = Math.random() * 0.4 + 0.6;
        }

        generateStoneColor() {
            const r = Math.floor(Math.random() * 30 + 100);
            const g = Math.floor(Math.random() * 30 + 80);
            const b = Math.floor(Math.random() * 30 + 60);
            return `rgb(${r}, ${g}, ${b})`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.createSparks();
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            
            // Create a rough, stone-like shape
            for (let i = 0; i < Math.PI * 2; i += 0.1) {
                const radius = this.size * (1 + Math.random() * this.roughness - this.roughness / 2);
                const x = this.x + Math.cos(i) * radius;
                const y = this.y + Math.sin(i) * radius;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();

            // Add some shading
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.restore();

            // Meteor tail
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.speedX * 10, this.y - this.speedY * 10);
            ctx.strokeStyle = 'rgba(255, 200, 100, 0.5)';
            ctx.lineWidth = this.size / 3;
            ctx.stroke();
        }

        createSparks() {
            if (Math.random() < 0.3) {
                sparks.push(new Spark(this.x, this.y, 'trail'));
            }
        }

        explode() {
            const sparkCount = Math.floor(this.size * 10); // Boyuta bağlı olarak kıvılcım sayısını ayarla
            for (let i = 0; i < sparkCount; i++) {
                sparks.push(new Spark(this.x, this.y, 'explosion'));
            }
        }
    }

    class Spark {
        constructor(x, y, type) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2 + 3;
            this.speedX = (Math.random() - 0.5) * (type === 'explosion' ? 3 : 0.5);
            this.speedY = (Math.random() - 0.5) * (type === 'explosion' ? 3 : 0.5);
            this.color = this.generateSparkColor();
            this.life = type === 'explosion' ? 40 : 100;
        }

        generateSparkColor() {
            const hue = Math.random() * 60 + 10; // 10 to 70 (yellow to red)
            return `hsl(${hue}, 100%, 50%)`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;
            this.size *= 0.95;
            if (this.speedY < 1) {
                this.speedY += -0.01; // Gravity effect
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function createMeteor() {
        meteors.push(new Meteor());
    }

    function updateMeteors() {
        for (let i = meteors.length - 1; i >= 0; i--) {
            meteors[i].update();
            if (meteors[i].y > canvas.height) {
                meteors.splice(i, 1);
            }
        }
    }

    function updateSparks() {
        for (let i = sparks.length - 1; i >= 0; i--) {
            sparks[i].update();
            if (sparks[i].life <= 0) {
                sparks.splice(i, 1);
            }
        }
    }

    function drawMeteors() {
        meteors.forEach(meteor => meteor.draw());
    }

    function drawSparks() {
        sparks.forEach(spark => spark.draw());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateMeteors();
        updateSparks();
        drawMeteors();
        drawSparks();
        if (Math.random() < 0.02) createMeteor();
        requestAnimationFrame(animate);
    }

    animate();

    document.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        for (let i = meteors.length - 1; i >= 0; i--) {
            const meteor = meteors[i];
            const dx = meteor.x - mouseX;
            const dy = meteor.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < meteor.size + 10) {
                meteor.explode();
                meteors.splice(i, 1);
            }
        }
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
