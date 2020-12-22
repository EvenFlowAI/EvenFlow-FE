import {IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";
import React from "react";

export type TPopoverProps = {
    onPopoverOpen: (appointment: IRemappedAppointmentSlot) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    onPopoverClose: () => void;
}