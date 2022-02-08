import React, {useEffect, useState} from 'react';
import {PaperTitle} from "../UI";
import {Divider, FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import {SquarePaper} from "../../../UI/Paper";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {Loading} from "../../../UI/Loading";
import {changeRoundPriceSetting, loadRoundPriceSetting} from "../../../../store/reducers/pricingSettings/actions";
import {useConfirm, useSCs} from "../../../../utils/hooks";

type TLabelProps = {
    title: string;
    text: string;
}

const useStyles = makeStyles(() => ({
    checkedOption: {
        border: '1px solid #3855F3',
        borderRadius: 2,
        '&:first-child': {
            marginBottom: 20,
        },
    },
    option: {
        border: '1px solid #DADADA',
        borderRadius: 2,
        '&:first-child': {
            marginBottom: 20,
        },
    },
    optionsWrapper: {
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 24px 24px 36px',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 8,
        textTransform: 'uppercase',
    },
    text: {
        fontSize: 16,
        padding: 8,
        marginBottom: 15,
    }
}))

const Label: React.FC<TLabelProps> = ({title, text}) => {
    const classes = useStyles();
    return <div>
        <div className={classes.title}>{title}</div>
        <div className={classes.text}>{text}</div>
    </div>
}

const PricingDisplay: React.FC = () => {
    const { isRoundPriceLoading, roundPrice } = useSelector((state: RootState) => state.pricingSettings);
    const [value, setValue] = useState<string>('decimal');
    const {askConfirm} = useConfirm();
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
                title: `Are you sure you want to change the option?`,
                onConfirm: () => {
                    setValue(e.target.value);
                    dispatch(changeRoundPriceSetting(selectedSC.id, e.target.value === 'round'))
                }
            });
        }
    }

    return <SquarePaper variant="outlined">
        <PaperTitle>Prices Display</PaperTitle>
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