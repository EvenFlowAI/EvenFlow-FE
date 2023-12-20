import React from "react";
import {TitleContainer} from "../../../components/UI/TitleContainer";
import {Transportations} from "../../../features/Transportations/Transportations";
import {bookingFlowRoot} from "../../../config/constants";

export const TransportationOptions = () => {
    return <div style={{width: '100%'}}>
        <TitleContainer title="Transportation Options" pad parent={bookingFlowRoot}/>
        <Transportations/>
    </div>
}