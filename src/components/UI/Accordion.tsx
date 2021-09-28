import React from 'react';
import {Accordion as MuiAccordion, AccordionDetails, AccordionSummary, Typography} from "@material-ui/core";

type TAccordionProps = {
    defaultExpanded?: boolean | undefined;
    disabled?: boolean | undefined;
    expanded?: boolean | undefined;
    onChange?: (event: React.ChangeEvent<{}>, expanded: boolean) => void;
    square?: boolean | undefined;
    title: string;
    details: React.ElementType;
}

export const Accordion: React.FC<TAccordionProps> = props => {
    return <MuiAccordion
        defaultExpanded={props.defaultExpanded}
        disabled={props.disabled}
        expanded={props.expanded}
        onChange={props.onChange}
        square={props.square}
    >
        <AccordionSummary id={props.title}>
            <Typography>{props.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            {props.details}
        </AccordionDetails>
    </MuiAccordion>
}