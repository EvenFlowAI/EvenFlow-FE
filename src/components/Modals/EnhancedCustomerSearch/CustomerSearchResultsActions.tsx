import React, {Dispatch, SetStateAction} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {TCallback} from "../../../types/types";
import {ReactComponent as SelectColumns} from "../../../assets/img/select_columns.svg";
import {useModal} from "../../../utils/hooks";
import {TSearchColumnName} from "./types";
import ColumnsSelection from "./ColumnsSelection";
import {InfoOutlined} from "@material-ui/icons";

const useStyles = makeStyles({
    wrapper: {
        position: 'sticky',
        left: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftWrapper: {
        display: "flex",
        flexGrow: 1,
        justifyContent: "space-between",
        alignItems: "center",
        marginRight: 44,
    },
    buttonsWrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        "& > button": {
            width: 144
        },
        "& > button:first-child": {
            marginRight: 20,
        },
    },
    horizontalBtnsWrapper: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
    createNewButton: {
        textTransform: 'none',
        textDecoration: "underline",
        padding: '4px 8px'
    },
    newVehicleMode: {
        display: "flex",
        alignItems: 'center',
        padding: '9px 12px',
        marginLeft: 48,
        fontSize: 13,
        fontWeight: 600,
        color: "#142EA1",
        backgroundColor: "#F7F8FB",
        borderRadius: 2,
        boxShadow: '2px 2px 2px lightgray',
        "& .text": {
            marginLeft: 8,
            textTransform: "uppercase",
        }
},
    selectColumnsButton: {
        fontWeight: 400
    }
})

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
                {/*{isNewVehicleMode*/}
                {/*    ? <div className={classes.newVehicleMode}>*/}
                {/*        <InfoOutlined htmlColor="#142EA1"/>*/}
                {/*        <div className="text">Select Customer with new vehicle</div>*/}
                {/*    </div>*/}
                {/*: null}*/}
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
            <ColumnsSelection
                open={isOpen}
                onClose={onClose}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
            />
        </div>
    );
};

export default CustomerSearchResultsActions;