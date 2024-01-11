import {styled} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';

export const Wrapper = styled('div')({
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
})

export const useStyles = makeStyles(() => ({
    select: {
        borderRadius: 0,
        border: 'none',
        fontWeight: 'bold',
        textDecoration: 'underline',
        '&:before': {
            display: 'none',
        },
        '& > div': {
            '&:focus': {
                backgroundColor: 'transparent'
            }
        },
    },
    menuItem: {}
}))