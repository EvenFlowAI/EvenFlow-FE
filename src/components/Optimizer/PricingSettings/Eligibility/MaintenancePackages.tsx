import React, {useEffect} from 'react';
import {NoItemsLoading} from "../../../UI/NoItemsLoading";
import {DemandTable, TableCell, TableRow} from "../../AppointmentAllocation/UI";
import {styled, Switch, TableBody, TableHead} from "@material-ui/core";
import {TableContainer} from "../UI";
import {useSCs} from "../../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {loadMPList, setPricingOptimization} from "../../../../store/reducers/pricingSettings/actions";
import {RootState} from "../../../../store/rootReducer";

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

const MaintenancePackages = () => {
    const {isLoading, mpList} = useSelector((state: RootState) => state.pricingSettings);
    const {selectedSC} = useSCs();
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

    const handleSwitch = (id: number) => async (e: any, value: boolean) => {
        if (selectedSC) {
            const data = {
                serviceCenterId: selectedSC.id,
                pageIndex: 0,
                pageSize: 0,
            }
            dispatch(setPricingOptimization(id, value, data))
        }
    }

    return (
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
                                    ${el.baseMarketPrice}
                                </TableCell>
                                <TableCell>
                                    ${el.valueMarketPrice}
                                </TableCell>
                                <TableCell>
                                    ${el.preferredMarketPrice}
                                </TableCell>

                                <TableCell>
                                    <Switch
                                        disabled={isLoading}
                                        onChange={handleSwitch(el.id)}
                                        checked={el.isApplyPricingOptimization}
                                        color="primary"
                                    />
                                </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </DemandTable>
            </TableWrapper> : null}
        </TableContainer>
    );
};

export default MaintenancePackages;