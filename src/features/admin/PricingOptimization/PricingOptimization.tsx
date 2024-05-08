import React, {useEffect, useState} from 'react';
import {SquarePaper} from "../../../components/styled/Paper";
import {loadPricingCalculations} from "../../../store/reducers/pricingSettings/actions";
import {IAssignedServiceRequestShort} from "../../../store/reducers/serviceRequests/types";
import {useDispatch, useSelector} from "react-redux";
import {PaperTitle, TableContainer} from "../../../pages/admin/PricingSettings/UI";
import {Box, Divider, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {mappedCalculationsSelector} from "../../../store/reducers/pricingSettings/selectors";
import {
    demandCategories,
    EDay,
    EDemandCategory,
    EPricingDisplayType
} from "../../../store/reducers/pricingSettings/types";
import { Autocomplete } from '@mui/material';
import {TextField} from "../../../components/styled/EndUserInputs";
import {KeyboardArrowDown} from "@mui/icons-material";
import {loadSCRequestsShort} from "../../../store/reducers/serviceRequests/actions";
import {RootState} from "../../../store/rootReducer";
import {TableWrapper, Label, Title} from "./styles";
import {DenseTable} from "../../../components/styled/DemandTable";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {TEnumMap} from "../../../store/reducers/types";
import dayjs from "dayjs";
import MaxPriceDateRange from "../MaxPriceDateRange/MaxPriceDateRange";

const fieldStyles = {padding: "4px 10px", border: 0, fontWeight: 400}

export const PricingOptimization = () => {
    const [sr, setSr] = useState<IAssignedServiceRequestShort|null>(null);
    const [demand, setDemand] = useState<TEnumMap<EDemandCategory>|null>({id: EDemandCategory.Average, label: "Average"});
    const dispatch = useDispatch();
    const data = useSelector(mappedCalculationsSelector);
    const srList = useSelector((state: RootState) => state.serviceRequests.scRequestsShort);
    const {selectedSC} = useSCs();
    const showError = useException();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadSCRequestsShort(selectedSC.id, EPricingDisplayType.Dynamic));
        }
    }, [selectedSC, dispatch]);

    useEffect(() => {
        if (sr) {
            try {
                dispatch(loadPricingCalculations(sr.id, demand?.id));
            } catch (e) {
                showError(e);
            }
        }
    }, [sr, demand, dispatch, showError]);

    const handleChange = (e: any, value: IAssignedServiceRequestShort|null) => {
        setSr(value);
    }
    const handleDemandChange = (e: any, value: TEnumMap<EDemandCategory>|null) => {
        setDemand(value);
    }

    return (
        <div>
            <MaxPriceDateRange/>
            <SquarePaper variant="outlined">
                <Title>Check Pricing</Title>
                <Divider />
                <Box display="flex" flexWrap={"wrap"}>
                    <Box p={2} width={300}>
                        <Label style={{color: "#252733"}} htmlFor="serviceRequest">
                            Select Service Request
                        </Label>
                        <Autocomplete
                            style={{marginTop: 4}}
                            id="serviceRequest"
                            popupIcon={<KeyboardArrowDown/>}
                            onChange={handleChange}
                            options={srList}
                            value={sr}
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            getOptionLabel={option => option.code}
                            renderInput={params => <TextField {...{
                                ...params, InputProps: {
                                    ...params.InputProps,
                                    disableUnderline: true,
                                    style: fieldStyles,
                                    placeholder: "Select here"
                                }
                            }} placeholder="Select here"/>}
                        />
                    </Box>
                    <Box p={2} width={300}>
                        <Label style={{color: "#252733"}} htmlFor="timeOfYear">
                            Select time of year
                        </Label>
                        <Autocomplete
                            id="timeOfYear"
                            style={{marginTop: 4}}
                            popupIcon={<KeyboardArrowDown/>}
                            value={demand}
                            onChange={handleDemandChange}
                            options={demandCategories}
                            getOptionLabel={option => option.label}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={params => <TextField {...{
                                ...params, InputProps: {
                                    ...params.InputProps,
                                    disableUnderline: true,
                                    style: fieldStyles,
                                    placeholder: "Select here"
                                }
                            }} placeholder="Select here"/>}
                        />
                    </Box>
                </Box>
                <Box mt={2} ml={2}>
                    <PaperTitle noPadding>time of day</PaperTitle>
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
                                {dayjs.weekdays().map((wd, idx) => {
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
        </div>
    );
};