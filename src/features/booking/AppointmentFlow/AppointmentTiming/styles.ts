import {styled, Theme} from "@material-ui/core";

export const TimingWrapper = styled('div')<Theme, { columns: number }>(({theme, columns}) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    width: "100%",
    alignItems: "stretch",
    gap: "20px",
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr"
    }
}));