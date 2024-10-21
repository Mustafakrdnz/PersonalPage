document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('sparkles');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    function createParticle(x, y) {
        const size = Math.random() * 1.5 + 0.5; // Daha küçük boyutlar
        const color = `hsl(${Math.random() * 60 + 180}, 100%, ${Math.random() * 30 + 70}%)`; // Daha parlak renkler
        return {
            x: x,
            y: y,
            size: size,
            color: color,
            velocity: {
                x: (Math.random() - 0.5) * 1.5, // Hızı biraz azalttık
                y: (Math.random() - 0.5) * 1.5
            },
            life: Math.random() * 40 + 80, // Daha kısa ömür
            opacity: 1
        };
    }

    function updateParticles() {
        particles.forEach((particle, index) => {
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            particle.life--;
            particle.opacity = particle.life / 60;

            particle.velocity.y += 0.01; // Hafif yerçekimi etkisi

            if (particle.life <= 0) {
                particles.splice(index, 1);
            }
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
        });
    }

    function updateCursorVisibility() {
        if (particles.length > 0) {
            document.body.style.cursor = 'none';
        } else {
            document.body.style.cursor = 'auto';
        }
    }

    function animate() {
        updateParticles();
        drawParticles();
        updateCursorVisibility();
        requestAnimationFrame(animate);
    }

    animate();

    document.addEventListener('mousemove', (e) => {
        for (let i = 0; i < 3; i++) {
            particles.push(createParticle(e.clientX, e.clientY));
        }
        document.body.style.cursor = 'none';
    });

    document.addEventListener('mouseout', () => {
        document.body.style.cursor = 'auto';
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
