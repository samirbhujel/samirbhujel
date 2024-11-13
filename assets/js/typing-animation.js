document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded'); // Debug log

    function initTypingAnimations() {
        try {
            const typingElements = document.querySelectorAll('[data-typing]');
            console.log('Found typing elements:', typingElements.length); // Debug log

            if (typingElements.length === 0) {
                console.error('No typing elements found!');
                return;
            }

            typingElements.forEach(element => {
                const originalText = element.textContent;
                console.log('Original text:', originalText); // Debug log

                const delay = parseInt(element.dataset.typingDelay) || 100;
                const startDelay = parseInt(element.dataset.typingStart) || 0;
                const effect = element.dataset.typingEffect || 'default';

                // Don't clear text immediately
                const currentText = element.textContent;

                setTimeout(() => {
                    try {
                        if (effect === 'loop') {
                            typeLoop(element, currentText, delay);
                        } else {
                            typeDefault(element, currentText, delay);
                        }
                    } catch (error) {
                        console.error('Error in typing effect:', error);
                        // Restore original text if there's an error
                        element.textContent = originalText;
                    }
                }, startDelay);
            });
        } catch (error) {
            console.error('Error in initTypingAnimations:', error);
        }
    }

    function typeLoop(element, text, delay) {
        const words = text.split('|');
        let wordIndex = 0;

        function typeWord() {
            const currentWord = words[wordIndex];
            let charIndex = 0;

            // Clear the element
            element.textContent = '';

            function typeChar() {
                if (charIndex < currentWord.length) {
                    element.textContent += currentWord[charIndex];
                    charIndex++;
                    setTimeout(typeChar, delay);
                } else {
                    // Word is complete, wait 10 seconds before next word
                    setTimeout(() => {
                        wordIndex = (wordIndex + 1) % words.length;
                        typeWord();
                    }, 10000);
                }
            }

            typeChar();
        }

        typeWord();
    }

    function typeDefault(element, text, delay) {
        let charIndex = 0;
        element.textContent = '';

        function typeChar() {
            if (charIndex < text.length) {
                element.textContent += text[charIndex];
                charIndex++;
                setTimeout(typeChar, delay);
            }
        }

        typeChar();
    }

    // Initialize with a small delay to ensure DOM is ready
    setTimeout(initTypingAnimations, 100);
}); 