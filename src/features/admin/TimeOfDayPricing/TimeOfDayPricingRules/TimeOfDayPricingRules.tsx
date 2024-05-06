import React from 'react';
import {Box, Divider, Grid, useMediaQuery, useTheme} from "@mui/material";
import {Caption} from "../../../../components/wrappers/Caption/Caption";
import {TextLink} from "../../../../components/wrappers/TextLink/TextLink";
import {SquarePaper} from "../../../../components/styled/Paper";
import {Title, useStyles} from "./styles";
import {SwitchButtons} from "../../../../components/buttons/SwitchButtons/SwitchButtons";
import {TSwitchButton} from "../../../../types/types";
import {Routes} from "../../../../routes/constants";

const buttons: TSwitchButton<string>[] = [
    {label: "Undesirable", type: "0"},
    {label: "Neutral", type: "1"},
    {label: "Desirable", type: "2"},
];

export const TimeOfDayPricingRules = () => {
    const { classes  } = useStyles();
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSwitch = (t: string) => (s: string) => () => {}

    return (
        <div>
            <SquarePaper variant="outlined">
                <Title>Pricing rules: Time of Day</Title>
                <Divider/>
                <div className={classes.tableWrapper}>
                    <Grid
                        container
                        alignItems={isXS ? "flex-start" : "center"}
                        justifyContent={isXS ? "flex-start" : "space-between"}
                        direction={isXS ? "column" : "row"}>
                        <div className={classes.rowWrapper}>
                            <SwitchButtons onClick={handleSwitch("1")} active={"0"} buttons={buttons} />
                            <span className={classes.message}>= Low (Discount)</span>
                        </div>
                        <div className={classes.rowWrapper}>
                            <SwitchButtons onClick={handleSwitch("1")} active={"1"} buttons={buttons} />
                            <span className={classes.message}>= Average (Base)</span>
                        </div>
                        <div className={classes.rowWrapper}>
                            <SwitchButtons onClick={handleSwitch("1")} active={"2"} buttons={buttons} />
                            <span className={classes.message}>= High (Premium)</span>
                        </div>
                    </Grid>
                </div>
                <div className={classes.dividersBlock}>
                    <div className={classes.divider}></div>
                    <div className={classes.divider}></div>
                </div>
            </SquarePaper>
            <Box mt={2}>
                <Caption
                    title={<>
                        <span>You can change the desirability of appointment slots on </span>
                        <TextLink
                            to={Routes.CapacityManagement.TimeDifferentiation}>
                            Time of Day Desirability</TextLink>
                        <span> page</span>
                    </>}
                />
            </Box>
        </div>
    );
};