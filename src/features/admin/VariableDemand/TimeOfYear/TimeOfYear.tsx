import {useSelector} from "react-redux";
import {
    mappedPricingDemandsSelectorDYear
} from "../../../../store/reducers/pricingSettings/selectors";
import {SquarePaper} from "../../../../components/styled/Paper";
import {PaperTitle} from "../../../../pages/admin/PricingSettings/UI";
import {Box, Button, Divider} from "@material-ui/core";
import {SliderTable} from "../SliderTable/SliderTable";
import {EDemandType} from "../../../../store/reducers/pricingSettings/types";
import React from "react";
import {TimeOfYearModal} from "../TimeOfYearModal/TimeOfYearModal";

import {useModal} from "../../../../hooks/useModal/useModal";

export const TimeOfYear = () => {
    const {onOpen, isOpen, onClose} = useModal();
    const demand = useSelector(mappedPricingDemandsSelectorDYear);

    return <SquarePaper variant="outlined">
        <Box display="flex" mr={2} alignItems="center">
            <PaperTitle>Time of Year</PaperTitle>
            <div className="grow" />
            <Button color="primary" onClick={onOpen} variant="contained">
                Set up a calendar
            </Button>
        </Box>
        <Divider />
        <SliderTable demand={demand} type={EDemandType.TimeOfYear} />
        <TimeOfYearModal open={isOpen} onClose={onClose} />
    </SquarePaper>
};