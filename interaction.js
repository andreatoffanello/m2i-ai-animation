import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let controls;

function initTouchEvents(camera, renderer) {
    // Verifichiamo se siamo su mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Inizializziamo OrbitControls solo su mobile
        controls = new OrbitControls(camera, renderer.domElement);
        
        // Configuriamo i controlli per una migliore esperienza mobile
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 5;
        controls.maxDistance = 15;
        controls.minPolarAngle = Math.PI / 4;
        controls.maxPolarAngle = Math.PI / 1.5;
        controls.enablePan = false;
        controls.rotateSpeed = 0.5;
        
        // Disabilitiamo i controlli mouse quando usiamo OrbitControls
        renderer.domElement.style.touchAction = 'none';
        
        // Restituiamo la funzione di update per OrbitControls
        return function updateControls() {
            controls.update();
        };
    } else {
        // Su desktop non facciamo nulla, lasciamo i controlli mouse esistenti
        return null;
    }
}

export { initTouchEvents }; 