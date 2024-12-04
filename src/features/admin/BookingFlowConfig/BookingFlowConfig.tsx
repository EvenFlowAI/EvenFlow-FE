import React, {useEffect, useMemo, useState} from 'react';
import {SquarePaper} from "../../../components/styled/Paper";
import {TableContainer} from "../../../pages/admin/ServicePricingSettings/UI";
import {Box, Button, Switch, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {TServiceTypeSettings} from "../../../store/reducers/bookingFlowConfig/types";
import {RootState} from "../../../store/rootReducer";
import {loadBookingFlowConfig, updateBookingFlowConfig} from "../../../store/reducers/bookingFlowConfig/actions";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {useStyles} from "./styles";
import {DenseTable} from "../../../components/styled/DemandTable";
import {LoadingButton} from "../../../components/buttons/LoadingButton/LoadingButton";

import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {ETransportationType} from "../../../store/reducers/transportationNeeds/types";

export const BookingFlowConfig = () => {
    const {config, isLoading} = useSelector((state: RootState) => state.bookingFlowConfig);
    const { options } = useSelector((state: RootState) => state.transportation);
    const [configuration, setConfiguration] = useState<TServiceTypeSettings[]>([]);
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();
    const { classes  } = useStyles();
    const dispatch = useDispatch();
    const visitCenterConfig = useMemo(() => configuration.find(item => item.serviceType === EServiceType.VisitCenter), [configuration])
    const mobileServiceConfig = useMemo(() => configuration.find(item => item.serviceType === EServiceType.MobileService), [configuration])
    const pickUpDropOffConfig = useMemo(() => configuration.find(item => item.serviceType === EServiceType.PickUpDropOff), [configuration])

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadBookingFlowConfig(selectedSC.id))
        }
    }, [dispatch, selectedSC]);

    useEffect(() => {
        setConfiguration(config)
    }, [config])

    const isValid = (optionType: keyof TServiceTypeSettings): boolean => {
        if ((optionType === 'checkRecallsExisting' || optionType === 'checkRecallsNew') && !selectedSC?.recallServiceRequestId) {
            showError('To enable Checking Recalls you need to select Default Recall Op Code');
            return false;
        }
        if (!selectedSC?.isValueServiceAvailable && optionType === 'valueService') {
            showError('No Service Offers are available for current Service Center')
            return false;
        }
        return true;
    }

    const onCheck = (serviceType: EServiceType, optionType: keyof TServiceTypeSettings) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        if (isValid(optionType)) {
            let analogServiceType: TServiceTypeSettings|undefined = undefined;
            const currentServiceType = configuration.find(item => item.serviceType === serviceType);

            if (currentServiceType) {
                const updated = {...currentServiceType, [optionType]: checked};
                if (optionType === 'valueService' && !checked) {
                    updated.productPageForValueService = false;
                }
                const pickUpTransportationIsOn = options.find(el => el.type === ETransportationType.PickUpDelivery)?.state
                if (optionType === "available" && serviceType === EServiceType.PickUpDropOff && pickUpTransportationIsOn && !checked) {
                    showError('Other Transportation Pick Up delivery must be "OFF"')
                } else {
                    setConfiguration(prev => {
                        const filtered = prev.filter(el => el.serviceType !== serviceType);
                        return [...filtered, updated]
                    })
                }
                if (optionType === 'valueService' || optionType === 'productPageForValueService') {
                    if (currentServiceType?.serviceType === EServiceType.VisitCenter) {
                        analogServiceType = configuration.find(item => item.serviceType === EServiceType.PickUpDropOff);
                    } else if (currentServiceType.serviceType === EServiceType.PickUpDropOff) {
                        analogServiceType = configuration.find(item => item.serviceType === EServiceType.VisitCenter);
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

    const onSuccess = () => showMessage('Booking Flow Configuration updated')

    const onError = (err: string) => showError(err);

    const onSave = () => {
        if (selectedSC) {
            dispatch(updateBookingFlowConfig(selectedSC.id, configuration, onSuccess, onError))
        }
    }

    return <SquarePaper variant="outlined">
            <TableContainer>
                <div className={classes.tableWrapper}>
                    {isLoading
                        ? <Loading/>
                        : <DenseTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.headerCell} width={200} key="1">Service Option</TableCell>
                                    <TableCell className={classes.headerCell} align="center"
                                               width={200} key="2">Visit Center</TableCell>
                                    <TableCell className={classes.headerCell} align="center" width={200} key="3">Mobile Service</TableCell>
                                    <TableCell className={classes.headerCell} align="center" width={200} key="4">Pick Up / Drop Off</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell className={classes.serviceTypeCell}>Available</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.VisitCenter, 'available')}
                                            disabled={true}
                                            checked
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.MobileService, 'available')}
                                            checked={Boolean(mobileServiceConfig?.available)}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.PickUpDropOff, 'available')}
                                            checked={Boolean(pickUpDropOffConfig?.available)}
                                            color="primary"/>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.serviceTypeCell}>Value Service</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.VisitCenter, 'valueService')}
                                            checked={Boolean(visitCenterConfig?.valueService)}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.MobileService, 'valueService')}
                                            disabled={!mobileServiceConfig?.available}
                                            checked={Boolean(mobileServiceConfig?.valueService)}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.PickUpDropOff, 'valueService')}
                                            disabled={!pickUpDropOffConfig?.available}
                                            checked={Boolean(pickUpDropOffConfig?.valueService)}
                                            color="primary"/>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.serviceTypeCell}>Product Page for Value Service</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.VisitCenter, 'productPageForValueService')}
                                            disabled={!visitCenterConfig?.valueService}
                                            checked={Boolean(visitCenterConfig?.productPageForValueService)}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.MobileService, 'productPageForValueService')}
                                            disabled={!mobileServiceConfig?.valueService
                                            || !mobileServiceConfig?.available}
                                            checked={Boolean(mobileServiceConfig?.productPageForValueService)}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.PickUpDropOff, 'productPageForValueService')}
                                            disabled={!pickUpDropOffConfig?.valueService
                                            || !pickUpDropOffConfig?.available}
                                            checked={Boolean(pickUpDropOffConfig?.productPageForValueService)}
                                            color="primary"/>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.serviceTypeCell}>Advisor Selection</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.VisitCenter, 'advisorSelection')}
                                            checked={Boolean(visitCenterConfig?.advisorSelection)}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.MobileService, 'advisorSelection')}
                                            checked={Boolean(mobileServiceConfig?.advisorSelection)}
                                            disabled={true}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.PickUpDropOff, 'advisorSelection')}
                                            disabled={!pickUpDropOffConfig?.available}
                                            checked={Boolean(pickUpDropOffConfig?.advisorSelection)}
                                            color="primary"/>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.serviceTypeCell}>Engine Type</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.VisitCenter, 'engineType')}
                                            checked={Boolean(visitCenterConfig?.engineType)}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            disabled={!mobileServiceConfig?.available}
                                            onChange={onCheck(EServiceType.MobileService, 'engineType')}
                                            checked={Boolean(mobileServiceConfig?.engineType)}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.PickUpDropOff, 'engineType')}
                                            disabled={!pickUpDropOffConfig?.available}
                                            checked={Boolean(pickUpDropOffConfig?.engineType)}
                                            color="primary"/>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.serviceTypeCell}>Appointment Selection</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.VisitCenter, 'appointmentSelection')}
                                            checked={Boolean(visitCenterConfig?.appointmentSelection)}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            disabled={!mobileServiceConfig?.available}
                                            onChange={onCheck(EServiceType.MobileService, 'appointmentSelection')}
                                            checked={Boolean(mobileServiceConfig?.appointmentSelection)}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.PickUpDropOff, 'appointmentSelection')}
                                            checked={Boolean(pickUpDropOffConfig?.appointmentSelection)}
                                            disabled={!pickUpDropOffConfig?.available}
                                            color="primary"/>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.serviceTypeCell}>Transportation Needs</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.VisitCenter, 'transportationNeeds')}
                                            checked={Boolean(visitCenterConfig?.transportationNeeds)}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            disabled
                                            onChange={onCheck(EServiceType.MobileService, 'transportationNeeds')}
                                            checked={Boolean(mobileServiceConfig?.transportationNeeds)}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.PickUpDropOff, 'transportationNeeds')}
                                            checked={Boolean(pickUpDropOffConfig?.transportationNeeds)}
                                            disabled
                                            color="primary"/>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.serviceTypeCell}>Check Open Recalls Existing Customers</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.VisitCenter, 'checkRecallsExisting')}
                                            checked={Boolean(visitCenterConfig?.checkRecallsExisting)}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.MobileService, 'checkRecallsExisting')}
                                            checked={Boolean(mobileServiceConfig?.checkRecallsExisting)}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.PickUpDropOff, 'checkRecallsExisting')}
                                            checked={Boolean(pickUpDropOffConfig?.checkRecallsExisting)}
                                            color="primary"/>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.serviceTypeCell}>Check Open Recalls New Customers</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.VisitCenter, 'checkRecallsNew')}
                                            checked={Boolean(visitCenterConfig?.checkRecallsNew)}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.MobileService, 'checkRecallsNew')}
                                            checked={Boolean(mobileServiceConfig?.checkRecallsNew)}
                                            color="primary"/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            onChange={onCheck(EServiceType.PickUpDropOff, 'checkRecallsNew')}
                                            checked={Boolean(pickUpDropOffConfig?.checkRecallsNew)}
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
};