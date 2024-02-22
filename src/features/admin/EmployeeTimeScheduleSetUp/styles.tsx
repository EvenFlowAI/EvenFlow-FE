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
    },
    marginBottom: 24,
})

export const RowWrapper = styled("div")({
    width: "100%",
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 2fr',
    textTransform: 'uppercase',
    fontWeight: 700,
    marginBottom: 24,
    padding: '0 16px'
})

export const DayName = styled('div')({
    display: 'flex',
    alignItems: "center",
    fontSize: 18,
    fontWeight: 700,
})

export const SwitcherLabel = styled('p')({
    fontSize: 14,
    fontWeight: 700
})

export const SwitcherWrapper = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: 20
})

export const PickersWrapper = styled("div")({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24,
    fontSize: 18,
    fontWeight: 700
})