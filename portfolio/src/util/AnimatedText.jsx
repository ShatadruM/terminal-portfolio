import { useState, useEffect } from 'react';

// Component to render text with a typing animation
const AnimatedText = ({ text, delay = 2 }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        if (text) {
            setDisplayedText(''); // Reset on text change
            const intervalId = setInterval(() => {
                if (i < text.length) {
                    setDisplayedText(prev => prev + text.charAt(i));
                    i++;
                } else {
                    clearInterval(intervalId);
                }
            }, delay);
            return () => clearInterval(intervalId);
        }
    }, [text, delay]);

    return <pre >{displayedText}</pre>;
};

export default AnimatedText;
