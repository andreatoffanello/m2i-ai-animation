import { DEFAULT_TEXT_COLOR } from '../constants';  // invece di '../constants/colors'

export class TextManager {
    constructor() {
        this.placeholderText = [
            "Three.js",
            "WebGL",
            "Creative",
            "Development",
            "Interactive",
            "Experience",
            "Digital",
            "Art"
        ];
    }

    getText() {
        console.log('TextManager getText called');
        const contentText = document.querySelector('.content-text');
        console.log('Content text element:', contentText);
        
        if (contentText && contentText.textContent.trim()) {
            const words = contentText.textContent
                .trim()
                .split(/\s+/)
                .filter(word => word.length > 3)
                .slice(0, 8);

            console.log('Found words:', words);
            
            if (words.length >= 4) {
                return words;
            }
        }
        
        console.log('Using placeholder');
        return this.placeholderText;
    }
} 