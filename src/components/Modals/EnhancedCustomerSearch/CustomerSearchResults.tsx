import React, {useState} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import CustomerSearchResultsActions from "./CustomerSearchResultsActions";
import {TArgCallback, TCallback} from "../../../types/types";
import CustomerSearchTable from "./CustomerSearchTable";
import {setPageData, setPaging} from "../../../store/reducers/enhancedCustomerSearch/actions";
import {defaultPageData} from "../../../store/reducers/defaultInitials";
import {useDispatch} from "react-redux";

type TCustomerSearchResultsProps = DialogProps & {
    onClearSearchForm: TCallback;
    handleNew: TCallback;
    loadData: TArgCallback<boolean>;
};

const CustomerSearchResults: React.FC<TCustomerSearchResultsProps> = ({
                                                                          loadData,
                                                                          open,
                                                                          onClose,
                                                                          handleNew,
                                                                          onClearSearchForm}) => {
    const [isNewVehicleMode, setNewVehicleMode] = useState<boolean>(false);
    const dispatch = useDispatch();

    const onCancel = async () => {
        await dispatch(setPaging({numberOfPages: 0, numberOfRecords: 0}));
        await dispatch(setPageData(defaultPageData))
        onClose()
    }

    const onBack = () => {
        if (isNewVehicleMode) {
            setNewVehicleMode(false)
        } else {
            onCancel().then();
        }
    }
    const onNewSearch = () => {
        onCancel().then()
        onClearSearchForm()
    }
    const onCreateNewAppointment = async () => {
        await handleNew()
        await onCancel()
    }

    const onAppointmentForNewVehicle = async () => {
        setNewVehicleMode(true);
    }

    return (
        <BaseModal open={open} width={1600} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Customer Search results</DialogTitle>
            <DialogContent>
                <CustomerSearchResultsActions
                    onBack={onBack}
                    onNewSearch={onNewSearch}
                    isNewVehicleMode={isNewVehicleMode}
                    onCreateNewAppointment={onCreateNewAppointment}
                    onAppointmentForNewVehicle={onAppointmentForNewVehicle}/>

                <CustomerSearchTable
                    onClose={onClose}
                    loadData={loadData}
                    isNewVehicleMode={isNewVehicleMode}/>
            </DialogContent>
        </BaseModal>
    );
};

export default CustomerSearchResults;