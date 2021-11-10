import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer"
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#252525',
        marginRight: 16,
    },
    value: {
        padding: '8px 12px',
        border: '1px solid #DADADA',
        fontSize: 16,
        color: '#252733',
    }
}));

const LaborRate = () => {
    const {selectedSC} = useSelector((state: RootState) => state.serviceCenters);
    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <p className={classes.title}>LABOR RATE PER HOUR</p>
            <span className={classes.value}>$  {selectedSC?.laborRatePerHour}</span>
        </div>
    );
};

export default LaborRate;