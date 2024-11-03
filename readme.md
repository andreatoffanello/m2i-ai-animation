# AI Animation Library

Una libreria JavaScript per creare animazioni 3D interattive con Three.js, progettata specificamente per visualizzare l'elaborazione di testo tramite AI.

## 📋 Caratteristiche

- Sfera di particelle animata e interattiva
- Sistema di animazione del testo 3D
- Effetti di illuminazione e shader personalizzati
- Supporto touch per dispositivi mobili
- Gestione responsive del canvas
- Animazioni fluide di entrata/uscita

## 🚀 Installazione

```bash
npm install ai-animation
```

## 🎯 Utilizzo Base

```javascript
import AiAnimation from 'ai-animation';

const animation = new AiAnimation({
  containerId: "ai_animation",
  options: {
    // opzioni personalizzate (opzionale)
  },
  onInitialized: () => {
    // callback quando l'animazione è pronta
  }
});

// Avvia l'animazione con un testo
animation.startAnimation("Il tuo testo qui...");

// Ferma l'animazione
animation.stopAnimation();
```

## ⚙️ Configurazione

### Parametri del Costruttore

```typescript
interface AiAnimationConfig {
  containerId: string;      // ID dell'elemento DOM che conterrà l'animazione
  options?: AnimationOptions; // Opzioni di configurazione (opzionale)
  onInitialized?: () => void; // Callback chiamato quando l'animazione è pronta
}
```

### Opzioni Disponibili

```javascript
const DEFAULT_OPTIONS = {
    // Animation timing constants
    SCENE_ANIMATION_DURATION: 2.0,    // Durata dell'animazione di entrata/uscita della scena completa (in secondi)
    MOVEMENT_TIME: 0.6,               // Tempo impiegato per il movimento delle parole (in secondi)
    PROCESSING_TIME: 2.5,             // Durata della fase di elaborazione/stasi (in secondi)
    PULSE_SPEED: 2.0,                 // Velocità della pulsazione della sfera interna (più alto = più veloce)
    PULSE_AMPLITUDE: 0.1,             // Ampiezza della pulsazione (quanto grande diventa la sfera durante la pulsazione)

    // Scene geometry constants
    PARTICLE_SIZE: 0.005,             // Dimensione delle singole particelle nella sfera esterna
    PARTICLE_COUNT: 30000,            // Numero totale di particelle nella sfera esterna
    SPHERE_RADIUS: 2.0,               // Raggio della sfera di particelle
    TEXT_SPHERE_RADIUS: 2.3,          // Raggio della sfera dove appaiono le parole
    TEXT_MIN_RADIUS: 0.1,             // Raggio minimo quando le parole sono al centro

    // Color palette
    PROCESSING_COLORS: [
        "#FBD23D",                    // Giallo - Colore primario per le particelle e il testo
        "#3EECFF",                    // Azzurro - Colore secondario
        "#EF6F34",                    // Arancione - Colore terziario
        "#5C20DD"                     // Viola - Colore quaternario
    ],
    DEFAULT_TEXT_COLOR: "#3EECFF",    // Colore di default per il testo

    // Word animation timing
    WORD_ANIMATION: {
        MOVE_OUT_DURATION: 1.0,       // Tempo per l'animazione dal centro alla superficie (in secondi)
        SURFACE_DURATION: 2.0,        // Tempo di permanenza sulla superficie (in secondi)
        MOVE_IN_DURATION: 1.0,        // Tempo per l'animazione dalla superficie al centro (in secondi)
        TYPING_SPEED: 0.5             // Velocità dell'effetto di digitazione delle lettere
    },

    // Word behavior
    MAX_ACTIVE_WORDS: 20,
    WORD_DELAY: 100,                  // Ritardo tra l'animazione di una parola e la successiva (in millisecondi)

    // Noise effect parameters
    NOISE: {
        AMPLITUDE: 0.1,               // Intensità dell'effetto di distorsione del noise
        FREQUENCY: 1.0                // Frequenza dell'effetto noise (più alto = più dettagliato)
    }
};
```

Puoi sovrascrivere qualsiasi opzione passandola al costruttore:

```javascript
const animation = new AiAnimation({
  containerId: "ai_animation",
  options: {
    WORD_DELAY: 300,           // Ritardo tra le parole (ms)
    PULSE_AMPLITUDE: 0.1,      // Ampiezza della pulsazione
    TEXT_SPHERE_RADIUS: 2.5,   // Raggio della sfera di testo
    PROCESSING_COLORS: [       // Colori personalizzati
      "#FF0000",
      "#00FF00",
      "#0000FF"
    ]
  }
});
```

## 🎯 Metodi Principali

### `startAnimation(text: string)`
Avvia l'animazione con il testo specificato. Il testo verrà suddiviso in parole e animato sulla sfera.

```javascript
animation.startAnimation("Il tuo testo qui...");
```

### `stopAnimation()`
Ferma l'animazione corrente con una transizione fluida di uscita.

```javascript
animation.stopAnimation();
```

### `dispose()`
Libera le risorse utilizzate dall'animazione. Da chiamare quando non serve più.

```javascript
animation.dispose();
```

## 🎨 Personalizzazione CSS

L'animazione utilizza questi stili CSS di base che possono essere personalizzati:

```css
#ai_animation {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    pointer-events: none;
}

#ai_text {
    position: fixed;
    left: -9999px;
    visibility: hidden;
}

.ai-animation-container {
    width: 100%;
    height: 100%;
    position: relative;
}
```

## 📱 Responsive Design

L'animazione si adatta automaticamente alle dimensioni del container. Per una visualizzazione ottimale, assicurati che il container abbia un aspect ratio di 1:1 (quadrato).

```css
#ai_animation {
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1/1;
}
```

## 🔄 Esempio Completo

```html
<!DOCTYPE html>
<html>
<head>
  <title>AI Animation Demo</title>
  <style>
    #ai_animation {
      width: 100%;
      max-width: 600px;
      aspect-ratio: 1/1;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div id="ai_animation"></div>
  
  <script type="module">
    import AiAnimation from 'ai-animation';
    
    const animation = new AiAnimation({
      containerId: "ai_animation",
      options: {
        WORD_DELAY: 300,
        PULSE_AMPLITUDE: 0.1
      },
      onInitialized: () => {
        animation.startAnimation(`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        `);
      }
    });
  </script>
</body>
</html>
```

## ⚠️ Note Importanti

1. Assicurati che il container esista nel DOM prima di inizializzare l'animazione
2. Il testo deve contenere almeno alcune parole di 4+ caratteri per un'animazione ottimale
3. L'animazione utilizza WebGL, assicurati che sia supportato dal browser
4. Per prestazioni ottimali, limita la lunghezza del testo a circa 1000 parole

## 🔧 Risoluzione Problemi

Se l'animazione non appare:
1. Verifica che l'ID del container sia corretto
2. Controlla la console per eventuali errori
3. Assicurati che Three.js sia caricato correttamente
4. Verifica che il container abbia dimensioni non nulle