import React from 'react';
import {PaperTitle, TableContainer} from "../UI";
import {Box, Divider, Grid} from "@material-ui/core";
import {Caption} from "../../../UI/Caption";
import {TextLink} from "../../../UI/TextLink";
import {Routes} from "../../../../config/routes";
import {SquarePaper} from "../../../UI/Paper";
import {SwitchButtons, TSwitchButton} from "../../../UI/Button";
import {makeStyles} from "@material-ui/core/styles";

const buttons: TSwitchButton<string>[] = [
    {label: "Undesirable", type: "0"},
    {label: "Neutral", type: "1"},
    {label: "Desirable", type: "2"},
];

const useStyles = makeStyles(theme =>({
    message: {
        fontSize: 14,
        [theme.breakpoints.down("lg")]: {
            fontSize: 11
        }
    }
}));

export const ToD = () => {
    const handleSwitch = (t: string) => (s: string) => () => {

    }
    const classes = useStyles();
    return <SquarePaper variant="outlined">
        <PaperTitle>Time of day (pricing rules)</PaperTitle>
        <Divider/>
        <TableContainer>
            <Grid container alignItems="center" justify="space-between">
                <div>
                    <SwitchButtons onClick={handleSwitch("1")} active={"2"} buttons={buttons} />
                    <span className={classes.message}>= Low (Discount)</span>
                </div>
                <Divider orientation="vertical" flexItem />
                <div>
                    <SwitchButtons onClick={handleSwitch("1")} active={"1"} buttons={buttons} />
                    <span className={classes.message}>= Average (Base)</span>
                </div>
                <Divider orientation="vertical" flexItem />
                <div>
                    <SwitchButtons onClick={handleSwitch("1")} active={"0"} buttons={buttons} />
                    <span className={classes.message}>= High (Premium)</span>
                </div>
            </Grid>
            <Box mt={2}>
                <Caption
                    title={<>
                        <span>You can change the desirability of appointment slots on </span>
                        <TextLink
                            to={Routes.Optimizer.AppointmentSlotScoring}>
                            Time of Day desirability</TextLink>
                        <span> page</span>
                    </>}
                />
            </Box>
        </TableContainer>
    </SquarePaper>
};