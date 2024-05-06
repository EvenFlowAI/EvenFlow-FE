import { makeStyles } from 'tss-react/mui';
import {styled} from "@mui/material";

export const useStyles = makeStyles()(theme => ({
    inputCell: {
        fontSize: 16,
        fontWeight: "bold",
        color: theme.palette.primary.main
    },
    editCell: {
        display: "flex",
        width: "100%",
        height: "100%",
        flexFlow: "row nowrap",
        alignItems: "center",
        justifyContent: "space-between"
    }
}));

export const Title = styled("div")({
    fontSize: 16,
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '20px 16px',
    backgroundColor: 'white',
    border: "1px solid #DADADA",
    borderBottomWidth: 0,
})