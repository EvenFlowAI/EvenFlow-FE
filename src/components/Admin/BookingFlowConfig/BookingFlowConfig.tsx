import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {SquarePaper} from "../../UI/Paper";
import {PaperTitle, TableContainer} from "../../Optimizer/PricingSettings/UI";
import {Box, Button, Divider, Switch, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {DenseTable} from "../../Optimizer/AppointmentAllocation/UI";
import {useException, useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {EServiceTypeBookingFlow, TServiceTypeSettings} from "../../../store/reducers/bookingFlowConfig/types";
import {RootState} from "../../../store/rootReducer";
import {LoadingButton} from "../../UI/Button";
import {loadBookingFlowConfig, updateBookingFlowConfig} from "../../../store/reducers/bookingFlowConfig/actions";
import {Loading} from "../../UI/Loading";

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
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadBookingFlowConfig(selectedSC.id))
        }
    }, [dispatch, selectedSC]);

    useEffect(() => {
        setConfiguration(config)
    }, [config])

    const onCheck = (serviceType: EServiceTypeBookingFlow, optionType: keyof TServiceTypeSettings) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const currentServiceType = configuration.find(item => item.serviceType === serviceType);
        if (currentServiceType) {
            const updated = {...currentServiceType, [optionType]: checked};
            setConfiguration(prev => {
                const filtered = prev.filter(el =>el.serviceType !== serviceType);
                return [...filtered, updated]
            })
        }
    }

    const onCancel = () => {
        setConfiguration(config);
    }

    const onSave = () => {
        if (selectedSC) {
            dispatch(updateBookingFlowConfig(selectedSC.id, configuration))
        }
    }

    return <SquarePaper variant="outlined">
        <PaperTitle>Booking Flow Configuration</PaperTitle>
        <Divider />
        <TableContainer>
            <div className={classes.tableWrapper}>
                {!configuration?.length
                    ? <Loading/>
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
                                    checked={configuration.find(item => item.serviceType === EServiceTypeBookingFlow.VisitCenter)?.valueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck(EServiceTypeBookingFlow.VisitCenter, 'productPageForValueService')}
                                    disabled={!configuration.find(item => item.serviceType === EServiceTypeBookingFlow.VisitCenter)?.valueService}
                                    checked={configuration.find(item => item.serviceType === EServiceTypeBookingFlow.VisitCenter)?.productPageForValueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck(EServiceTypeBookingFlow.VisitCenter, 'advisorSelection')}
                                    checked={configuration.find(item => item.serviceType === EServiceTypeBookingFlow.VisitCenter)?.advisorSelection}
                                    color="primary"/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.serviceTypeCell}>Mobile Service</TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck(EServiceTypeBookingFlow.MobileService, 'available')}
                                    checked={configuration.find(item => item.serviceType === EServiceTypeBookingFlow.MobileService)?.available}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck(EServiceTypeBookingFlow.MobileService, 'valueService')}
                                    checked={configuration.find(item => item.serviceType === EServiceTypeBookingFlow.MobileService)?.valueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck(EServiceTypeBookingFlow.MobileService, 'productPageForValueService')}
                                    disabled={!configuration.find(item => item.serviceType === EServiceTypeBookingFlow.MobileService)?.valueService}
                                    checked={configuration.find(item => item.serviceType === EServiceTypeBookingFlow.MobileService)?.productPageForValueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck(EServiceTypeBookingFlow.MobileService, 'advisorSelection')}
                                    checked={configuration.find(item => item.serviceType === EServiceTypeBookingFlow.MobileService)?.advisorSelection}
                                    disabled={true}
                                    color="primary"/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.serviceTypeCell}>Pick Up / Drop Off</TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck(EServiceTypeBookingFlow.PickUpDropOff, 'available')}
                                    checked={configuration.find(item => item.serviceType === EServiceTypeBookingFlow.PickUpDropOff)?.available}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck(EServiceTypeBookingFlow.PickUpDropOff, 'valueService')}
                                    checked={configuration.find(item => item.serviceType === EServiceTypeBookingFlow.PickUpDropOff)?.valueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck(EServiceTypeBookingFlow.PickUpDropOff, 'productPageForValueService')}
                                    disabled={!configuration.find(item => item.serviceType === EServiceTypeBookingFlow.PickUpDropOff)?.valueService}
                                    checked={configuration.find(item => item.serviceType === EServiceTypeBookingFlow.PickUpDropOff)?.productPageForValueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck(EServiceTypeBookingFlow.PickUpDropOff, 'advisorSelection')}
                                    checked={configuration.find(item => item.serviceType === EServiceTypeBookingFlow.PickUpDropOff)?.advisorSelection}
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
        }
    </SquarePaper>
};

export default BookingFlowConfig;