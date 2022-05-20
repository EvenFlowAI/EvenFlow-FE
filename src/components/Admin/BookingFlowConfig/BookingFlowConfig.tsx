import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {SquarePaper} from "../../UI/Paper";
import {PaperTitle, TableContainer} from "../../Optimizer/PricingSettings/UI";
import {Box, Divider, Switch, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {DenseTable} from "../../Optimizer/AppointmentAllocation/UI";
import {useException, useSCs} from "../../../utils/hooks";
import {useDispatch} from "react-redux";
import {Caption} from "../../UI/Caption";
import {TextLink} from "../../UI/TextLink";
import {Routes} from "../../../config/routes";

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
    }
}));

type TServiceSettings = {
    available: boolean;
    valueService: boolean;
    productPageForValueService: boolean;
    advisorSelection: boolean;
}

interface IBookingFlowConfig {
    visitCenter: TServiceSettings;
    mobileService: TServiceSettings;
    pickUpDropOff: TServiceSettings;
}

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
    const [saving, setSaving] = useState<boolean>(false);
    const [config, setConfig] = useState<IBookingFlowConfig>(initialData);
    const {selectedSC} = useSCs();
    const showError = useException();
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) {
            // todo get config
        }
    }, [dispatch, selectedSC]);

    const onCheck = (serviceType: keyof IBookingFlowConfig, optionType: keyof TServiceSettings) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setConfig(prev => {
            return {...prev, [serviceType]: {...prev[serviceType], [optionType]: checked}}
        })
    }

    return <SquarePaper variant="outlined">
        <PaperTitle>Booking Flow Configuration</PaperTitle>
        <Divider />
        <TableContainer>
            <div className={classes.tableWrapper}>
                <DenseTable>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.headerCell}>Service Option</TableCell>
                            <TableCell className={classes.headerCell} align="center">Available</TableCell>
                            <TableCell className={classes.headerCell} align="center">Value Service</TableCell>
                            <TableCell className={classes.headerCell} align="center">Product Page for Value Service</TableCell>
                            <TableCell className={classes.headerCell} align="center">Select Advisor Page</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell className={classes.headerCell}>Visit Center</TableCell>
                            <TableCell>
                                <Switch
                                    onChange={onCheck('visitCenter', 'available')}
                                    disabled={true}
                                    checked
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('visitCenter', 'valueService')}
                                    checked={config.visitCenter.valueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('visitCenter', 'productPageForValueService')}
                                    disabled={!config.visitCenter.valueService}
                                    checked={config.visitCenter.productPageForValueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('visitCenter', 'advisorSelection')}
                                    checked={config.visitCenter.advisorSelection}
                                    color="primary"/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.headerCell} align="center">Mobile Service</TableCell>
                            <TableCell>
                                <Switch
                                    onChange={onCheck('mobileService', 'available')}
                                    checked={config.mobileService.available}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('mobileService', 'valueService')}
                                    checked={config.mobileService.valueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('mobileService', 'productPageForValueService')}
                                    disabled={!config.mobileService.valueService}
                                    checked={config.mobileService.productPageForValueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('mobileService', 'advisorSelection')}
                                    checked={config.mobileService.advisorSelection}
                                    disabled={true}
                                    color="primary"/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.headerCell} align="center">Pick Up / Drop Off</TableCell>
                            <TableCell>
                                <Switch
                                    onChange={onCheck('pickUpDropOff', 'available')}
                                    checked={config.pickUpDropOff.available}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('pickUpDropOff', 'valueService')}
                                    checked={config.pickUpDropOff.valueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('pickUpDropOff', 'productPageForValueService')}
                                    disabled={!config.pickUpDropOff.valueService}
                                    checked={config.pickUpDropOff.productPageForValueService}
                                    color="primary"/>
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    onChange={onCheck('pickUpDropOff', 'advisorSelection')}
                                    checked={config.pickUpDropOff.advisorSelection}
                                    color="primary"/>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </DenseTable>
            </div>
            <Box mt={2}>
                <Caption
                    title={<span>
                        You can edit the Demand segment values on <TextLink to={Routes.Optimizer.AppointmentAllocation}>
                            Appointment Allocation
                        </TextLink> page
                    </span>}
                />
            </Box>
        </TableContainer>
    </SquarePaper>
};

export default BookingFlowConfig;