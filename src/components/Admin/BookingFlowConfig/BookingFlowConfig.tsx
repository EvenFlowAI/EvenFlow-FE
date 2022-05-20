import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {SquarePaper} from "../../UI/Paper";
import {PaperTitle, TableContainer} from "../../Optimizer/PricingSettings/UI";
import {Box, Button, Divider, Switch, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {DenseTable} from "../../Optimizer/AppointmentAllocation/UI";
import {useException, useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {IBookingFlowConfig, TServiceSettings} from "../../../store/reducers/bookingFlowConfig/types";
import {RootState} from "../../../store/rootReducer";
import {LoadingButton} from "../../UI/Button";
import {loadBookingFlowConfig, updateBookingFlowConfig} from "../../../store/reducers/bookingFlowConfig/actions";

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

const initialData: IBookingFlowConfig = {
    visitCenter: {
        available: true,
        valueService: true,
        productPageForValueService: false,
        advisorSelection: true,
    },
    mobileService: {
        available: true,
        valueService: true,
        productPageForValueService: false,
        advisorSelection: false,
    },
    pickUpDropOff: {
        available: true,
        valueService: true,
        productPageForValueService: false,
        advisorSelection: true,
    }
}

const BookingFlowConfig = () => {
    const [configuration, setConfiguration] = useState<IBookingFlowConfig>(initialData);
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

    const onCheck = (serviceType: keyof IBookingFlowConfig, optionType: keyof TServiceSettings) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setConfiguration(prev => {
            return {...prev, [serviceType]: {...prev[serviceType], [optionType]: checked}}
        })
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
                <DenseTable>
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
                                    onChange={onCheck('visitCenter', 'available')}
                                    disabled={true}
                                    checked
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('visitCenter', 'valueService')}
                                    checked={configuration.visitCenter.valueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('visitCenter', 'productPageForValueService')}
                                    disabled={!configuration.visitCenter.valueService}
                                    checked={configuration.visitCenter.productPageForValueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('visitCenter', 'advisorSelection')}
                                    checked={configuration.visitCenter.advisorSelection}
                                    color="primary"/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.serviceTypeCell}>Mobile Service</TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('mobileService', 'available')}
                                    checked={configuration.mobileService.available}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('mobileService', 'valueService')}
                                    checked={configuration.mobileService.valueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('mobileService', 'productPageForValueService')}
                                    disabled={!configuration.mobileService.valueService}
                                    checked={configuration.mobileService.productPageForValueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('mobileService', 'advisorSelection')}
                                    checked={configuration.mobileService.advisorSelection}
                                    disabled={true}
                                    color="primary"/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.serviceTypeCell}>Pick Up / Drop Off</TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('pickUpDropOff', 'available')}
                                    checked={configuration.pickUpDropOff.available}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('pickUpDropOff', 'valueService')}
                                    checked={configuration.pickUpDropOff.valueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('pickUpDropOff', 'productPageForValueService')}
                                    disabled={!configuration.pickUpDropOff.valueService}
                                    checked={configuration.pickUpDropOff.productPageForValueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('pickUpDropOff', 'advisorSelection')}
                                    checked={configuration.pickUpDropOff.advisorSelection}
                                    color="primary"/>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </DenseTable>
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