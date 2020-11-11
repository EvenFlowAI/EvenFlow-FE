import React, {useState} from 'react';
import {FormControlLabel, FormLabel, IconButton, Radio, RadioGroup} from "@material-ui/core";
import {TextField} from "../UI";
import {Search} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    label: {
        textTransform: "uppercase",
        fontWeight: "bold"
    },
    btnIcon: {
        marginLeft: 8
    },
    item: {
        justifyContent: "space-between",
        marginLeft: 0,
        border: "1px solid gray",
        borderRadius: 2,
        paddingLeft: 12,
        marginTop: 12
    }
});

type TSRS = {
    id: number;
    description: string;
}
const srs: TSRS[] = [
    {id: 1, description: "Engine oil & filter change with inspections"},
    {id: 2, description: "Engine filter & oil change"},
    {id: 3, description: "Four wheel alignment and tire rotation"},
    {id: 4, description: "Engine filter & oil change"},
    {id: 5, description: "Four wheel alignment and tire rotation"},
];

export const ServiceNeedsS2 = () => {
    const [selectedCode, setCode] = useState<number|null>(null);
    const handleSelectCode = (e: any, value: string) => {
        setCode(Number(value));
    }

    const classes = useStyles();
    return (
        <div style={{width: "100%"}}>
            <h4>What Does Your Car Need?</h4>
            <FormLabel className={classes.label} htmlFor="search">Search</FormLabel>
            <TextField
                placeholder="Type here"
                InputProps={{
                    startAdornment: <IconButton
                        className={classes.btnIcon}
                        size="small">
                        <Search />
                    </IconButton>
                }}
            />
            <RadioGroup value={selectedCode} onChange={handleSelectCode}>
                {srs.map(s => {
                    return <FormControlLabel
                        key={s.id}
                        className={classes.item}
                        label={s.description}
                        labelPlacement={"start"}
                        value={s.id}
                        control={
                            <Radio
                                color="primary"
                            />
                        }
                    />
                })}
            </RadioGroup>
        </div>
    );
};