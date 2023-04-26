import React, {forwardRef} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {
    AppBar,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import {sideBarWidth} from "../../theme/theme";
import {authService} from "../../config/requests";
import { useHistory } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {getInitials} from "../../utils/utils";
import {ServiceCenterSelector} from "./ServiceCenterSelector";
import {Roles} from "../../config/constants";
import {Routes} from "../../config/routes";
import {PodSelector} from "./PodSelector";
import {Menu as MenuIcon, SupervisorAccount} from "@material-ui/icons";
import clsx from "clsx";
import {clearSC} from "../../store/reducers/serviceCenters/actions";


const useStyles = makeStyles(theme => ({
    root: {
        width: `calc(100% - ${sideBarWidth}px)`,
        color: "#858585",
        alignItems: "center",
        backgroundColor: theme.palette.background.paper,
        marginLeft: sideBarWidth,
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        flexDirection: "row",
        justifyContent: "space-between",
        transition: theme.transitions.create(["width"]),
        [theme.breakpoints.down("md")]: {
            transition: theme.transitions.create(["width"]),
            width: "100%",
        }
    },
    openedRoot: {
        [theme.breakpoints.down("md")]: {
            width: `calc(100% - ${sideBarWidth}px)`,
        }
    },
    toolbar: {
        justifyContent: "flex-end"
    },
    name: {
        fontSize: 16,
        marginRight: 10,
        fontWeight: "bold",
        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    avatar: {
        backgroundColor: theme.palette.primary.dark,
        cursor: "pointer",
    },
    rootAvatar: {
        border: `2px solid ${theme.palette.secondary.main}`
    }
}));
type TProps = {
    sideBarOpened?: boolean;
    onOpen: () => void;
}
export const NavBar = forwardRef<HTMLDivElement, TProps>(({sideBarOpened, onOpen}, ref) => {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));

    const {currentUser} = useSelector((state: RootState) => state.users);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    const isAdminDealership = currentUser?.adminDealership ?? false;
    const handleClick: React.MouseEventHandler<HTMLElement> = e => {
        setAnchorEl(e.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }
    const openProfile = () => {
        handleClose();
        history.push(Routes.Admin.Profile);
    }

    const handleLogout = () => {
        setAnchorEl(null);
        authService.logout();
        dispatch(clearSC());
        window.location.reload();
    }

    return <>
        <AppBar ref={ref} className={clsx(
            classes.root,
            {[classes.openedRoot]: sideBarOpened}
        )}>
            {(isTablet && !sideBarOpened) ? <IconButton onClick={onOpen}><MenuIcon /></IconButton> : null}
            <Toolbar>
                <PodSelector />
            </Toolbar>
            <Toolbar className={classes.toolbar}>
                <ServiceCenterSelector />
                <Typography className={classes.name} variant="h4">{currentUser?.fullName || ""}</Typography>
                <Avatar
                    src={currentUser?.avatarPath}
                    className={clsx(classes.avatar,
                        ...[isAdminDealership ? classes.rootAvatar : undefined])}
                    onClick={handleClick}>
                    {getInitials(currentUser?.fullName || '-')}
                </Avatar>
                <Menu
                    id="fade-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    {isAdminDealership ? <MenuItem disabled>
                        <SupervisorAccount style={{marginRight: 8}} color="secondary" />
                        <Typography color="secondary">Root Access</Typography>
                    </MenuItem> : null}
                    <MenuItem onClick={openProfile}>
                        {currentUser?.role === Roles.Owner ? "Company Settings" : "Change Password"}
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>{isAdminDealership ? "Exit" : "Logout"}</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    </>
});