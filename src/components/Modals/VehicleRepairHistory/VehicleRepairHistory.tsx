import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadMoreRepairHistory, loadRepairHistory} from "../../../store/reducers/enhancedCustomerSearch/actions";
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {Button, Divider, Table, TableBody, TableCell, TableHead, TableRow, withStyles} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import moment from "moment";
import {Loading} from "../../UI/Loading";
import classnames from 'classnames';
import {NoData} from "../../UI/NoData";

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
        gridTemplateColumns: '120px 1fr 1fr 1fr',
        gridGap: 8,
        marginBottom: 20,
    },
    titleBig: {
        fontWeight: 600,
        fontSize: 20
    },
    name: {
        fontWeight: 600,
        fontSize: 16,
    },
    titleSmall: {
        fontWeight: 600,
        fontSize: 14,
        textTransform: "uppercase",
        paddingBottom: 8,
    },
    titleNonUpperCase: {
        fontWeight: 600,
        fontSize: 14,
        paddingBottom: 4,
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
    textSmaller: {
        fontSize: 12,
    },
    orderWrapper: {
        border: '1px solid #DADADA',
        marginBottom: 36,
    },
    gridTableHead: {
        display: 'grid',
        gridTemplateColumns: '120px 5fr ',
        borderRight: '1px solid #DADADA',
        "& > div:first-child": {
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
        gridTemplateColumns: '120px 1fr 1fr 1fr',
        borderBottom: '1px solid #DADADA',
        "& > div:first-child": {
            borderRight: '1px solid #DADADA',
        }
    },
    orderMainDataRightTop: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        borderBottom: '1px solid #DADADA',
    },
    orderMainData: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr'
    },
    italic: {
        fontStyle: "italic",
    },
    serviceItem: {
        padding: 8,
        "&::marker": {
            fontWeight: "bold"
        }
    },
    centered: {
        display: 'flex',
        justifyContent: "center",
        alignItems: "center"
    },
    uppercase: {
        textTransform: 'uppercase'
    },
    borderRight: {
        borderRight: '1px solid #DADADA'
    },
    borderTop: {
        borderTop: '1px solid #DADADA'
    },
    padding: {
        padding: '16px 24px'
    },
    smallPadding: {
        padding: '8px 24px'
    },
    threePartsGrid: {
        display: "grid",
        gridTemplateColumns: '1fr 1fr 1fr'
    }
})

const TCell = withStyles({
    root: {
        padding: 2,
        borderBottom: "none"
    }
})(TableCell)

const HCell = withStyles({
    root: {
        color: "grey",
        textTransform: "uppercase",
        fontSize: 10,
        fontWeight: 600
    }
})(TCell)

