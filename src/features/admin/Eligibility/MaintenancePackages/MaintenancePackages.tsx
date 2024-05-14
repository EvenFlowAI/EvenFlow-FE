import React, {useEffect} from 'react';
import {NoItemsLoading} from "../../../../components/wrappers/NoItemsLoading/NoItemsLoading";
import {Box, Radio, TableBody, TableHead} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {
    changeMPPrisingDisplayType,
    loadMPList,
} from "../../../../store/reducers/pricingSettings/actions";
import {RootState} from "../../../../store/rootReducer";
import {Caption} from "../../../../components/wrappers/Caption/Caption";
import {EPricingDisplayType} from "../../../../store/reducers/pricingSettings/types";
import {headCellStyles, leftAlign} from "../styles";
import {DenseTableWithPadding} from "../../../../components/styled/DemandTable";
import {TableRow} from "../../../../components/styled/TableRow";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {
    PricesCell, RadioBtn,
    RadioGroupStyled,
    StyledTableCell,
    SubHeaderCell,
    SubHeaderTitle
} from "../EligibilityStatuses/styles";

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
            <NoItemsLoading items={mpList} loading={isLoading} />
            {mpList.length
                ? <DenseTableWithPadding>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell
                                style={{...headCellStyles, ...leftAlign, textTransform: 'capitalize'}}>
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
                            <PricesCell style={{...headCellStyles, textTransform: 'capitalize', lineHeight: 'normal'}} width={335}>
                                <SubHeaderTitle>Pricing optimization configuration</SubHeaderTitle>
                                <SubHeaderCell>
                                    <span>Suppressed</span>
                                    <span>Static</span>
                                    <span>Dynamic</span>
                                </SubHeaderCell>
                            </PricesCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mpList.map(el => {
                            return <TableRow key={el.id}>
                                <StyledTableCell style={leftAlign}>{el.name}</StyledTableCell>
                                <StyledTableCell style={leftAlign}>
                                    $ {el.baseMarketPrice.toFixed(2)}
                                </StyledTableCell>
                                <StyledTableCell style={leftAlign}>
                                    $ {el.valueMarketPrice.toFixed(2)}
                                </StyledTableCell>
                                <StyledTableCell style={leftAlign}>
                                    $ {el.preferredMarketPrice.toFixed(2)}
                                </StyledTableCell>

                                <PricesCell>
                                    <RadioGroupStyled
                                        row
                                        value={el.pricingDisplayType}
                                        onChange={handlePricingDisplayType(el.id)}
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group">
                                        <RadioBtn
                                            value={EPricingDisplayType.Suppressed}
                                            control={<Radio color="primary" size="small"/>}
                                            label="" />
                                        <RadioBtn
                                            value={EPricingDisplayType.Static}
                                            control={<Radio color="primary" size="small"/>}
                                            label="" />
                                        <RadioBtn
                                            value={EPricingDisplayType.Dynamic}
                                            control={<Radio color="primary" size="small"/>}
                                            label="" />
                                    </RadioGroupStyled>
                                </PricesCell>
                            </TableRow>
                        })}
                    </TableBody>
                </DenseTableWithPadding>
                : null}
            <Box m={2} mt={1}>
                <Caption
                    title={
                    <span>If Pricing Optimization is turned off, then price displayed is tied to
                        <span style={{color: "#7898FF", textTransform: 'uppercase', fontWeight: 700}}> Base Price</span>
                    </span>}
                />
            </Box>
        </div>
    );
};

export default MaintenancePackages;