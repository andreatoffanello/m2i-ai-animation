// Aggiungiamo le variabili per tracciare il touch
let isDragging = false;
let previousTouch = { x: 0, y: 0 };

// Modifichiamo gli event listener per il touch
function initTouchEvents(camera, renderer) {
    renderer.domElement.addEventListener('touchstart', handleTouchStart);
    renderer.domElement.addEventListener('touchmove', handleTouchMove);
    renderer.domElement.addEventListener('touchend', handleTouchEnd);

    function handleTouchStart(event) {
        event.preventDefault();
        isDragging = true;
        const touch = event.touches[0];
        previousTouch.x = touch.clientX;
        previousTouch.y = touch.clientY;
    }

    function handleTouchMove(event) {
        if (!isDragging) return;
        
        event.preventDefault();
        const touch = event.touches[0];
        
        // Calcoliamo la differenza di movimento
        const deltaX = touch.clientX - previousTouch.x;
        const deltaY = touch.clientY - previousTouch.y;
        
        // Ruotiamo la camera in base al movimento
        // Usiamo valori piccoli per una rotazione più fluida
        camera.rotation.y += deltaX * 0.005;
        camera.rotation.x += deltaY * 0.005;
        
        // Limitiamo la rotazione verticale per evitare capovolgimenti
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
        
        // Aggiorniamo la posizione precedente
        previousTouch.x = touch.clientX;
        previousTouch.y = touch.clientY;
    }

    function handleTouchEnd() {
        isDragging = false;
    }
} 