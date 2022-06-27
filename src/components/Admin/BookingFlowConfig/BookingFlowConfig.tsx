import React, {useEffect, useMemo, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {SquarePaper} from "../../UI/Paper";
import {TableContainer} from "../../Optimizer/PricingSettings/UI";
import {Box, Button, Switch, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {DenseTable} from "../../Optimizer/AppointmentAllocation/UI";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {EServiceTypeBookingFlow, TServiceTypeSettings} from "../../../store/reducers/bookingFlowConfig/types";
import {RootState} from "../../../store/rootReducer";
import {LoadingButton} from "../../UI/Button";
import {loadBookingFlowConfig, updateBookingFlowConfig} from "../../../store/reducers/bookingFlowConfig/actions";
import {Loading} from "../../UI/Loading";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";

const useStyles = makeStyles(theme => ({
    switchCell: {
        fontSize: "12px !important",
        padding: "2px 12px !important"
    },
    tableWrapper: {
        overflowX: "auto",
        width: "100%",
        "& .MuiTableCell-root": {
            [theme.breakpoints.down("xs")]: {
                fontSize: "12px !important"
            }
        }
    },
    headerCell: {
        [theme.breakpoints.down("xs")]: {
            fontSize: "12px !important"
        }
    },
    serviceTypeCell: {
        fontSize: "20px !important",
        fontWeight: "bold",
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 14,
    },
    cancelButton: {
        color: '#9FA2B4',
        marginRight: 20,
        border: 'none',
        outline: 'none',
    },
    saveButton: {
        background: '#7898FF',
        color: 'white',
        border: '1px solid #7898FF',
        outline: 'none',
        '&:hover': {
            color: '#7898FF'
        }
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
    },
}));

const BookingFlowConfig = () => {
    const [configuration, setConfiguration] = useState<TServiceTypeSettings[]>([]);
    const {config, isLoading} = useSelector((state: RootState) => state.bookingFlowConfig);
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();
    const classes = useStyles();
    const dispatch = useDispatch();
    const visitCenterConfig = useMemo(() => configuration.find(item => item.serviceType === EServiceTypeBookingFlow.VisitCenter), [configuration])
    const mobileServiceConfig = useMemo(() => configuration.find(item => item.serviceType === EServiceTypeBookingFlow.MobileService), [configuration])
    const pickUpDropOffConfig = useMemo(() => configuration.find(item => item.serviceType === EServiceTypeBookingFlow.PickUpDropOff), [configuration])

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadBookingFlowConfig(selectedSC.id))
        }
    }, [dispatch, selectedSC]);

    useEffect(() => {
        setConfiguration(config)
    }, [config])

    const onCheck = (serviceType: EServiceTypeBookingFlow, optionType: keyof TServiceTypeSettings) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        if (!selectedSC?.isValueServiceAvailable && optionType === 'valueService') {
            return showError('No Service Offers are available for current Service Center')
        } else {
            let analogServiceType: TServiceTypeSettings|undefined = undefined;
            const currentServiceType = configuration.find(item => item.serviceType === serviceType);

            if (currentServiceType) {
                const updated = {...currentServiceType, [optionType]: checked};
                if (optionType === 'valueService' && !checked) {
                    updated.productPageForValueService = false;
                }
                setConfiguration(prev => {
                    const filtered = prev.filter(el => el.serviceType !== serviceType);
                    return [...filtered, updated]
                })

                if (optionType === 'valueService' || optionType === 'productPageForValueService') {
                    if (currentServiceType?.serviceType === EServiceTypeBookingFlow.VisitCenter) {
                        analogServiceType = configuration.find(item => item.serviceType === EServiceTypeBookingFlow.PickUpDropOff);
                    } else if (currentServiceType.serviceType === EServiceTypeBookingFlow.PickUpDropOff) {
                        analogServiceType = configuration.find(item => item.serviceType === EServiceTypeBookingFlow.VisitCenter);
                    }
                    if (analogServiceType) {
                        const updatedAnalog = {...analogServiceType, [optionType]: checked};
                        setConfiguration(prev => {
                            const filtered = prev.filter(el => el.serviceType !== analogServiceType?.serviceType);
                            return [...filtered, updatedAnalog]
                        })
                    }
                }
            }
        }
    }

    const onCancel = () => {
        setConfiguration(config);
    }

    const onSuccess = () => showMessage('Updated Booking Flow Configuration')

    const onError = (err: string) => showError(err);

    const onSave = () => {
        if (selectedSC) {
            dispatch(updateBookingFlowConfig(selectedSC.id, configuration, onSuccess, onError))
        }
    }

    return <div>
        <TitleContainer title="Booking Flow Configuration" pad={true}/>
        <SquarePaper variant="outlined">
            <TableContainer>
                <div className={classes.tableWrapper}>
                    {isLoading
                        ? <div style={{width: '80vw', height: "40vh"}}><Loading/></div>
                        : <DenseTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.headerCell} width={200}>Service Option</TableCell>
                                    <TableCell className={classes.headerCell} align="center"
                                               width={200}>Available</TableCell>
                                    <TableCell className={classes.headerCell} align="center" width={200}>Value
                                        Service</TableCell>
                                    <TableCell className={classes.headerCell} align="center" width={200}>Product Page
                                        for Value Service</TableCell>
                                    <TableCell className={classes.headerCell} align="center" width={200}>Select Advisor
                                        Page</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell className={classes.serviceTypeCell}>Visit Center</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceTypeBookingFlow.VisitCenter, 'available')}
                                            disabled={true}
                                            checked
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceTypeBookingFlow.VisitCenter, 'valueService')}
                                            checked={visitCenterConfig?.valueService}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceTypeBookingFlow.VisitCenter, 'productPageForValueService')}
                                            disabled={!visitCenterConfig?.valueService}
                                            checked={visitCenterConfig?.productPageForValueService}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceTypeBookingFlow.VisitCenter, 'advisorSelection')}
                                            checked={visitCenterConfig?.advisorSelection}
                                            color="primary"/>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.serviceTypeCell}>Mobile Service</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceTypeBookingFlow.MobileService, 'available')}
                                            checked={mobileServiceConfig?.available}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceTypeBookingFlow.MobileService, 'valueService')}
                                            disabled={!mobileServiceConfig?.available}
                                            checked={mobileServiceConfig?.valueService}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceTypeBookingFlow.MobileService, 'productPageForValueService')}
                                            disabled={!mobileServiceConfig?.valueService
                                            || !mobileServiceConfig?.available}
                                            checked={mobileServiceConfig?.productPageForValueService}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceTypeBookingFlow.MobileService, 'advisorSelection')}
                                            checked={mobileServiceConfig?.advisorSelection}
                                            disabled={true}
                                            color="primary"/>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.serviceTypeCell}>Pick Up / Drop Off</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceTypeBookingFlow.PickUpDropOff, 'available')}
                                            checked={pickUpDropOffConfig?.available}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceTypeBookingFlow.PickUpDropOff, 'valueService')}
                                            disabled={!pickUpDropOffConfig?.available}
                                            checked={pickUpDropOffConfig?.valueService}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceTypeBookingFlow.PickUpDropOff, 'productPageForValueService')}
                                            disabled={!pickUpDropOffConfig?.valueService
                                            || !pickUpDropOffConfig?.available}
                                            checked={pickUpDropOffConfig?.productPageForValueService}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceTypeBookingFlow.PickUpDropOff, 'advisorSelection')}
                                            disabled={!pickUpDropOffConfig?.available}
                                            checked={pickUpDropOffConfig?.advisorSelection}
                                            color="primary"/>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </DenseTable>}
                </div>
                <Box mt={2}>
                    <div className={classes.wrapper}>
                        <div className={classes.buttonsWrapper}>
                            <Button
                                onClick={onCancel}
                                className={classes.cancelButton}>
                                Cancel
                            </Button>
                            <LoadingButton
                                loading={isLoading}
                                onClick={onSave}
                                className={classes.saveButton}>
                                Save
                            </LoadingButton>
                        </div>
                    </div>
                </Box>
            </TableContainer>
        </SquarePaper>
    </div>
};

export default BookingFlowConfig;