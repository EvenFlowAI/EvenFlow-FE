import {styled} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

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