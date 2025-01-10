import { useCallback, useState } from "react";

export const useSideBar = () => {
  const [isOpened, setOpened] = useState<boolean>(false);
  const onOpen = useCallback(() => {
    setOpened(true);
  }, []);
  const onClose = useCallback(() => {
    setOpened(false);
  }, []);
  const onToggle = useCallback(() => {
    setOpened((s) => !s);
  }, []);
  return { isOpened, onClose, onOpen, onToggle };
};
