import React, {useEffect, useState} from 'react';
import {TableContainer} from "../UI";
import {useDispatch, useSelector} from "react-redux";
import {useException, useSCs} from "../../../../utils/hooks";
import {RootState} from "../../../../store/rootReducer";
import {
    changeSRPrisingDisplayType,
    loadSrList,
} from "../../../../store/reducers/pricingSettings/actions";
import {NoItemsLoading} from "../../../UI/NoItemsLoading";
import {styled, TableBody, TableHead, Radio, RadioGroup, FormControlLabel} from "@material-ui/core";
import {DemandTable, TableCell, TableRow} from "../../AppointmentAllocation/UI";
import {EPricingDisplayType} from "../../../../store/reducers/pricingSettings/types";


const headCellStyles = {
    fontSize: 12,
    lineHeight: "16px",
    color: "#9FA2B4"
}
const leftAlign = {
    textAlign: "left" as const
}

const TableWrapper = styled("div")(({theme}) => ({
    width: "100%",
    overflowX: "auto",
    "& .MuiTableCell-root": {
        [theme.breakpoints.down("xs")]: {
            fontSize: "10px !important",
            padding: "6px !important"
        }
    }
}))

export const ServiceCodes = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const srList = useSelector((state: RootState) => state.pricingSettings.srList);

    const showError = useException();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) {
            try {
                setLoading(true);
                dispatch(loadSrList(selectedSC.id));
            } finally {
                setLoading(false);
            }
        }
    }, [dispatch, selectedSC]);

    const handlePricingDisplayType = (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value && selectedSC) {
            dispatch(changeSRPrisingDisplayType(id, +e.target.value, selectedSC.id, e => showError(e)))
        }
    }

    return <TableContainer>
            <NoItemsLoading items={srList} loading={loading} />
            {srList.length ? <TableWrapper>
                <DemandTable>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                style={{...headCellStyles, ...leftAlign}}>
                                Service Ops Code
                            </TableCell>
                            <TableCell
                                width={330}
                                style={{...headCellStyles, ...leftAlign}}>
                                Description
                            </TableCell>
                            <TableCell style={headCellStyles}>Duration (hours)</TableCell>
                            <TableCell style={headCellStyles}>Number of technicians</TableCell>
                            <TableCell style={headCellStyles}>Skill level of technicians</TableCell>
                            <TableCell style={headCellStyles}>Pricing optimization status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {srList.map(el => {
                            return <TableRow key={el.id}>
                                <TableCell style={leftAlign}>{el.serviceRequest.code}</TableCell>
                                <TableCell style={leftAlign}>
                                    {el.serviceRequestOverride?.description
                                    || el.serviceRequest.description}
                                </TableCell>
                                <TableCell>
                                    {el.serviceRequestOverride?.durationInHours
                                    || el.serviceRequest.durationInHours}
                                </TableCell>
                                <TableCell>
                                    {el.serviceRequestOverride?.countOfTechnicians
                                    || el.serviceRequest.countOfTechnicians}
                                </TableCell>
                                <TableCell>
                                    {el.serviceRequestOverride?.skillLevelOfTechnicians
                                    || el.serviceRequest.skillLevelOfTechnicians}
                                </TableCell>

                                <TableCell>
                                    <RadioGroup
                                        value={el.pricingDisplayType}
                                        onChange={handlePricingDisplayType(el.id)}
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group">
                                        <FormControlLabel
                                            value={EPricingDisplayType.Suppressed}
                                            control={<Radio color="primary" size="small"/>}
                                            label="Suppressed" />
                                        <FormControlLabel
                                            value={EPricingDisplayType.Static}
                                            control={<Radio color="primary" size="small"/>}
                                            label="Static" />
                                        <FormControlLabel
                                            value={EPricingDisplayType.Dynamic}
                                            control={<Radio color="primary" size="small"/>}
                                            label="Dynamic" />
                                    </RadioGroup>
                                </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </DemandTable>
            </TableWrapper> : null}
        </TableContainer>
};