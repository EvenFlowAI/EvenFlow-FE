import {styled, Theme} from "@mui/material";
import React from "react";
import {mh400, mh600} from "../CustomerSelect/constants";
import makeStyles from '@mui/styles/makeStyles';

export const ServiceTypeCardsWrapper = styled((props) => (<div {...props}/>))
    <{ cardsAmount: number}>
    (({theme, cardsAmount}) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cardsAmount}, 1fr)`,
    gap: "18px",
    marginTop: "5%",
    marginBottom: 20,
    justifyItems: cardsAmount === 1 ? "center" : "unset",
    '& > div': {
        minWidth: cardsAmount === 1 ? 440 : 'unset'
    },
    [mh600]: {
        marginTop: "2%"
    },
    [theme.breakpoints.down('md')]: {
        gridTemplateRows: `repeat(${cardsAmount}, 1fr)`,
        gridTemplateColumns: '1fr',
        marginTop: theme.spacing(5)
    }
}));
export const Tagline = styled((props) => (<div {...props}/>))<{
    taglineColor?: string
}>(({taglineColor}) => ({
    minHeight: 40,
    width: '100%',
    display: 'flex',
    justifyContent: "center",
    fontWeight: 600,
    fontSize: 20,
    paddingBottom: 16,
    color: taglineColor ? `#${taglineColor}` : 'inherit',
}))

export const ServiceTypeButton = styled((props) => (<div {...props}/>))<{
    isTaglinePresent: boolean
}>(({theme, isTaglinePresent}) => ({
    position: 'relative',
    height: "100%",
    maxHeight: 285,
    display: "grid",
    gridTemplateRows: isTaglinePresent ? '1fr 2fr 3fr' : '1fr 3fr',
    gridGap: isTaglinePresent ? 10 : 20,
    fontWeight: "bold",
    fontSize: 32,
    textAlign: "center",
    cursor: "pointer",
    padding: "10%",
    border: "1px solid #DADADA",
    background: "#FFFFFF",
    transition: theme.transitions.create(["box-shadow"]),
    "&:hover": {
        boxShadow: "0 2px 8px rgba(0,0,0,.1)"
    },
    [mh600]: {
        fontSize: 22,
        padding: "7%"
    },
    [`${mh400} and (orientation: portrait)`]: {
        fontSize: 18,
        padding: "2%"
    },
    [theme.breakpoints.down('md')]: {
        justifyItems: 'center',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: 18,
        padding: "5% 10%"
    },
    "& .infoIcon": {
        position: 'absolute',
        top: 15,
        right: 15,
        display: 'flex',
        justifyContent: 'flex-end',
    },
}));
export const useServiceTypeStyles = makeStyles(() => ({
    name: {
        width: "100%",
        fontSize: 28,
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
    }
}))