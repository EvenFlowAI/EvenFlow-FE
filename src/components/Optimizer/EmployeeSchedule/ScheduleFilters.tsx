import React from 'react';
import {Paper} from "@material-ui/core";

type TProps = {
    opened: boolean;
}
export const ScheduleFilters: React.FC<TProps> = ({opened}) => {
    if (!opened) return null;
    return (
        <Paper variant="outlined" style={{borderRadius: 0, marginBottom: 18}}>
            content
        </Paper>
    );
};