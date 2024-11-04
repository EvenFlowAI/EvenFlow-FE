import React, {Dispatch, SetStateAction} from 'react';
import {TextField} from "../../../components/formControls/TextFieldStyled/TextField";
import {IUnplannedDemandBySlot} from "../../../store/reducers/demandSegments/types";
import { makeStyles } from 'tss-react/mui';

import {useException} from "../../../hooks/useException/useException";
import {sortSlots} from "../UnplannedDemand/utils";

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
    setDemandSlots: Dispatch<SetStateAction<IUnplannedDemandBySlot[]>>;
}

const DemandInput: React.FC<TDemandInputProps> = ({setDemandSlots, item}) => {
    const showError = useException();
    const { classes } = useStyles();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!Number.isInteger(+e.target.value)) {
            showError('"Unplanned Demand" must be a whole number');
        } else {
            setDemandSlots(prev => {
                const prevItem = prev.find(el => {
                    return el.localId === item.localId
                })
                if (prevItem) {
                    const updated = {...prevItem, amount: +e.target.value};
                    const filtered = [...prev].filter(el => el.localId !== item.localId)
                    const updatedArray = filtered.concat(updated)
                    return updatedArray.sort(sortSlots)
                } else {
                    return prev;
                }
            })
        }
    }

    return (
        <TextField
            value={+item.amount}
            inputProps={{
                min: 0,
            }}
            onChange={onChange}
            className={classes.inputWrapper}/>
    );
};

export default DemandInput;