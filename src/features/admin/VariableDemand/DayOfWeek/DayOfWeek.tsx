import React from 'react';
import {Button} from "@mui/material";
import {useSelector} from "react-redux";
import {mappedPricingDemandsSelectorDWeek} from "../../../../store/reducers/pricingSettings/selectors";
import {SliderTable} from "../SliderTable/SliderTable";
import {EDemandType} from "../../../../store/reducers/pricingSettings/types";
import {WorkWeekModal} from "../WorkWeekModal/WorkWeekModal";

import {useModal} from "../../../../hooks/useModal/useModal";
import {TableTitle} from "../../../../components/wrappers/TableTitle/TableTitle";

export const DayOfWeek = () => {
    const {onOpen, onClose, isOpen} = useModal();
    const demand = useSelector(mappedPricingDemandsSelectorDWeek);

    return <div>
        <TableTitle style={{display: "flex", justifyContent: 'space-between', alignItems: "center", textTransform: 'none'}}>
            <div>Configuration Settings for All Services</div>
            <Button color="primary" variant="contained" onClick={onOpen}>
                Set up a Work Week
            </Button>
        </TableTitle>
        <SliderTable demand={demand} type={EDemandType.DayOfWeek} />
        <WorkWeekModal open={isOpen} onClose={onClose} />
    </div>
};