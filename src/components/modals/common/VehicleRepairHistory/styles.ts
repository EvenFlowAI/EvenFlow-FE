import makeStyles from '@mui/styles/makeStyles';
import { TableCell } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

export const useStyles = makeStyles({
    wrapper: {},
    rightHeaderPart: {
        width: '60%',
    },
    nameLineGrid: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gap: 8,
    },
    carDataGrid: {
        display: 'grid',
        gridTemplateColumns: '120px 1fr 1fr 1fr',
        gap: 8,
        marginBottom: 20,
    },
    titleBig: {
        fontWeight: 600,
        fontSize: 20
    },
    name: {
        fontWeight: 600,
        fontSize: 16,
    },
    titleSmall: {
        fontWeight: 600,
        fontSize: 14,
        textTransform: "uppercase",
        paddingBottom: 8,
    },
    titleNonUpperCase: {
        fontWeight: 600,
        fontSize: 14,
        paddingBottom: 4,
    },
    textBig: {
        fontSize: 20
    },
    textMd: {
        fontSize: 16
    },
    textSmall: {
        fontSize: 14,
    },
    textSmaller: {
        fontSize: 12,
    },
    orderWrapper: {
        border: '1px solid #DADADA',
        marginBottom: 36,
    },
    gridTableHead: {
        display: 'grid',
        gridTemplateColumns: '120px 5fr ',
        borderRight: '1px solid #DADADA',
        "& > div:first-child": {
            borderRight: '1px solid #DADADA',
        }
    },
    greyRow: {
        width: "100%",
        height: 12,
        backgroundColor: '#DADADA',
    },
    orderMainDataLeft: {
        borderRight: '1px solid #DADADA',
    },
    orderMainDataLeftTop: {
        display: 'grid',
        gridTemplateColumns: '120px 1fr 1fr 1fr',
        borderBottom: '1px solid #DADADA',
        "& > div:first-child": {
            borderRight: '1px solid #DADADA',
        }
    },
    orderMainDataRightTop: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        borderBottom: '1px solid #DADADA',
    },
    orderMainData: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr'
    },
    italic: {
        fontStyle: "italic",
    },
    serviceItem: {
        padding: 8,
        "&::marker": {
            fontWeight: "bold"
        }
    },
    centered: {
        display: 'flex',
        justifyContent: "center",
        alignItems: "center"
    },
    uppercase: {
        textTransform: 'uppercase'
    },
    borderRight: {
        borderRight: '1px solid #DADADA'
    },
    borderTop: {
        borderTop: '1px solid #DADADA'
    },
    padding: {
        padding: '16px 24px'
    },
    smallPadding: {
        padding: '8px 24px'
    },
    threePartsGrid: {
        display: "grid",
        gridTemplateColumns: '1fr 1fr 1fr'
    }
})

export const TCell = withStyles({
    root: {
        padding: 2,
        borderBottom: "none"
    }
})(TableCell)

export const HCell = withStyles({
    root: {
        color: "grey",
        textTransform: "uppercase",
        fontSize: 10,
        fontWeight: 600
    }
})(TCell)