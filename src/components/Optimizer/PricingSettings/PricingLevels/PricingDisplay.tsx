import React, {useState} from 'react';
import {PaperTitle} from "../UI";
import {Divider, FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import {SquarePaper} from "../../../UI/Paper";
import {makeStyles} from "@material-ui/core/styles";

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
        marginBottom: 20,
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
    const [value, setValue] = useState<string>('optionA');
    const classes = useStyles();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

    return <SquarePaper variant="outlined">
        <PaperTitle>Pricing Display</PaperTitle>
        <Divider />
        <RadioGroup row aria-label="position" name="position" value={value} onChange={onChange} className={classes.optionsWrapper}>
            <FormControlLabel
                className={value === 'optionA' ? classes.checkedOption :  classes.option}
                value="optionA"
                control={<Radio color="primary"/>}
                label={<Label title="OPTION A" text="Display pricing as a percent (%) off the Premium level"/>}
                labelPlacement="end"
            />
            <FormControlLabel
                className={value === 'optionB' ? classes.checkedOption :  classes.option}
                value="optionB"
                control={<Radio color="primary"/>}
                label={<Label title="OPTION B" text="Display pricing as a percent (%) off the Premium level"/>}
                labelPlacement="end"
            />
        </RadioGroup>
    </SquarePaper>
};

export default PricingDisplay;