import React from "react";
import {TitleContainer} from "../../../components/TitleContainer/TitleContainer";
import {Transportations} from "../../../features/admin/Transportations/Transportations";
import {bookingFlowRoot} from "../../../config/constants";

export const TransportationOptions = () => {
    return <div style={{width: '100%'}}>
        <TitleContainer title="Transportation Options" pad parent={bookingFlowRoot}/>
        <Transportations/>
    </div>
}