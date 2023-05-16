import React from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import CustomerSearchResultsActions from "./CustomerSearchResultsActions";
import {TCallback} from "../../../types/types";
import CustomerSearchTable from "./CustomerSearchTable";

type TCustomerSearchResultsProps = DialogProps & {
    onClearSearchForm: TCallback;
    handleNew: TCallback;
};

const CustomerSearchResults: React.FC<TCustomerSearchResultsProps> = ({open, onClose, handleNew, onClearSearchForm}) => {
    const onCancel = () => {
        onClose()
    }

    const onBack = () => {
        onCancel();
    }
    const onNewSearch = () => {
        onCancel()
        onClearSearchForm()
    }
    const onCreateNewAppointment = async () => {
        await handleNew()
        await onCancel()
    }


    return (
        <BaseModal open={open} width={1248} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Customer Search results</DialogTitle>
            <DialogContent>
                <CustomerSearchResultsActions
                    onBack={onBack}
                    onNewSearch={onNewSearch}
                    onCreateNewAppointment={onCreateNewAppointment}/>

                <CustomerSearchTable onClose={onClose}/>
            </DialogContent>
        </BaseModal>
    );
};

export default CustomerSearchResults;