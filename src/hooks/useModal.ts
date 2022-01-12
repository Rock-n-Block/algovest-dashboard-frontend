import { useCallback, useState } from 'react';

const useModal = (initialVisible = false): [boolean, () => void, () => void] => {
  const [isVisibleModal, setVisibleModal] = useState(initialVisible);

  const handleOpenModal = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setVisibleModal(false);
  }, []);

  return [isVisibleModal, handleOpenModal, handleCloseModal];
};

export default useModal;
