import React, {useEffect, useState} from 'react';
import {PaperTitle} from "../../../../pages/admin/PricingSettings/UI";
import {Divider, FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import {SquarePaper} from "../../../../components/styled/Paper";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {Loading} from "../../../../components/Loading/Loading";
import {changeRoundPriceSetting, loadRoundPriceSetting} from "../../../../store/reducers/pricingSettings/actions";
import {useConfirm, useException, useSCs} from "../../../../utils/hooks";
import {useStyles} from "./styles";
import {Label} from "./Label/Label";

const PricingDisplay: React.FC = () => {
    const { isRoundPriceLoading, roundPrice } = useSelector((state: RootState) => state.pricingSettings);
    const [value, setValue] = useState<string>('decimal');
    const {askConfirm} = useConfirm();
    const showError = useException();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        setValue(roundPrice ? 'round' : 'decimal');
    }, [roundPrice])

    useEffect(() => {
        selectedSC && dispatch(loadRoundPriceSetting(selectedSC.id));
    }, [selectedSC])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedSC) {
            e.persist();
            askConfirm({
                title: `Please confirm you want to change Price Display option`,
                onConfirm: () => {
                    try {
                        setValue(e.target.value);
                        dispatch(changeRoundPriceSetting(selectedSC.id, e.target.value === 'round'))
                    } catch (e) {
                        showError(e);
                    }
                }
            });
        }
    }

    return <SquarePaper variant="outlined">
        <PaperTitle>Price Display</PaperTitle>
        <Divider />
        {isRoundPriceLoading
            ? <Loading/>
            : <RadioGroup row aria-label="position" name="position" value={value} onChange={onChange} className={classes.optionsWrapper}>
                <FormControlLabel
                    className={value === 'round' ? classes.checkedOption :  classes.option}
                    value="round"
                    control={<Radio color="primary"/>}
                    label={<Label title="OPTION A" text="Display round prices"/>}
                    labelPlacement="end"
                />
                <FormControlLabel
                    className={value === 'decimal' ? classes.checkedOption :  classes.option}
                    value="decimal"
                    control={<Radio color="primary"/>}
                    label={<Label title="OPTION B" text="Display fractional prices"/>}
                    labelPlacement="end"
                />
            </RadioGroup>
        }

    </SquarePaper>
};

export default PricingDisplay;