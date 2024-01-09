import {styled} from "@material-ui/core";

export const Container = styled('div')({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minHeight: "100%",
    padding: 20,
    maxWidth: 1280,
    margin: "auto"
});

export const SidebarWrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "1fr 3fr",
    gap: "20px",
    alignItems: "flex-start",
    width: "100%",
    marginTop: 28,
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: "1fr"
    }
}));