document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('space-background');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = [];
    const numStars = 400;
    let nebulaOpacity = 0;

    // Create stars
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            alpha: Math.random(),
            velocity: Math.random() * 0.05
        });
    }

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw deep space
        const spaceGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        spaceGradient.addColorStop(0, '#000000');
        spaceGradient.addColorStop(1, '#0c0d21');
        ctx.fillStyle = spaceGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw stars
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();

            // Move stars
            star.y += star.velocity;
            if (star.y > canvas.height) star.y = 0;
        });

        // Draw nebula
        const nebulaGradient = ctx.createRadialGradient(
            canvas.width * 0.7, canvas.height * 0.3, 0,
            canvas.width * 0.7, canvas.height * 0.3, canvas.width * 0.5
        );
        nebulaGradient.addColorStop(0, `rgba(255, 0, 255, ${0.1 * nebulaOpacity})`);
        nebulaGradient.addColorStop(0.5, `rgba(0, 0, 255, ${0.05 * nebulaOpacity})`);
        nebulaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = nebulaGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Animate nebula
        nebulaOpacity = Math.sin(Date.now() * 0.001) * 0.5 + 0.5;

        // Draw Milky Way
        const milkyWayGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        milkyWayGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        milkyWayGradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.1 * nebulaOpacity})`);
        milkyWayGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = milkyWayGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function animate() {
        drawStars();
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
