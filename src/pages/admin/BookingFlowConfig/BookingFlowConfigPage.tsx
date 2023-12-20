import React from 'react';
import {TitleContainer} from "../../../components/UI/TitleContainer";
import {BookingFlowConfig} from "../../../features/BookingFlowConfig/BookingFlowConfig";
import {bookingFlowRoot} from "../../../config/constants";

export const BookingFlowConfigPage = () => {
    return (
        <div style={{width: '100%'}}>
            <TitleContainer title="Booking Flow Configuration" pad parent={bookingFlowRoot}/>
            <BookingFlowConfig/>
        </div>
    );
};