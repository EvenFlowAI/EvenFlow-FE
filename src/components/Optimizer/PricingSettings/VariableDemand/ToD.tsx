import React from 'react';
import {PaperTitle, TableContainer} from "../UI";
import {Box, Divider, Grid} from "@material-ui/core";
import {Caption} from "../../../UI/Caption";
import {TextLink} from "../../../UI/TextLink";
import {Routes} from "../../../../config/routes";
import {SquarePaper} from "../../../UI/Paper";

export const ToD = () => {
    return <SquarePaper variant="outlined">
        <PaperTitle>Time of day (pricing rules)</PaperTitle>
        <Divider/>
        <TableContainer>
            <Grid container alignItems="center" justify="space-between">
                <div>Content</div>
                <Divider orientation="vertical" flexItem />
                <div>Content</div>
                <Divider orientation="vertical" flexItem />
                <div>Content</div>
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