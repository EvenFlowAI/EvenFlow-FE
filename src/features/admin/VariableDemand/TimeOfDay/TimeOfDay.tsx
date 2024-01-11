import React from 'react';
import {PaperTitle, TableContainer} from "../../../../pages/admin/PricingSettings/UI";
import {Box, Divider, Grid, useMediaQuery, useTheme} from "@mui/material";
import {Caption} from "../../../../components/wrappers/Caption/Caption";
import {TextLink} from "../../../../components/wrappers/TextLink/TextLink";
import {SquarePaper} from "../../../../components/styled/Paper";
import {useStyles} from "./styles";
import {SwitchButtons} from "../../../../components/buttons/SwitchButtons/SwitchButtons";
import {TSwitchButton} from "../../../../types/types";
import {Routes} from "../../../../routes/constants";

const buttons: TSwitchButton<string>[] = [
    {label: "Undesirable", type: "0"},
    {label: "Neutral", type: "1"},
    {label: "Desirable", type: "2"},
];

export const TimeOfDay = () => {
    const classes = useStyles();
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSwitch = (t: string) => (s: string) => () => {

    }

    return (
        <SquarePaper variant="outlined">
            <PaperTitle>Time of day (pricing rules)</PaperTitle>
            <Divider/>
            <TableContainer>
                <Grid container alignItems={isXS ? "flex-start" : "center"} justifyContent={isXS ? "flex-start" : "space-between"} direction={isXS ? "column" : "row"}>
                    <div className={classes.rowWrapper}>
                        <SwitchButtons onClick={handleSwitch("1")} active={"0"} buttons={buttons} />
                        <span className={classes.message}>= Low (Discount)</span>
                    </div>
                    <Divider orientation="vertical" flexItem hidden={isXS} />
                    <div className={classes.rowWrapper}>
                        <SwitchButtons onClick={handleSwitch("1")} active={"1"} buttons={buttons} />
                        <span className={classes.message}>= Average (Base)</span>
                    </div>
                    <Divider orientation="vertical" flexItem hidden={isXS} />
                    <div className={classes.rowWrapper}>
                        <SwitchButtons onClick={handleSwitch("1")} active={"2"} buttons={buttons} />
                        <span className={classes.message}>= High (Premium)</span>
                    </div>
                </Grid>
                <Box mt={2}>
                    <Caption
                        title={<>
                            <span>You can change the desirability of appointment slots on </span>
                            <TextLink
                                to={Routes.CapacityManagement.AppointmentSlotScoring}>
                                Time of Day Desirability</TextLink>
                            <span> page</span>
                        </>}
                    />
                </Box>
            </TableContainer>
        </SquarePaper>
    );
};