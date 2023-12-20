import React from 'react';
import {SquarePaper} from "../../../../components/styled/Paper";
import {PaperTitle} from "../../../../pages/admin/PricingSettings/UI";
import {Box, Button, Divider} from "@material-ui/core";
import {useSelector} from "react-redux";
import {mappedPricingDemandsSelectorDWeek} from "../../../../store/reducers/pricingSettings/selectors";
import {SliderTable} from "../SliderTable/SliderTable";
import {EDemandType} from "../../../../store/reducers/pricingSettings/types";
import {WorkWeekModal} from "../WorkWeekModal/WorkWeekModal";
import {useModal} from "../../../../utils/hooks";

export const DayOfWeek = () => {
    const {onOpen, onClose, isOpen} = useModal();
    const demand = useSelector(mappedPricingDemandsSelectorDWeek);

    return <SquarePaper variant="outlined">
        <Box display="flex" mr={2} alignItems="center">
            <PaperTitle>Day of week</PaperTitle>
            <div className="grow" />
            <Button color="primary" variant="contained" onClick={onOpen}>
                Set up a Work Week
            </Button>
        </Box>
        <Divider />
        <SliderTable demand={demand} type={EDemandType.DayOfWeek} />
        <WorkWeekModal open={isOpen} onClose={onClose} />
    </SquarePaper>
};