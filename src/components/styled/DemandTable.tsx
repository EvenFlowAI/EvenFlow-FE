import withStyles from '@mui/styles/withStyles';
import {StyledTable} from "./StyledTable";

export const DemandTable = withStyles(theme => ({
    root: {
        border: `1px solid ${theme.palette.divider}`
    }
}))(StyledTable);

export const DenseTable = withStyles({
    root: {
        "& .MuiTableCell-root": {
            padding: 12,
            fontSize: 15
        }
    }
})(DemandTable);