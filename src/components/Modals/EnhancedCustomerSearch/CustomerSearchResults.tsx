import React, {useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import CustomerSearchResultsActions from "./CustomerSearchResultsActions";
import {TArgCallback, TCallback} from "../../../types/types";
import CustomerSearchTable from "./CustomerSearchTable";
import {setPageData, setPaging} from "../../../store/reducers/enhancedCustomerSearch/actions";
import {defaultPageData} from "../../../store/reducers/defaultInitials";
import {useDispatch} from "react-redux";
import {TColumn, TSearchColumnName} from "./types";

type TCustomerSearchResultsProps = DialogProps & {
    onClearSearchForm: TCallback;
    handleNew: TCallback;
    redirect: TCallback;
    loadData: TArgCallback<boolean>;
};

export const customerDataColumns: TColumn[] = [
    {
        name: "Last Name",
        order: "lastName",

    },
    {
        name: "First Name",
        order: "firstName",
    },
    {
        name: "Home",
        order: "homePhone",
    },
    {
        name: "Cell",
        order: "cellPhone",
    },
    {
        name: "Other",
        order: "otherPhone",
    },
    {
        name: "Email",
        order: "email",
    },
    {
        name: "Address",
    },
    {
        name: "City",
    },
    {
        name: "State",
    },
    {
        name: 'ZIP'
    },
    {
        name: "Year",
    },
    {
        name: "Make",
    },
    {
        name: "Model",
    },
    {
        name: "VIN",
        order: "vin"
    },
]

export const columnsNames: TSearchColumnName[] = customerDataColumns.map(el => el.name);

const CustomerSearchResults: React.FC<TCustomerSearchResultsProps> = ({
                                                                          loadData,
                                                                          open,
                                                                          onClose,
                                                                          handleNew,
                                                                          onClearSearchForm,
                                                                      redirect}) => {
    const [isNewVehicleMode, setNewVehicleMode] = useState<boolean>(false);
    const [selectedColumns, setSelectedColumns] = useState<TSearchColumnName[]>(columnsNames);
    const visibleColumns = useMemo(() => customerDataColumns.filter(el => selectedColumns.includes(el.name)), [selectedColumns])
    const dispatch = useDispatch();

    useEffect(() => {
        if (open) {
            const columns = localStorage.getItem('columns')
            if (columns?.length) setSelectedColumns(JSON.parse(columns));
        }
    }, [open])

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

export default CustomerSearchResults;