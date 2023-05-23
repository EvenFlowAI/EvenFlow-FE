import React from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import CustomerSearchResultsActions from "./CustomerSearchResultsActions";
import {TCallback} from "../../../types/types";
import CustomerSearchTable from "./CustomerSearchTable";
import {setPageData, setPaging} from "../../../store/reducers/enhancedCustomerSearch/actions";
import {defaultPageData} from "../../../store/reducers/defaultInitials";
import {useDispatch} from "react-redux";

type TCustomerSearchResultsProps = DialogProps & {
    onClearSearchForm: TCallback;
    handleNew: TCallback;
    loadData: TCallback;
};

const CustomerSearchResults: React.FC<TCustomerSearchResultsProps> = ({loadData, open, onClose, handleNew, onClearSearchForm}) => {
    const dispatch = useDispatch();

    const onCancel = async () => {
        await dispatch(setPaging({numberOfPages: 0, numberOfRecords: 0}));
        await dispatch(setPageData(defaultPageData))
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

                <CustomerSearchTable onClose={onClose} loadData={loadData}/>
            </DialogContent>
        </BaseModal>
    );
};

export default CustomerSearchResults;