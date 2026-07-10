import { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathTexProps {
  math: string;
  block?: boolean;
}

export default function MathTex({ math, block = false }: MathTexProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: block,
          throwOnError: false,
        });
      } catch (err) {
        console.error('KaTeX error:', err);
        containerRef.current.textContent = math;
      }
    }
  }, [math, block]);

  return <span ref={containerRef} className="inline-block" id="math-container" />;
}
