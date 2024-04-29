import React from 'react';
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {capacityManagementRoot} from "../../../utils/constants";
import ButtonsRow from "../../../features/admin/ServiceBooks/ButtonsRow/ButtonsRow";
import ServiceBooksTable from "../../../features/admin/ServiceBooks/ServiceBooksTable/ServiceBooksTable";

const ServiceBooks = () => {
    return (
        <div style={{width: '100%'}}>
            <TitleContainer title="Service Books" pad parent={capacityManagementRoot}/>
            <ButtonsRow/>
            <ServiceBooksTable/>
        </div>
    );
};

export default ServiceBooks;