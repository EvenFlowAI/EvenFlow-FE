import React from 'react';
import {IAssignedServiceRequest} from "../../../../../store/reducers/serviceRequests/types";
import OpsCode from "../OpsCodeLabel/OpsCodeLabel";
import {Title, Wrapper} from "./styles";
import {TArgCallback} from "../../../../../types/types";

type TProps = {
    selectedCodes: IAssignedServiceRequest[];
    onDelete: TArgCallback<IAssignedServiceRequest>;
}

const OpsCodesSelected: React.FC<TProps> = ({selectedCodes, onDelete}) => {
    return (
        <div style={{display: 'flex', alignItems: "center", gap: 8, gridColumn: '2 / -1'}}>
            <Title>Ops Code Selected: </Title>
            <Wrapper>
                {selectedCodes.map(el => {
                    return <OpsCode onDelete={onDelete} serviceRequest={el}/>
                })}
            </Wrapper>
        </div>
    );
};

export default OpsCodesSelected;