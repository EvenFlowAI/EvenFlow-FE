import React from 'react';
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {BookingFlowConfig} from "../../../features/admin/BookingFlowConfig/BookingFlowConfig";
import {bookingFlowRoot} from "../../../utils/constants";

export const BookingFlowConfigPage = () => {
    return (
        <div style={{width: '100%'}}>
            <TitleContainer title="Booking Flow Configuration" pad parent={bookingFlowRoot}/>
            <BookingFlowConfig/>
        </div>
    );
};