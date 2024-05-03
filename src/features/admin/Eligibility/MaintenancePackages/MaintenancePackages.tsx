import React, {useEffect} from 'react';
import {NoItemsLoading} from "../../../../components/wrappers/NoItemsLoading/NoItemsLoading";
import {Box, FormControlLabel, Radio, RadioGroup, TableBody, TableHead} from "@mui/material";
import {TableContainer} from "../../../../pages/admin/PricingSettings/UI";
import {useDispatch, useSelector} from "react-redux";
import {
    changeMPPrisingDisplayType,
    loadMPList,
} from "../../../../store/reducers/pricingSettings/actions";
import {RootState} from "../../../../store/rootReducer";
import {Caption} from "../../../../components/wrappers/Caption/Caption";
import {EPricingDisplayType} from "../../../../store/reducers/pricingSettings/types";
import {blackFont, headCellStyles, leftAlign} from "../styles";
import {TableWrapper} from "./styles";
import {DemandTable} from "../../../../components/styled/DemandTable";
import {TableRow} from "../../../../components/styled/TableRow";
import {TableCell} from "../../../../components/styled/TableCell";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {StyledTableCell} from "../EligibilityStatuses/styles";

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
                                <StyledTableCell
                                    style={{...headCellStyles, ...blackFont, ...leftAlign, textTransform: 'capitalize'}}>
                                    Package Name
                                </StyledTableCell>
                                <StyledTableCell
                                    style={{...headCellStyles, ...leftAlign, textTransform: 'capitalize', lineHeight: 'normal'}}
                                    width={130}>
                                    Base Market Price
                                </StyledTableCell>
                                <StyledTableCell
                                    style={{...headCellStyles, ...leftAlign, textTransform: 'capitalize', lineHeight: 'normal'}}
                                    width={130}>
                                    Value Market Price
                                </StyledTableCell>
                                <StyledTableCell
                                    style={{...headCellStyles, ...leftAlign, textTransform: 'capitalize', lineHeight: 'normal'}}
                                    width={130}>
                                    Preferred Market Price
                                </StyledTableCell>
                                <StyledTableCell style={headCellStyles}>
                                    Pricing optimization status
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mpList.map(el => {
                                return <TableRow key={el.id}>
                                    <StyledTableCell style={leftAlign}>{el.name}</StyledTableCell>
                                    <StyledTableCell>
                                        $ {el.baseMarketPrice}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        $ {el.valueMarketPrice}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        $ {el.preferredMarketPrice}
                                    </StyledTableCell>

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