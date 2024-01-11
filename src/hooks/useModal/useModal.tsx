import {useState} from "react";

export const useModal = () => {
    const [isOpen, setOpen] = useState(false);
    const onClose = () => {
        setOpen(false);
    };
    const onOpen = () => {
        setOpen(true);
    };
    const onToggleOpen = () => {
        setOpen(!isOpen);
    };
    return {isOpen, onClose, onOpen, onToggleOpen};
}