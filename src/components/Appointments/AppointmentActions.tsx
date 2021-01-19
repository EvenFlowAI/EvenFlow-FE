import React from 'react';
import {Button} from "@material-ui/core";
import {useModal} from "../../utils/hooks";
import {AppointmentDialog} from "./AppointmentDialog";

type TProps = {
    onAction?: () => void;
}
export const AppointmentActions: React.FC<TProps> = ({onAction}) => {
    const {isOpen, onOpen, onClose} = useModal();

    return <>
        <Button
            onClick={onOpen}
            variant="contained"
            color="primary">
            New Appointment
        </Button>
        <AppointmentDialog onAction={onAction} open={isOpen} onClose={onClose} />
    </>
};