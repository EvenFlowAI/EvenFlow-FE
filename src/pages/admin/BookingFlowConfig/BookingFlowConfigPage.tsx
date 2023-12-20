import React from 'react';
import {TitleContainer} from "../../../components/TitleContainer/TitleContainer";
import {BookingFlowConfig} from "../../../features/admin/BookingFlowConfig/BookingFlowConfig";
import {bookingFlowRoot} from "../../../config/constants";

export const BookingFlowConfigPage = () => {
    return (
        <div style={{width: '100%'}}>
            <TitleContainer title="Booking Flow Configuration" pad parent={bookingFlowRoot}/>
            <BookingFlowConfig/>
        </div>
    );
};