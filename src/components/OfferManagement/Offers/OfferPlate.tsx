import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Paper} from "@material-ui/core";
import {IOffer} from "../../../store/reducers/offers/types";

const useStyles = makeStyles(theme => ({
    wrapper: {
        borderRadius: 0,
        padding: 20
    },
    title: {

    },
    edit: {

    },
    label: {

    },
    content: {

    }
}));
type TProps = {
    offer: IOffer
}
export const OfferPlate: React.FC<TProps> = ({offer}) => {
    const classes = useStyles();
    return (
        <Paper variant="outlined" className={classes.wrapper}>

        </Paper>
    );
};