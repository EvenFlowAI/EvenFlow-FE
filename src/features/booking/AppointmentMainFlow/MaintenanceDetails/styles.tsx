import {styled} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

export const SelectWrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr"
    }
}));

export const useStyles = makeStyles(() => ({
    vinWrapper: {
        '& > label': {
            textTransform: 'none',
            fontSize: 14,
            color: "#142EA1",
            fontWeight: "normal",
        }
    }
}))