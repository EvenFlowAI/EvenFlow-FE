import React, {useEffect, useState} from 'react';
import {TextField} from "../../UI/TextField";
import {IUnplannedDemandBySlot} from "../../../store/reducers/demandSegments/types";
import {makeStyles} from "@material-ui/core/styles";
import {useException} from "../../../utils/hooks";

const useStyles = makeStyles({
    inputWrapper: {
        width: 80,
        '& > input': {
            textAlign: "center"
        }
    }
})

type TDemandInputProps = {
    item: IUnplannedDemandBySlot;
    onBlur: (item: IUnplannedDemandBySlot, value: number|string) => void;
}

const DemandInput: React.FC<TDemandInputProps> = ({item,onBlur}) => {
    const [value, setValue] = useState<number|string>(0);
    const showError = useException();
    const classes = useStyles();

    useEffect(() => {
        setValue(item.amount)
    }, [item])

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!Number.isInteger(+e.target.value)) {
            showError('"Unplanned Demand" must be a whole number');
        } else {
           setValue(e.target.value);
        }
    }

    const onInputBlur = () => onBlur(item, value)

    return (
        <TextField
            value={value}
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