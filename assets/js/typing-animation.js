document.addEventListener('DOMContentLoaded', function() {
    function initTypingAnimations() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        const effects = {
            loop: (element, text, delay) => {
                const words = text.split('|');
                let wordIndex = 0;
                
                const typeWord = () => {
                    const currentWord = words[wordIndex];
                    let charIndex = 0;
                    
                    // Clear the text before starting to type
                    element.textContent = '';
                    
                    function typeChar() {
                        if (charIndex < currentWord.length) {
                            // Add character one by one
                            element.textContent += currentWord.charAt(charIndex);
                            charIndex++;
                            setTimeout(typeChar, delay);
                        } else {
                            // Word is complete, wait 10 seconds before next word
                            setTimeout(() => {
                                element.textContent = ''; // Clear text completely
                                wordIndex = (wordIndex + 1) % words.length;
                                typeWord(); // Start next word
                            }, 10000);
                        }
                    }
                    
                    typeChar();
                };
                
                typeWord();
            },
            
            default: (element, text, delay) => {
                let charIndex = 0;
                element.textContent = '';
                
                const interval = setInterval(() => {
                    if (charIndex < text.length) {
                        element.textContent += text.charAt(charIndex);
                        charIndex++;
                    } else {
                        clearInterval(interval);
                    }
                }, delay);
            }
        };
        
        typingElements.forEach(element => {
            const text = element.textContent;
            const delay = parseInt(element.dataset.typingDelay) || 100;
            const startDelay = parseInt(element.dataset.typingStart) || 0;
            const effect = element.dataset.typingEffect || 'default';
            
            // Clear initial text
            element.textContent = '';
            
            // Start animation after specified delay
            setTimeout(() => {
                if (effects[effect]) {
                    effects[effect](element, text, delay);
                } else {
                    effects.default(element, text, delay);
                }
            }, startDelay);
        });
    }

    // Initialize typing animations
    initTypingAnimations();
}); 