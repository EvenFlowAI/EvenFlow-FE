import {Button, styled} from "@material-ui/core";

export const PageWrapper = styled('div')(({theme}) => ({
    minWidth: '50vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 40,
    border: '1px solid #DADADA',
    [theme.breakpoints.down("md")]: {
        padding: 30,
    },
    [theme.breakpoints.down("sm")]: {
        padding: 20,
    }
}))

export const SubTitle = styled('span')(() => ({
    marginBottom: 8,
    fontSize: 20,
    fontWeight: 600,
    color: '#202021',
    textTransform: 'uppercase',
}))

export const CarName = styled('div')(() => ({
    color: "#202021",
    fontWeight: 600,
    fontSize: 24,
}))

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