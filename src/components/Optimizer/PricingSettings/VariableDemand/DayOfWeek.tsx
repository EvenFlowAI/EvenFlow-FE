import React from 'react';
import {SquarePaper} from "../../../UI/Paper";
import {PaperTitle} from "../UI";
import {Box, Button, Divider} from "@material-ui/core";
import {useSelector} from "react-redux";
import {mappedPricingDemandsSelectorDWeek} from "../../../../store/reducers/pricingSettings/selectors";
import {SliderTable} from "./SliderTable";
import {EDemandType} from "../../../../store/reducers/pricingSettings/types";
import {WorkWeekDialog} from "./WorkWeekDialog";
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
        <WorkWeekDialog open={isOpen} onClose={onClose} />
    </SquarePaper>
};