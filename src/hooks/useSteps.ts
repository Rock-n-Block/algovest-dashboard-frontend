import { useCallback, useState } from 'react';

const useSteps = (initialIndex: number): [number, (index: number) => void] => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const handleCheckChange = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  return [activeIndex, handleCheckChange];
};

export default useSteps;
