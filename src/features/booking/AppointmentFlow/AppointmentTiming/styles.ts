import {styled} from "@mui/material";

export const TimingWrapper = styled('div')<{ columns: number }>(({theme, columns}) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    width: "100%",
    alignItems: "stretch",
    gap: "20px",
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: "1fr"
    }
}));