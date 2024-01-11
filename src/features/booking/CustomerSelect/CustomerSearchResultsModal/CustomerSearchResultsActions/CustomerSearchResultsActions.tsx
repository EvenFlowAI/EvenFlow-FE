import React, {Dispatch, SetStateAction} from 'react';
import {Button} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {TCallback} from "../../../../../types/types";
import {ReactComponent as SelectColumns} from "../../../../../assets/img/select_columns.svg";
import {TSearchColumnName} from "../types";
import ColumnsSelectionModal from "../ColumnsSelectionModal/ColumnsSelectionModal";
import {InfoOutlined} from "@material-ui/icons";
import {useStyles} from "./styles";
import {useModal} from "../../../../../hooks/useModal/useModal";

type TCustomerSearchResultsActionsProps = {
    onBack: TCallback;
    onNewSearch: TCallback;
    onCreateNewAppointment: TCallback;
    onAppointmentForNewVehicle: TCallback;
    isNewVehicleMode: boolean;
    selectedColumns: TSearchColumnName[];
    setSelectedColumns: Dispatch<SetStateAction<TSearchColumnName[]>>;
}

const CustomerSearchResultsActions: React.FC<TCustomerSearchResultsActionsProps> = ({
                                                                                        onBack,
                                                                                        onNewSearch,
                                                                                        isNewVehicleMode,
                                                                                        onCreateNewAppointment,
                                                                                        onAppointmentForNewVehicle,
                                                                                        selectedColumns,
                                                                                        setSelectedColumns
}) => {
    const classes = useStyles();
    const {t} = useTranslation();
    const {isOpen, onOpen, onClose} = useModal();

    return (
        <div className={classes.wrapper}>
            <div className={classes.leftWrapper}>
            <div className={classes.buttonsWrapper}>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={onBack}>
                    {t("Back")}
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={onNewSearch}>
                    {t("New Search")}
                </Button>
                {isNewVehicleMode
                    ? <div className={classes.newVehicleMode}>
                        <InfoOutlined htmlColor="#142EA1"/>
                        <div className="text">Select Customer with new vehicle</div>
                    </div>
                    : null}
            </div>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<SelectColumns/>}
                    className={classes.selectColumnsButton}
                    onClick={onOpen}>
                    {t("Select Columns")}
                </Button>
            </div>
            <div className={classes.horizontalBtnsWrapper}>
                <Button
                    variant="text"
                    color="primary"
                    className={classes.createNewButton}
                    onClick={onAppointmentForNewVehicle}>
                    {t("Create Appointment for New Vehicle of Existing Customer")}
                </Button>
                <Button
                    variant="text"
                    color="primary"
                    className={classes.createNewButton}
                    onClick={onCreateNewAppointment}>
                    {t("Create Appointment for New Customer")}
                </Button>
            </div>
            <ColumnsSelectionModal
                open={isOpen}
                onClose={onClose}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
            />
        </div>
    );
};

export default CustomerSearchResultsActions;