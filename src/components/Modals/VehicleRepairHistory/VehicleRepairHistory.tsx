import React, {useEffect, useState} from 'react';
import {
    IRepairHistory,
    IRepairOrder,
} from "../../../store/reducers/enhancedCustomerSearch/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadRepairHistory} from "../../../store/reducers/enhancedCustomerSearch/actions";
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {Divider, Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import moment from "moment";
import {Loading} from "../../UI/Loading";

const useStyles = makeStyles({
    wrapper: {

    },
    rightHeaderPart: {
        width: '60%',
    },
    nameLineGrid: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gridGap: 8,
    },
    carDataGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gridGap: 8,
        marginBottom: 20,
    },
    titleBig: {
        fontWeight: 'bold',
        fontSize: 20
    },
    titleSmall: {
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: "uppercase",
    },
    titleNonUpperCase: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    textBig: {
        fontSize: 20
    },
    textMd: {
        fontSize: 16
    },
    textSmall: {
        fontSize: 14,
    },
    orderWrapper: {
        border: '1px solid #DADADA'
    },
    gridTableHead: {
        display: 'grid',
        gridTemplateColumns: '1fr 5fr 6fr',
        "& > div:first-child": {
            width: 110,
            borderRight: '1px solid #DADADA',
        }
    },
    greyRow: {
        width: "100%",
        height: 12,
        backgroundColor: '#DADADA',
    },
    orderMainDataLeft: {
        borderRight: '1px solid #DADADA',
    },
    orderMainDataLeftTop: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        borderBottom: '1px solid #DADADA',
        "& > div:first-child": {
            width: 110,
            borderRight: '1px solid #DADADA',
        }
    },
    orderMainDataRight: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        borderBottom: '1px solid #DADADA',
    },
    orderMainData: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr'
    }
})

const VehicleRepairHistory: React.FC<DialogProps & {vehicleDmsId: string}> = ({vehicleDmsId, open, onClose}) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {repairHistoryLoading, repairHistory} = useSelector((state: RootState) => state.customers);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        if (scProfile && vehicleDmsId && open) {
            // todo real id of service center
            // dispatch(loadRepairHistory(scProfile.id, vehicleDmsId, pageIndex, 5));
            dispatch(loadRepairHistory(76, vehicleDmsId, pageIndex, 5));
        }
    }, [scProfile, vehicleDmsId, open])

    const onCancel = () => {
        // todo clear data?
        onClose();
    }

    return (
        <BaseModal open={open} width={1248} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Repair Order History</DialogTitle>
            <DialogContent>
                {repairHistoryLoading
                    ? <Loading/>
                    : <div className={classes.wrapper}>
                        <div className={classes.rightHeaderPart}>
                            <div className={classes.textBig}>Customer & Vehicle Information:</div>
                            <div className={classes.nameLineGrid}>
                                <div className={classes.titleBig}>{repairHistory?.firstName} {repairHistory?.lastName}</div>
                                <div><span className={classes.titleSmall}>Cell Phone</span> {repairHistory?.cellPhone}</div>
                                <div><span className={classes.titleSmall}>Home Phone</span> {repairHistory?.homePhone}</div>
                            </div>
                            <Divider/>
                            <div className={classes.carDataGrid}>
                                <div>
                                    <div className={classes.titleSmall}>Year:</div>
                                    <div className={classes.textSmall}>{repairHistory?.year}</div>
                                </div>
                                <div>
                                    <div className={classes.titleSmall}>Make:</div>
                                    <div className={classes.textSmall}>{repairHistory?.make}</div>
                                </div>
                                <div>
                                    <div className={classes.titleSmall}>Model:</div>
                                    <div className={classes.textSmall}>{repairHistory?.model}</div>
                                </div>
                                <div>
                                    <div className={classes.titleSmall}>Vin:</div>
                                    <div className={classes.textSmall}>{repairHistory?.vin}</div>
                                </div>
                            </div>
                        </div>
                        <div className={classes.textBig}>Prior Repair Orders:</div>
                        {repairHistory?.repairOrders.map(item => <div className={classes.orderWrapper}>
                            <div className={classes.gridTableHead}>
                                <div>{item.number}</div>
                                <div>{moment(item.date).format('dddd, MMMM DD, YYYY')}</div>
                                <div>
                                    <span>Repair Order:</span><span> total/tax</span>   <span>${item.totalPrice}</span>
                                </div>
                            </div>
                            <div className={classes.orderMainData}>
                                <div className={classes.orderMainDataLeft}>
                                    <div className={classes.orderMainDataLeftTop}>
                                        <div>
                                            <div className={classes.titleNonUpperCase}>RO Status:</div>
                                            <div>{item.status}</div>
                                        </div>
                                        <div>
                                            <div className={classes.titleNonUpperCase}>Mileage:</div>
                                            <div>{item.mileage}</div>
                                        </div>
                                        <div>
                                            <div className={classes.titleNonUpperCase}>Advisor:</div>
                                            <div>{item.advisor}</div>
                                        </div>
                                        <div>
                                            <div className={classes.titleNonUpperCase}>Tech Labor Time:</div>
                                            <div>{item.technicianLaborTime}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className={classes.titleNonUpperCase}>Services Performed:</div>
                                        <ol>
                                            {item.services.map(service => {
                                                return <li key={service.correction}>
                                                    {/*<span className={classes.titleNonUpperCase}></span>*/}
                                                </li>
                                            })}
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>)}
                    </div>
                }
            </DialogContent>
        </BaseModal>
    );
};

export default VehicleRepairHistory;