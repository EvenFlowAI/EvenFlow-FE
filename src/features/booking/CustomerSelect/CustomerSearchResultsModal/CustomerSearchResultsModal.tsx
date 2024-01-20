import React, {useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import CustomerSearchResultsActions from "./CustomerSearchResultsActions/CustomerSearchResultsActions";
import {TArgCallback, TCallback} from "../../../../types/types";
import CustomerSearchTable from "./CustomerSearchTable/CustomerSearchTable";
import {setPageData, setPaging} from "../../../../store/reducers/enhancedCustomerSearch/actions";
import {defaultPageData} from "../../../../store/reducers/constants";
import {useDispatch, useSelector} from "react-redux";
import {TSearchColumnName} from "./types";
import {RootState} from "../../../../store/rootReducer";
import {columnsNames, customerDataColumns} from "./constants";

type TCustomerSearchResultsProps = DialogProps & {
    onClearSearchForm: TCallback;
    handleNew: TCallback;
    redirect: TCallback;
    loadData: TArgCallback<boolean>;
};

const CustomerSearchResultsModal: React.FC<React.PropsWithChildren<TCustomerSearchResultsProps>> = ({
                                                                          loadData,
                                                                          open,
                                                                          onClose,
                                                                          handleNew,
                                                                          onClearSearchForm,
                                                                      redirect}) => {
    const {customerSearchData} = useSelector((state: RootState) => state.customers);
    const [isNewVehicleMode, setNewVehicleMode] = useState<boolean>(false);
    const [selectedColumns, setSelectedColumns] = useState<TSearchColumnName[]>(columnsNames);
    const visibleColumns = useMemo(() => customerDataColumns.filter(el => selectedColumns.includes(el.name)), [selectedColumns])
    const dispatch = useDispatch();

    useEffect(() => {
        if (open) {
            const columns = localStorage.getItem('columns')
            if (columns?.length) {
                let parsed = JSON.parse(columns)
                if (customerSearchData?.lastVINCharacters && !parsed.includes("VIN")) {
                    parsed = [...parsed, "VIN"]
                }
                if (customerSearchData?.address && !parsed.includes("Address")) {
                    parsed = [...parsed, "Address"]
                }
                localStorage.setItem('columns', JSON.stringify(parsed))
                setSelectedColumns(parsed);
            }
        }
    }, [open, customerSearchData])

    const onCancel = async () => {
        await dispatch(setPaging({numberOfPages: 0, numberOfRecords: 0}));
        await dispatch(setPageData(defaultPageData))
        setNewVehicleMode(false);
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
                    selectedColumns={selectedColumns}
                    setSelectedColumns={setSelectedColumns}
                    onBack={onBack}
                    onNewSearch={onNewSearch}
                    isNewVehicleMode={isNewVehicleMode}
                    onCreateNewAppointment={onCreateNewAppointment}
                    onAppointmentForNewVehicle={onAppointmentForNewVehicle}/>

                <CustomerSearchTable
                    selectedColumns={visibleColumns}
                    redirect={redirect}
                    onClose={onCancel}
                    loadData={loadData}
                    isNewVehicleMode={isNewVehicleMode}/>
            </DialogContent>
        </BaseModal>
    );
};

export default CustomerSearchResultsModal;