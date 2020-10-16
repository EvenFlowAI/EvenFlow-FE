import React, {useCallback, useMemo} from "react";
import {Button, Grid, Paper} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {
    Alarm, Build, ChevronRight,
    DateRange, FormatListNumbered,
    FreeBreakfastOutlined,
    LockOutlined,
    PeopleAltOutlined,
    PlaceOutlined
} from "@material-ui/icons";
import {EditAddress} from "../../Modals/EditAddress/EditAddress";
import {HourOfOperations} from "../../Modals/HourOfOperations/HourOfOperations";
import {WeeklySchedule} from "../../Modals/WeeklySchedule/WeeklySchedule";
import {Holidays} from "../../Modals/Holydays/Holidays";
import {Break} from "../../Modals/Breaks/Break";
import {useModal, useSCs} from "../../../utils/hooks";
import {Routes} from "../../../config/routes";
import {Technicians} from "../../Modals/Technicians/Technicians";
import {Bays} from "../../Modals/Bays/Bays";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {concatAddress} from "../../../utils/utils";
import {DashPodsModal} from "../../Modals/PODModal/DashPodsModal";

const useStyles = makeStyles(theme => ({
    paper: {
        position: "relative",
        borderRadius: 0
    },
    container: {
        width: "100%",
        maxWidth: theme.breakpoints.values.lg
    },
    icon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 120,
        "& .MuiSvgIcon-root": {
            fontSize: 40
        }
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        marginTop: 0
    },
    edit: {
        cursor: "pointer",
        fontSize: 14,
        padding: 12,
        display: "inline-block",
        position: "absolute",
        right: 0,
        top: 0,
        fontWeight: "bold",
        color: theme.palette.primary.main,
        transition: theme.transitions.create(["color"]),
        "&:hover": {
            color: theme.palette.primary.dark
        }
    }
}));

const DashboardTitle = () => {
    const history = useHistory();
    const handleGoToOptimizer = useCallback(() => {
        history.push(Routes.Optimizer.Base);
    }, [history]);
    const {selectedSC} = useSCs();
    const actions = useMemo(() => {
        return <Button
            variant="contained"
            color="primary"
            endIcon={<ChevronRight />}
            onClick={handleGoToOptimizer}>go to optimizer settings
        </Button>;
    }, [handleGoToOptimizer]);
    if (!selectedSC) return null;

    return <TitleContainer
        pad
        actions={actions}
        title={selectedSC.name}
        subtitle={concatAddress(selectedSC.address)}
    />;
}

type TItem = {
    label: string;
    icon: JSX.Element;
    action: () => void;
}

export const AdminDashboard: React.FC = () => {
    const {
        onClose: onCloseAddress,
        onOpen: onOpenAddress,
        isOpen: isAddressOpen
    } = useModal();
    const {
        onClose: onCloseHOO,
        onOpen: onOpenHOO,
        isOpen: isHOOOpen
    } = useModal();
    const {
        onClose: onCloseWS,
        onOpen: onOpenWS,
        isOpen: isWSOpen
    } = useModal();
    const {
        onClose: onCloseB,
        onOpen: onOpenB,
        isOpen: isBOpen
    } = useModal();
    const {
        onClose: onCloseH,
        onOpen: onOpenH,
        isOpen: isHOpen
    } = useModal();
    const {
        onClose: onCloseTech,
        onOpen: onOpenTech,
        isOpen: isTechOpen
    } = useModal();
    const {
        onClose: onCloseBays,
        onOpen: onOpenBays,
        isOpen: isBaysOpen
    } = useModal();
    const {
        onClose: onClosePods,
        onOpen: onOpenPods,
        isOpen: isOpenPods,
    } = useModal();

    const items: TItem[] = [
        {label: "Address", icon: <PlaceOutlined />, action: onOpenAddress},
        {label: "Hours of operation", icon: <Alarm />, action: onOpenHOO},
        {label: "Weekly schedule", icon: <DateRange />, action: onOpenWS},
        {label: "Bays", icon: <Build />, action: onOpenBays},
        {label: "Breaks", icon: <FreeBreakfastOutlined />, action: onOpenB},
        {label: "Holidays", icon: <LockOutlined />, action: onOpenH},
        {label: "Technician stuff", icon: <PeopleAltOutlined />, action: onOpenTech},
        {label: "Pods", icon: <FormatListNumbered />, action: onOpenPods},
    ];

    const classes = useStyles();
    return <div className={classes.container}>
        <DashboardTitle />
        <Grid container spacing={2}>
            {items.map(item =>
                <Grid item xs={4} key={item.label}>
                    <Paper variant="outlined" className={classes.paper}>
                        <span className={classes.edit} onClick={item.action}>Edit</span>
                        <div className={classes.icon}>{item.icon}</div>
                        <h4 className={classes.label}>{item.label}</h4>
                    </Paper>
                </Grid>
            )}
        </Grid>
        <EditAddress open={isAddressOpen} onClose={onCloseAddress} />
        <HourOfOperations open={isHOOOpen} onClose={onCloseHOO} />
        <WeeklySchedule open={isWSOpen} onClose={onCloseWS} />
        <Break open={isBOpen} onClose={onCloseB} />
        <Holidays open={isHOpen} onClose={onCloseH} />
        <Technicians open={isTechOpen} onClose={onCloseTech} />
        <Bays open={isBaysOpen} onClose={onCloseBays} />
        <DashPodsModal open={isOpenPods} onClose={onClosePods} />
    </div>
}