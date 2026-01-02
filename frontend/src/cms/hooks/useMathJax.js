import { useEffect } from 'react';

/**
 * Hook to trigger MathJax typesetting on specific elements or globally.
 * @param {React.RefObject} ref - Optional ref to scope typesetting. If null, typset entire page (less efficient).
 * @param {Array} dependencies - Array of dependencies that should trigger re-typesetting when changed.
 */
export const useMathJax = (ref, dependencies = []) => {
    useEffect(() => {
        if (typeof window !== 'undefined' && window.MathJax) {
            const typeset = () => {
                if (window.MathJax.typesetPromise) {
                    const element = ref?.current ? [ref.current] : null; // null triggers global
                    window.MathJax.typesetPromise(element).catch(err => console.error('MathJax typeset failed', err));
                }
            };

            // Little delay to ensure DOM is ready (sometimes needed with React rendering)
            // requestAnimationFrame is a good substitute for checking DOM Update completion
            requestAnimationFrame(() => typeset());
        }
    }, dependencies);
};
