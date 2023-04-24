import {styled} from "@material-ui/core";

export const StepWrapper = styled('div')(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    flexDirection: "column",
    width: "100%",
    [theme.breakpoints.down('sm')]: {
        marginBottom: "auto",
    }
}))

export const PackagesStepWrapper = styled('div')(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    flexDirection: "column",
    width: "100%",
    [theme.breakpoints.down('sm')]: {
        marginBottom: "auto",
    }
}))