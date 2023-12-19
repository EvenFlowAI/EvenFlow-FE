import React, {useEffect, useMemo, useState} from 'react';
import {Divider, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {EditButton} from "../../../components/UI/Button";
import {PriceLevelsModal} from "../PriceLevelsModal/PriceLevelsModal";
import {useModal, useSCs} from "../../../utils/hooks";
import {EDemandCategory, IPricingLevel, TPricingLevels} from "../../../store/reducers/pricingSettings/types";
import {useDispatch, useSelector} from "react-redux";
import {loadPricingLevels} from "../../../store/reducers/pricingSettings/actions";
import {RootState} from "../../../store/rootReducer";
import {PaperTitle, TableContainer} from "../../../pages/admin/PricingSettings/UI";
import {SquarePaper} from "../../../components/styled/Paper";
import {useStyles} from "./styles";
import {DenseTable} from "../../../components/styled/DemandTable";

export const DemandWindows = () => {
    const {pricingLevels} = useSelector((state: RootState) => state.pricingSettings)
    const [editedItem, setEditedItem] = useState<IPricingLevel|undefined>(undefined);
    const {onClose, onOpen, isOpen} = useModal();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useStyles();

    const mappedPricingLevels: TPricingLevels = useMemo(() => {
        return pricingLevels.reduce((acc, item) => {
            acc[item.demandCategory] = item;
            return acc;
        }, {} as TPricingLevels);
    }, [pricingLevels]);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadPricingLevels(selectedSC.id));
        }
    }, [selectedSC, dispatch]);

    const handleOpen = (t: EDemandCategory) => () => {
        if (selectedSC) {
            const item = mappedPricingLevels[t];
            setEditedItem({
                serviceCenterId: selectedSC.id, percentage: 100, demandCategory: t,
                ...item
            });
            onOpen();
        }
    }

    return <SquarePaper variant="outlined">
        <PaperTitle>Demand Windows Eligibility Status</PaperTitle>
        <Divider />
        <TableContainer>
            <DenseTable>
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={2}>Price levels</TableCell>
                        <TableCell>Price percentage</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Discount</TableCell>
                        <TableCell align="center">from 0% to 100%</TableCell>
                        <TableCell className={classes.inputCell}>
                            <div className={classes.editCell}>
                                <span>
                                    {mappedPricingLevels[EDemandCategory.Low]?.percentage
                                        ? `${mappedPricingLevels[EDemandCategory.Low].percentage}%`
                                        : "-"}
                                </span>
                                <EditButton onClick={handleOpen(EDemandCategory.Low)} color="primary">
                                    Edit
                                </EditButton>
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{padding: "18px 12px"}}>Base</TableCell>
                        <TableCell align="center">fixed to 100%</TableCell>
                        <TableCell className={classes.inputCell}>100%</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Premium</TableCell>
                        <TableCell align="center">from 100% to 200%</TableCell>
                        <TableCell className={classes.inputCell}>
                            <div className={classes.editCell}>
                                <span>
                                    {mappedPricingLevels[EDemandCategory.High]?.percentage
                                        ? `${mappedPricingLevels[EDemandCategory.High].percentage}%`
                                        : "-"}
                                </span>
                                <EditButton onClick={handleOpen(EDemandCategory.High)} color="primary">
                                    Edit
                                </EditButton>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </DenseTable>
        </TableContainer>
        <PriceLevelsModal payload={editedItem} open={isOpen} onClose={onClose} />
    </SquarePaper>
};