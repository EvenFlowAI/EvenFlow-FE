import React, {forwardRef} from "react";
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
} from "@mui/material";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {getInitials} from "../../../utils/utils";
import {ServiceCenterSelector} from "./ServiceCenterSelector/ServiceCenterSelector";
import {PodSelector} from "./PodSelector/PodSelector";
import {Menu as MenuIcon, SupervisorAccount} from "@mui/icons-material";
import clsx from "clsx";
import {clearSC} from "../../../store/reducers/serviceCenters/actions";
import {useStyles} from "./styles";
import {Roles} from "../../../types/types";
import {Routes} from "../../../routes/constants";
import {authService} from "../../../api/AuthService/AuthService";

type TProps = {
    sideBarOpened?: boolean;
    onOpen: () => void;
}

export const NavBar = forwardRef<HTMLDivElement, TProps>(({sideBarOpened, onOpen}, ref) => {
    const {currentUser} = useSelector((state: RootState) => state.users);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    const { classes  } = useStyles();
    const history = useHistory();
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
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
            {(isTablet && !sideBarOpened) ? <IconButton onClick={onOpen} size="large"><MenuIcon /></IconButton> : null}
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
    </>;
});