import React from 'react';
import {PaperTitle, TableContainer} from "../UI";
import {Box, Divider, Grid} from "@material-ui/core";
import {Caption} from "../../../UI/Caption";
import {TextLink} from "../../../UI/TextLink";
import {Routes} from "../../../../config/routes";
import {SquarePaper} from "../../../UI/Paper";
import {SwitchButtons, TSwitchButton} from "../../../UI/Button";

const buttons: TSwitchButton<string>[] = [
    {label: "Undesirable", type: "0"},
    {label: "Neutral", type: "1"},
    {label: "Desirable", type: "2"},
]

export const ToD = () => {
    const handleSwitch = (t: string) => (s: string) => () => {

    }

    return <SquarePaper variant="outlined">
        <PaperTitle>Time of day (pricing rules)</PaperTitle>
        <Divider/>
        <TableContainer>
            <Grid container alignItems="center" justify="space-between">
                <div>
                    <SwitchButtons onClick={handleSwitch("1")} active={"0"} buttons={buttons} />
                </div>
                <Divider orientation="vertical" flexItem />
                <div>
                    <SwitchButtons onClick={handleSwitch("1")} active={"0"} buttons={buttons} />
                </div>
                <Divider orientation="vertical" flexItem />
                <div>
                    <SwitchButtons onClick={handleSwitch("1")} active={"0"} buttons={buttons} />
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