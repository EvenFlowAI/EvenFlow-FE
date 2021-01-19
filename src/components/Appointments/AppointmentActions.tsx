import React from 'react';
import {Button} from "@material-ui/core";
import {useModal} from "../../utils/hooks";
import {AppointmentDialog} from "./AppointmentDialog";

export const AppointmentActions = () => {
    const {isOpen, onOpen, onClose} = useModal();

    return <>
        <Button
            onClick={onOpen}
            variant="contained"
            color="primary">
            New Appointment
        </Button>
        <AppointmentDialog open={isOpen} onClose={onClose} />
    </>
};