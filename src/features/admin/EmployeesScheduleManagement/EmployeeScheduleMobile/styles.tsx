import {makeStyles} from "tss-react/mui";
import {styled} from "@mui/material";

export const useStyles = makeStyles()(() => ({
    drawer: {
        padding: '12px 16px 12px 0',
        background: "#F7F8FB",
        borderRadius: 4,
        boxShadow: "0px -8px 20px 0px rgba(0, 0, 0, 0.10)",
        border: 'none'
    },
    disabledIcon: {
        '& > path': {
            fill: "lightgrey"
        }
    },
    pagination: {
        marginBottom: 36,
        '& > div:first-child': {
            padding: 0
        }
    }
}))

export const Row = styled('div')({
    display: 'grid',
    gridTemplateColumns: '6fr 4fr 2fr',
    fontSize: 16,
})

export const Cell = styled('div')({
    display: 'flex',
    alignItems: 'flex-start',
    padding: '16px 8px'
})

export const SubCell = styled('div')({
    padding: '8px 8px'
})

export const SubCellFlex = styled(SubCell)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
})


export const BtnsCell = styled('div')({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    padding: '16px 8px'
})

export const SubTitle = styled('div')({
    fontSize: 14,
    fontWeight: 700,
    color: '#858585',
    marginBottom: 8,
    whiteSpace: 'nowrap'
})

export const SubText = styled('div')({
    fontSize: 14,
})

export const SubCellWrapper = styled('div')({
    display: 'grid',
    gridTemplateColumns: '1fr'
})

export const Menu = styled('div')({
    display: "flex",
    justifyContent: 'space-between',
})

export const MenuItem = styled('div')({
    padding: 16,
    fontSize: 18,
})

export const Wrapper = styled('div')({
    marginBottom: 24,
    width: '100%'
})