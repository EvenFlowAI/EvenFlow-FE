import {styled} from "@mui/material";

export const UserWrapper = styled("div")({
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 3fr',
    border: '1px solid #DADADA',
    '& > div': {
        padding: 16,
        fontWeight: 700,
        textTransform: 'capitalize',
    },
    '& > div:not(:last-child)': {
        borderRight: '1px solid #DADADA'
    }
})

export const RowWrapper = styled("div")({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 4fr',
    textTransform: 'uppercase',
    fontWeight: 700,
    marginBottom: 24,
})

export const DayName = styled('div')({
    fontSize: 18,
    fontWeight: 700
})

export const SwitcherLabel = styled('p')({
    fontSize: 14,
    fontWeight: 700
})

export const PickersWrapper = styled("div")({
    display: 'grid',
    justifyContent: 'space-between',
    gap: 24,
    fontSize: 18,
    fontWeight: 700
})