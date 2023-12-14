import React from 'react';
import {TitleContainer} from "../../../components/Content/TitleContainer/TitleContainer";
import {bookingFlowRoot} from "../../../components/Optimizer/utils";
import {BookingFlowConfig} from "../../../features/BookingFlowConfig";

export const BookingFlowConfigPage = () => {
    return (
        <div style={{width: '100%'}}>
            <TitleContainer title="Booking Flow Configuration" pad parent={bookingFlowRoot}/>
            <BookingFlowConfig/>
        </div>
    );
};