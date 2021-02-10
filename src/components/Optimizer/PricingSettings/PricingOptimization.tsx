import React, {useEffect, useState} from 'react';
import {SquarePaper} from "../../UI/Paper";
import {loadPricingCalculations} from "../../../store/reducers/pricingSettings/actions";
import {IAssignedServiceRequestShort} from "../../../store/reducers/serviceRequests/types";
import {useDispatch, useSelector} from "react-redux";
import {PaperTitle, TableContainer} from "./UI";
import {Box, Divider, styled, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {DenseTable} from "../AppointmentAllocation/UI";
import moment from "moment";
import {mappedCalculationsSelector} from "../../../store/reducers/pricingSettings/selectors";
import {EDay} from "../../../store/reducers/pricingSettings/types";
import {Autocomplete} from "@material-ui/lab";
import {TextField} from "../../UI/EndUserInputs";
import {Label} from "../../AppointmentFlow/UI";
import {KeyboardArrowDown} from "@material-ui/icons";
import {useException, useSCs} from "../../../utils/hooks";
import {loadSCRequestsShort} from "../../../store/reducers/serviceRequests/actions";
import {RootState} from "../../../store/rootReducer";

const TableWrapper = styled("div")(({theme}) => ({
    width: "100%",
    overflowX: "auto",
    "& .MuiTableCell-root": {
        [theme.breakpoints.down("xs")]: {
            fontSize: "10px !important"
        }
    }
}))

export const PricingOptimization = () => {
    const [sr, setSr] = useState<IAssignedServiceRequestShort|null>(null);
    const dispatch = useDispatch();
    const data = useSelector(mappedCalculationsSelector);
    const srList = useSelector((state: RootState) => state.serviceRequests.scRequestsShort);
    const {selectedSC} = useSCs();
    const showError = useException();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadSCRequestsShort(selectedSC.id));
        }
    }, [selectedSC, dispatch]);

    useEffect(() => {
        if (sr) {
            try {
                dispatch(loadPricingCalculations(sr.id));
            } catch (e) {
                showError(e);
            }
        }
    }, [sr, dispatch, showError]);

    const handleChange = (e: any, value: IAssignedServiceRequestShort|null) => {
        setSr(value);
    }

    return <SquarePaper variant="outlined">
        <PaperTitle>Check Pricing</PaperTitle>
        <Divider />
        <Box p={2} mt={1.5} width={300}>
            <Label style={{color: "#252733"}} htmlFor="serviceRequest">
                Select Service Request
            </Label>
            <Autocomplete
                id="serviceRequest"
                placeholder="Select here"
                popupIcon={<KeyboardArrowDown />}
                onChange={handleChange}
                options={srList}
                getOptionLabel={option => option.code}
                renderInput={params => <TextField {...{
                    ...params, InputProps: {
                        ...params.InputProps,
                        disableUnderline: true,
                        style: {padding: "4px 10px"}
                    }
                }} placeholder="Select here" />}
            />
        </Box>
        <Box mt={2} ml={2}>
            <PaperTitle noPadding>time of a day</PaperTitle>
        </Box>
        <TableContainer>
            <TableWrapper>
                <DenseTable>
                    <TableHead>
                        <TableRow>
                            <TableCell>Day</TableCell>
                            <TableCell width={"20%"} align="center">Low</TableCell>
                            <TableCell width={"20%"} align="center">Average</TableCell>
                            <TableCell width={"20%"} align="center">High</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {moment.weekdays().map((wd, idx) => {
                            return <TableRow key={wd}>
                                <TableCell>{wd}</TableCell>
                                <TableCell align="center">
                                    {data[idx as EDay]?.lowPrice
                                        ? Math.round(data[idx as EDay].lowPrice) + "$"
                                        : "-"}
                                </TableCell>
                                <TableCell align="center">
                                    {data[idx as EDay]?.averagePrice
                                        ? Math.round(data[idx as EDay].averagePrice) + "$"
                                        : "-"}
                                </TableCell>
                                <TableCell align="center">
                                    {data[idx as EDay]?.highPrice
                                        ? Math.round(data[idx as EDay].highPrice) + "$"
                                        : "-"}
                                </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </DenseTable>
            </TableWrapper>
        </TableContainer>
    </SquarePaper>
};