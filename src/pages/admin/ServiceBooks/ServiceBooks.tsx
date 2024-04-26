import React from 'react';
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {capacityManagementRoot} from "../../../utils/constants";
import ButtonsRow from "../../../features/admin/ServiceBooks/ButtonsRow/ButtonsRow";

const ServiceBooks = () => {
    return (
        <div style={{width: '100%'}}>
            <TitleContainer title="Service Books" pad parent={capacityManagementRoot}/>
            <ButtonsRow/>
        </div>
    );
};

export default ServiceBooks;