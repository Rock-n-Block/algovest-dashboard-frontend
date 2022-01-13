import { useEffect, useState } from 'react';

const useResize = (fn?: () => {}): { width: number; height: number } => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    function updateSize() {
      setWidth(+window.innerWidth);
      setHeight(+window.innerHeight);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, [fn]);

  return {
    width,
    height,
  };
};

export default useResize;
