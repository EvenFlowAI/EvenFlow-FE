import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer"
import {useStyles} from "./styles";

const LaborRate = () => {
    const {selectedSC} = useSelector((state: RootState) => state.serviceCenters);
    const { classes  } = useStyles();
    return (
        <div className={classes.wrapper}>
            <p className={classes.title}>LABOR RATE PER HOUR</p>
            <span className={classes.value}>$  {selectedSC?.laborRatePerHour}</span>
        </div>
    );
};

export default LaborRate;