import React, {useEffect, useState} from 'react';
import {TextField} from "../../../components/formControls/TextFieldStyled/TextField";
import {IUnplannedDemandBySlot} from "../../../store/reducers/demandSegments/types";
import { makeStyles } from 'tss-react/mui';

import {useException} from "../../../hooks/useException/useException";

const useStyles = makeStyles()(theme => ({
    inputWrapper: {
        width: 152,
        [theme.breakpoints.down("xl")]: {
            width: 72,
        }
    }
}));

type TDemandInputProps = {
    item: IUnplannedDemandBySlot;
    onBlur: (item: IUnplannedDemandBySlot, value: number|string) => void;
}

const DemandInput: React.FC<React.PropsWithChildren<React.PropsWithChildren<TDemandInputProps>>> = ({item,onBlur}) => {
    const [value, setValue] = useState<number|string>(0);
    const showError = useException();
    const { classes } = useStyles();
    //
    // useEffect(() => {
    //     setValue(item.amount)
    // }, [item])

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!Number.isInteger(+e.target.value)) {
            showError('"Unplanned Demand" must be a whole number');
        } else {
            onBlur(item, e.target.value)
        }
    }

    const onInputBlur = () => {

    }

    return (
        <TextField
            value={item.amount}
            type="number"
            inputProps={{
                min: 0,
            }}
            onBlur={onInputBlur}
            onChange={onInputChange}
            className={classes.inputWrapper}/>
    );
};

export default DemandInput;