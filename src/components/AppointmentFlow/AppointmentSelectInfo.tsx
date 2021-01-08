import React from 'react';
import {Box, Divider} from "@material-ui/core";
import {Caption} from "../UI/Caption";
import {DirectionsCar} from "@material-ui/icons";

export const AppointmentSelectInfo = () => {
    return <>
        <Divider/>
        <Box mt={1}>
            <Caption
                title={<Box ml={.5}>Early drop off with self check in available</Box>}
                icon={<DirectionsCar/>}
            />
        </Box>
        <Box mt={1}>
            <Caption title={
                <Box ml={.5}>
                    <strong>
                        Disclaimer:
                    </strong>
                    <span> Special offers for appointment times do not apply for transmission and other power train related services.</span>
                </Box>
            }/>
        </Box>
    </>
};