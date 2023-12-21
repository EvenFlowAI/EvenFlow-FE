import {Button, styled} from "@material-ui/core";

export const ChangeButton = styled(Button)(({theme}) => ({
    width: 'fit-content',
    justifyContent: 'flex-start',
    padding: 8,
    marginBottom: 50,
    marginTop: 12,
    textTransform: 'unset',
    textDecoration: 'underline',
    fontWeight: 'normal',
    [theme.breakpoints.down("md")]: {
        marginBottom: 30,
    },
    [theme.breakpoints.down("sm")]: {
        marginBottom: 20,
    }
}))