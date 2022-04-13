import React, {useEffect} from 'react';
import {NoItemsLoading} from "../../../UI/NoItemsLoading";
import {DemandTable, TableCell, TableRow} from "../../AppointmentAllocation/UI";
import {Box, FormControlLabel, Radio, RadioGroup, styled, TableBody, TableHead} from "@material-ui/core";
import {TableContainer} from "../UI";
import {useException, useSCs} from "../../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {
    changeMPPrisingDisplayType,
    loadMPList,
} from "../../../../store/reducers/pricingSettings/actions";
import {RootState} from "../../../../store/rootReducer";
import {Caption} from "../../../UI/Caption";
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
    overflowY: "auto",
    maxHeight: "40vh",
    "& .MuiTableCell-root": {
        [theme.breakpoints.down("xs")]: {
            fontSize: "10px !important",
            padding: "6px !important"
        }
    }
}))

const MaintenancePackages = () => {
    const {isLoading, mpList} = useSelector((state: RootState) => state.pricingSettings);
    const {selectedSC} = useSCs();
    const showError = useException();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) {
            const data = {
                serviceCenterId: selectedSC.id,
                pageIndex: 0,
                pageSize: 0,
            }
            dispatch(loadMPList(data))
        }
    }, [selectedSC])

    const handlePricingDisplayType = (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value && selectedSC) {
            dispatch(changeMPPrisingDisplayType(id, +e.target.value, selectedSC.id, e => showError(e)))
        }
    }

    return (
        <div>
            <TableContainer>
                <NoItemsLoading items={mpList} loading={isLoading} />
                {mpList.length ? <TableWrapper>
                    <DemandTable>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    width={530}
                                    style={{...headCellStyles, ...leftAlign}}>
                                    Package Name
                                </TableCell>
                                <TableCell style={headCellStyles}>Base Market Price</TableCell>
                                <TableCell style={headCellStyles}>Value Market Price</TableCell>
                                <TableCell style={headCellStyles}>Preferred Market Price</TableCell>
                                <TableCell style={headCellStyles}>Pricing optimization status (Off/ON)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mpList.map(el => {
                                return <TableRow key={el.id}>
                                    <TableCell style={leftAlign}>{el.name}</TableCell>
                                    <TableCell>
                                        $ {el.baseMarketPrice}
                                    </TableCell>
                                    <TableCell>
                                        $ {el.valueMarketPrice}
                                    </TableCell>
                                    <TableCell>
                                        $ {el.preferredMarketPrice}
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
            <Box m={2} mt={1}>
                <Caption
                    title={<span>If <b>Pricing Optimization</b> is turned off, then price displayed is tied to <b>Base Price</b></span>}
                />
            </Box>
        </div>
    );
};

export default MaintenancePackages;