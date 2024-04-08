import { withStyles } from 'tss-react/mui';
import {ValueSlider} from "../../../components/styled/ValueSlider";
import { makeStyles } from 'tss-react/mui';
import {styled, TableCell} from "@mui/material";

export const Slider = withStyles(ValueSlider, {
    root: {
        margin: "0 25px",
        width: "calc(100% - 50px)"
    },
    markLabel: {
        top: 5,
        left: "-12px !important",
        "& ~ .MuiSlider-mark ~ .MuiSlider-markLabel": {
            left: "unset !important",
            right: -25
        }
    },
    track: {
        backgroundColor: '#858585',
        borderColor: "#858585"
    },
    marked: {
        marginTop: 3
    }
});

export const useStyles = makeStyles()({
    table: {
        "& .MuiTableCell-head": {
            textAlign: "center"
        },
        "& .MuiTableCell-body": {
            textAlign: "center",
            padding: "10px !important",
            fontSize: 12
        }
    },
    segment: {
        fontWeight: "bold"
    },
    subtitleCell: {
        padding: "8px !important",
        fontSize: "12px !important",
        color: "#9FA2B4"
    },
    edit: {
        fontSize: 14,
        textTransform: "uppercase",
        padding: 5,
        position: "absolute",
        top: "50%",
        transform: "translate(0, -50%)",
        right: 0
    },
    editN: {
        fontSize: 14,
        textTransform: "none",
        padding: 5,
    },
    editWrapper: {
        position: "absolute",
        top: "50%",
        right: 0,
        transform: "translate(0, -50%)"
    },
    buttonCell: {
        position: "relative",
        paddingRight: "56px !important",
    },
    cellInnerWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        textTransform: 'uppercase',
    }
});

export const StyledTableCell = styled(TableCell)({
    borderWidth: '0px 1px 0px 1px !important'
})

export const BorderedTableCell = styled(TableCell)({
    borderWidth: '0px 1px 1px 1px !important'
})

export const UpperTableCell = styled(TableCell)({
    borderWidth: '0 1px 0 1px !important'
})

