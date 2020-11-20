import React from 'react';
import {SquarePaper} from "../../UI/Paper";
import {PaperTitle, TableContainer} from "./UI";
import {Caption} from "../../UI/Caption";
import {TextLink} from "../../UI/TextLink";
import {Routes} from "../../../config/routes";
import {Box} from "@material-ui/core";

export const VariableDemand = () => {
    return <div>
        <SquarePaper variant="outlined">
            <PaperTitle>Time of  day (pricing rules)</PaperTitle>
            <TableContainer>

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
    </div>
};