import {makeStyles} from "tss-react/mui";

export const useStyles = makeStyles()(() => ({
    row: {
        display: 'grid',
        gridTemplateColumns: '3fr 4fr 2fr',
        fontSize: 16,
    },
    cell: {
        display: 'flex',
        alignItems: 'flex-start',
        padding: '16px 8px'
    },
    subCell: {
        padding: '8px 8px'
    },
    btnsCell: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '16px 8px'
    },
    subTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: '#858585',
        marginBottom: 8,
        whiteSpace: 'nowrap'
    },
    subText: {
        fontSize: 14,
    },
    subCellWrapper: {
        display: 'grid',
        gridTemplateColumns: '7fr 2fr'
    }
}))