const VehicleRepairHistory: React.FC<DialogProps & {vehicleDmsId: string}> = ({vehicleDmsId, open, onClose}) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {repairHistoryLoading, repairHistory, repairHistoryPaging} = useSelector((state: RootState) => state.customers);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        if (scProfile && vehicleDmsId && open) {
            dispatch(loadRepairHistory(scProfile.id, vehicleDmsId, pageIndex, 4));
        }
    }, [scProfile, vehicleDmsId, open, pageIndex])

    const onCancel = () => {
        onClose();
    }

    const onLoadMore = () => {
        const index = pageIndex + 1;
        setPageIndex(index);
        scProfile && dispatch(loadMoreRepairHistory(scProfile.id, vehicleDmsId, index, 4))
    }

    return (
        <BaseModal open={open} width={1300} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Repair Order History</DialogTitle>
            <DialogContent>
                {repairHistoryLoading
                    ? <Loading/>
                    : !repairHistory ? <NoData/>
                        : <div className={classes.wrapper}>
                            <div className={classes.rightHeaderPart}>
                                <div className={classes.textBig} style={{paddingBottom: 12}}>Customer & Vehicle Information:</div>
                                <div className={classes.nameLineGrid}>
                                    <div className={classes.name}>{repairHistory?.firstName} {repairHistory?.lastName}</div>
                                    <div><span className={classes.titleSmall}>Cell Phone</span> {repairHistory?.cellPhone}</div>
                                    <div><span className={classes.titleSmall}>Home Phone</span> {repairHistory?.homePhone}</div>
                                </div>
                                <Divider style={{marginTop: 18, marginBottom: 24, padding: 0}}/>
                                <div className={classnames(classes.carDataGrid)}>
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
                            <div className={classes.textBig} style={{paddingBottom: 16}}>Prior Repair Orders:</div>
                            {repairHistory?.repairOrders.map(item => <div className={classes.orderWrapper} key={item.date}>
                                <div className={classes.orderMainData}>
                                    <div className={classnames(classes.gridTableHead)}>
                                        <div className={classnames(classes.titleNonUpperCase, classes.padding)}>{item.number}</div>
                                        <div className={classnames(classes.titleNonUpperCase, classes.padding)}>{moment(item.date).format('dddd, MMMM DD, YYYY')}</div>
                                    </div>
                                    <div className={classes.padding}>
                                        <span className={classes.titleNonUpperCase}>Repair Order:</span><span className={classnames(classes.uppercase, classes.textSmaller)}> total/tax </span>
                                        <span>${item.totalPrice.toFixed(2)} / $0.00</span>
                                    </div>
                                </div>
                                <div className={classes.greyRow}></div>
                                <div className={classes.orderMainData}>
                                    <div className={classes.orderMainDataLeft}>
                                        <div className={classes.orderMainDataLeftTop}>
                                            <div className={classes.smallPadding}>
                                                <div className={classes.titleNonUpperCase}>RO Status:</div>
                                                <div>{item.status}</div>
                                            </div>
                                            <div className={classes.smallPadding}>
                                                <div className={classes.titleNonUpperCase}>Mileage:</div>
                                                <div>{item.mileage}</div>
                                            </div>
                                            <div className={classes.smallPadding}>
                                                <div className={classes.titleNonUpperCase}>Advisor:</div>
                                                <div>{item.advisor}</div>
                                            </div>
                                            <div className={classes.smallPadding}>
                                                <div className={classes.titleNonUpperCase}>Tech Labor Time:</div>
                                                <div>{item.technicianLaborTime}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.orderMainDataRightTop}>
                                        <div className={classes.smallPadding}>
                                            <span className={classes.titleNonUpperCase}>Warranty: </span><span className={classnames(classes.uppercase, classes.textSmaller)}> total/tax</span>
                                            <div>${item.warrantyPrice.toFixed(2)} / $0.00</div>
                                        </div>
                                        <div className={classes.smallPadding}>
                                            <span className={classes.titleNonUpperCase}>Customer Pay: </span><span className={classnames(classes.uppercase, classes.textSmaller)}> total/tax</span>
                                            <div>${item.customerPayPrice.toFixed(2)} / $0.00</div>
                                        </div>
                                        <div className={classes.smallPadding}>
                                            <span className={classes.titleNonUpperCase}>Misc: </span><span className={classnames(classes.uppercase, classes.textSmaller)}> total/tax</span>
                                            <div>${item.miscPrice.toFixed(2)} / $0.00</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.orderMainData}>
                                    <div className={classnames(classes.borderRight, classes.padding)}>
                                        <div className={classes.titleNonUpperCase}>Services Performed:</div>
                                        <ol>
                                            {item.services.map(service => {
                                                return <li key={service.correction} className={classes.serviceItem}>
                                                    <div><span className={classes.italic}>Complaint: </span>{service.complaint}</div>
                                                    <div><span className={classes.italic}>Correction: </span>{service.correction}</div>
                                                    <div><span className={classes.italic}>Cause: </span>{service.cause}</div>
                                                    <div className={classes.titleNonUpperCase}>Labors:</div>
                                                    <ul>
                                                        {service.labors.map(item => {
                                                            return <li key={item.title}>
                                                                <div><span>[Tech {item.technicianId} {item.technicianName}]</span> <span className={classes.titleNonUpperCase}>{item.title}</span></div>
                                                                <div><span className={classes.italic}>Description: </span> {item.description}</div>
                                                            </li>
                                                        })}
                                                    </ul>
                                                </li>
                                            })}
                                        </ol>
                                    </div>
                                    <div className={classes.padding}>
                                        <div className={classes.titleNonUpperCase}>Parts Used:</div>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <HCell align="center" key='Part number'>Part number</HCell>
                                                    <HCell key='description'>Description</HCell>
                                                    <HCell key='Quantity'>Quantity</HCell>
                                                    <HCell key='Part price'>Part price, $</HCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {item.parts.map((part, index) => {
                                                    return <TableRow key={index}>
                                                        <TCell><span className={classes.titleNonUpperCase}>{index + 1}.</span> {part.id}</TCell>
                                                        <TCell>{part.description}</TCell>
                                                        <TCell>{part.qantity}</TCell>
                                                        <TCell>{part.price}</TCell>
                                                    </TableRow>
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                                <div className={classnames(classes.smallPadding, classes.borderTop)}>
                                    <div className={classes.titleNonUpperCase}>Comments:</div>
                                    {item.comments && item.comments.map(comment => <div>{comment}</div>)}
                                </div>
                            </div>)}
                            {repairHistoryPaging.numberOfPages > 1
                                ? <div className={classes.centered}>
                                    <Button
                                        variant="text"
                                        onClick={onLoadMore}
                                        style={{textTransform: 'none', color: 'blue', marginTop: 8}}>
                                        Load More
                                    </Button>
                                </div> : null}
                        </div>
                }
            </DialogContent>
        </BaseModal>
    );
};

export default VehicleRepairHistory;