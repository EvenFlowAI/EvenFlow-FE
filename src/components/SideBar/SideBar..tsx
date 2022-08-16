import React, {useMemo} from "react";
import {Button, Drawer, IconButton, List, useMediaQuery, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import logo from '../../assets/img/logoSidebar.svg';
import {LinkType, LinkTypeWithSub} from "../../types/types";
import {sideBarWidth} from "../../theme/theme";
import {Routes} from "../../config/routes";
import {useCurrentUser, useModal, useSCs} from "../../utils/hooks";
import {useLocation, useHistory, matchPath} from "react-router-dom";
import {ArrowForwardIos, Close} from "@material-ui/icons";
import {BookingModal} from "../Modals/BookingModal/BookingModal";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {Loading} from "../UI/Loading";
import Link from "./Link";

const useStyles = makeStyles(theme => ({
    drawer: {
        flexShrink: 0,
        width: sideBarWidth,
        display: "flex",
        flexFlow: "column",
        position: "relative",
        [theme.breakpoints.down("xs")]: {
            width: "100%",
        }
    },
    link: {
        color: "#fff"
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10
    },
    logo: {
        maxWidth: "80%",
        marginBottom: 60,
        cursor: "pointer",
        transition: theme.transitions.create(['opacity']),
        "&:hover": {
            opacity: .8
        }
    },
    drawerPaper: {
        width: sideBarWidth,
        backgroundColor: "#252525",
        color: "#FFFFFF",
        display: "flex",
        flexFlow: "column",
        padding: "60px 30px",
        alignItems: "center",
        [theme.breakpoints.down("xs")]: {
            width: "100%"
        }
    },
}));

const SULinks: LinkType[] = [
    {to: Routes.Admin.DealershipGroups, name: "Dealership Groups", roles: ["Super Admin"]},
    // {to: Routes.Admin.Employees, name: "Employees", roles: ["Super Admin"]},
    {to: Routes.Admin.ServiceCenters, name: "Service Centers", roles: ["Super Admin"]},
    {to: Routes.Admin.ServiceRequests, name: "Service Requests", roles: ["Super Admin"]}
];

const MainLinksWithSub: LinkTypeWithSub[] = [
    {to: Routes.Admin.ServiceCenters, name: "Service Centers", roles: ["Owner"]},
    {to: Routes.Admin.Employees, name: "Employees", roles: ["Owner", "Manager"]},
    {to: Routes.Admin.Base, name: "Operational Set Up", exact: true, roles: ["Owner", "Manager"]},
    {to: Routes.Optimizer.Base, name: "Capacity Optimization", exact: true, roles: ["Owner", "Manager"], subLinks: [
            {to: Routes.Optimizer.ServiceRequests, name: "Service Requests", sub: true, roles: ["Owner", "Manager"]},
            {to: Routes.Optimizer.AppointmentValue, name: "Appointment Value Settings", sub: true, roles: ["Owner", "Manager"]},
            {to: Routes.Optimizer.AppointmentSlotScoring, name: "Appointment Slot Scoring", sub: true, roles: ["Owner", "Manager"]},
            {to: Routes.Optimizer.AppointmentAllocation, name: "Appointment Allocation", sub: true, roles: ["Owner", "Manager"]},
            {to: Routes.Optimizer.OptimizationWindows, name: "Optimization Windows", sub: true, roles: ["Owner", "Manager"]},
            {to: Routes.Optimizer.Pods, name: "Pods", sub: true, roles: ["Owner", "Manager"]},
            {to: Routes.Optimizer.ManageEXEvenFlowAppointments, name: "Manage Ex EvenFlow Appointments", sub: true, roles: ["Owner", "Manager"]},
            {to: Routes.Optimizer.CapacitySettings, name: "Capacity Settings", sub: true, roles: ["Owner", "Manager"]},
        ]},
    {to: Routes.Pricing.Base, name: "Pricing", roles: ["Owner", "Manager"], subLinks: [
            {to: Routes.Pricing.ServicePricingSettings, name: "Service Price Settings", exact: true, sub: true, roles: ["Owner", "Manager"]},
            {to: Routes.Pricing.MobileService, name: "Mobile Service", exact: true, sub: true, roles: ["Owner", "Manager"]},
            {to: Routes.Pricing.ServiceValet, name: "Service Valet", exact: true, sub: true, roles: ["Owner", "Manager"]},
            {to: Routes.Pricing.OfferManagement, name: "Offer Management", exact: true, sub: true, roles: ["Owner", "Manager"]},
        ]},

    {to: Routes.BookingFlow.Base, name: "Booking Flow", roles: ["Owner", "Manager"], subLinks: [
            {to: Routes.BookingFlow.BookingFlowConfigDetails, name: "Booking Flow Config", exact: true, sub: true, roles: ["Owner", "Manager"]},
            {to: Routes.BookingFlow.TransportationOptions, name: "Transportation Options", exact: true, sub: true, roles: ["Owner", "Manager"]},
            {to: Routes.BookingFlow.ServiceOpsCodesMapping, name: "Service Ops Code Mapping", exact: true, sub: true, roles: ["Owner", "Manager"]},
            {to: Routes.BookingFlow.VehicleDetails, name: "Vehicle Detail Options", exact: true, sub: true, roles: ["Owner", "Manager"]},
        ]},
    {to: Routes.Admin.Appointments, name: "Appointments", roles: true},
    {to: Routes.Admin.Reporting, name: "Reporting", roles: ["Owner", "Manager"]},
]

type TProps = {
    isOpened: boolean;
    onClose: () => void;
};

export const SideBar: React.FC<TProps> = ({isOpened, onClose}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));
    const {onClose: onModalClose, isOpen, onOpen} = useModal();

    const currentUser = useCurrentUser();
    const { loading } = useSelector((state: RootState) => state.users);
    const {pathname} = useLocation();
    const {selectedSC} = useSCs();
    const history = useHistory();

    const links: LinkTypeWithSub[] = useMemo(() => {
        if (matchPath(pathname, Routes.Admin.Base) && currentUser?.isSuperUser) {
            return SULinks;
        }
        return MainLinksWithSub;
    }, [currentUser, pathname]);

    const handleLogoClick = () => {
        history.push(Routes.Admin.Base);
    }

    const closeSidebar = () => {
        if (isXS) {
            onClose();
        }
    }

    const onProdPush = () => {}

    return <Drawer
        className={classes.drawer}
        classes={{paper: classes.drawerPaper}}
        variant={!isTablet ? "permanent" : "persistent"}
        open={isOpened}
        anchor="left"
    >
        {isTablet
            ? <IconButton
                className={classes.closeButton}
                onClick={onClose}>
                <Close style={{color: "#fff"}} />
            </IconButton>
            : null}
        <img onClick={handleLogoClick} className={classes.logo} src={logo} alt="EvenFlow AI"/>
        <List disablePadding>
            {loading
                ? <Loading/>
                : links.map(link =>  <Link link={link} closeSidebar={closeSidebar} key={link.name}/>)
            }
        </List>
        <div style={{flex: 1}} />
        {selectedSC
            ? <>
            <Button
                endIcon={<ArrowForwardIos/>}
                className={classes.link}
                onClick={onOpen}>
                Booking UI
            </Button>
                 {currentUser && ["Call Center Rep", "Advisor"].includes(currentUser?.role)
                     ? null
                     : <Button
                         endIcon={<ArrowForwardIos/>}
                         className={classes.link}
                         onClick={onProdPush}>
                         Push To Prod
                     </Button>}
            </>
            : null}
        <BookingModal open={isOpen} onClose={onModalClose} />
    </Drawer>
};