import React from "react";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {Transportations} from "../../../features/admin/Transportations/Transportations";
import {bookingFlowRoot} from "../../../utils/constants";

export const TransportationOptions = () => {
    return <div style={{width: '100%'}}>
        <TitleContainer title="Transportation Options" pad parent={bookingFlowRoot}/>
        <Transportations/>
    </div>
}