import {useSelector} from "react-redux";
import {
    mappedPricingDemandsSelectorDYear
} from "../../../../store/reducers/pricingSettings/selectors";
import {SquarePaper} from "../../../UI/Paper";
import {PaperTitle} from "../UI";
import {Box, Button, Divider} from "@material-ui/core";
import {SliderTable} from "./SliderTable";
import {EDemandType} from "../../../../store/reducers/pricingSettings/types";
import React from "react";
import {TimeOfYearDialog} from "./TimeOfYearDialog";
import {useModal} from "../../../../utils/hooks";

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
        <TimeOfYearDialog open={isOpen} onClose={onClose} />
    </SquarePaper>
};