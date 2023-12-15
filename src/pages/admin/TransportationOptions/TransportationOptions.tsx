import React from "react";
import {TitleContainer} from "../../../components/Content/TitleContainer/TitleContainer";
import {bookingFlowRoot} from "../../../components/Optimizer/utils";
import {Transportations} from "../../../features/Transportations/Transportations";

export const TransportationOptions = () => {
    return <div style={{width: '100%'}}>
        <TitleContainer title="Transportation Options" pad parent={bookingFlowRoot}/>
        <Transportations/>
    </div>
}