import { makeStyles } from 'tss-react/mui';
import {styled} from "@mui/material";
import React from "react";

// 
export const useStyles = makeStyles()(theme => ({
    dropOff: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        fontSize: 14,
        color: '#202021',
        paddingTop: 25,
        paddingRight: 16,
        [theme.breakpoints.up("md")]: {
            paddingRight: 60,
        }
    },
    rightPart: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        [theme.breakpoints.down('md')]: {
            gap: 8,
        },
    },
    availability: {
        padding: '25px 0 46px 16px',
        textTransform: 'uppercase',
        fontSize: 16,
        [theme.breakpoints.up("md")]: {
            padding: '25px 0 46px 50px',
        },
    },
    availabilityItem: {
        display: 'flex',
        flexDirection: 'column',
    },
    textWithIcon: {
        display: 'flex',
        alignItems: 'center'
    },
    radio: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: 20,
    },
    rightText: {
        textAlign: 'right'
    }
}));

export type TPickUpSlotsWrapperProps = {
    available?: boolean,
    selected?: boolean,
}

export const PickUpWrapper = styled("div", {
    shouldForwardProp: (prop) => prop !== "available" && prop !== "selected"
})<TPickUpSlotsWrapperProps>(({theme, available, selected}) => ({
    maxHeight: 315,
    display: "grid",
    gridTemplateColumns: '4fr 6fr',
    alignItems: "center",
    fontWeight: "bold",
    gap: "6px",
    opacity: available ? 1 : .3,
    cursor: "pointer",
    border: '1px solid #000000',
    borderRadius: 2,
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr 1fr',
    },
    '& .pickUp': {
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 5fr',
        backgroundColor: selected ? '#202021' : '#E0E0E0',
        color: selected ? '#FFFFFF' : '#202021',
    },
}))