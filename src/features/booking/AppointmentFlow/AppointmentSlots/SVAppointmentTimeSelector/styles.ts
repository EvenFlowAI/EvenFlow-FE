import {styled} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

export const PickUpSlotsWrapper = styled('div')(() => ({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px 12px",
    alignItems: "center",
    justifyContent: "stretch",
}));

export const useStyles = makeStyles(theme => ({
    wrapper: {
        maxHeight: '40vh',
        overflowY: "auto",
        [theme.breakpoints.down("xs")]: {
            maxHeight: '30vh',
        }
    }
}))