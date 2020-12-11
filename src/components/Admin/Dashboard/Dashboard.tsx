import React, {useCallback, useMemo} from "react";
import {Box, Button, Grid, Paper} from "@material-ui/core";
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
import {SquarePaper} from "../../UI/Paper";

const useStyles = makeStyles(theme => ({
    paper: {
        display: "flex",
        padding: theme.spacing(2),
        minHeight: 120,
        flexFlow: "row nowrap",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        borderRadius: 0
    },
    container: {
        width: "100%",
        maxWidth: theme.breakpoints.values.lg
    },
    icon: {
        "& .MuiSvgIcon-root": {
            fontSize: 40
        }
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        margin: 0,
        [theme.breakpoints.down("sm")]: {
            fontSize: 14
        }
    },
    edit: {
        cursor: "pointer",
        alignSelf: "flex-start",
        fontSize: 14,
        padding: 0,
        display: "inline-block",
        fontWeight: "bold",
        color: theme.palette.primary.main,
        transition: theme.transitions.create(["color"]),
        "&:hover": {
            color: theme.palette.primary.dark
        },
        [theme.breakpoints.down("sm")]: {
            alignSelf: "center"
        }
    },
    address: {
        fontSize: 18,
        color: theme.palette.text.disabled,
        [theme.breakpoints.down("sm")]: {
            textAlign: "center"
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
        // subtitle={concatAddress(selectedSC.address)}
    />;
}

type TItem = {
    label: string;
    icon: JSX.Element;
    action: () => void;
}
type TDataMap = {
    label: string;
    value: number;
}
const overallData: TDataMap[] = [
    {label: "Technicians", value: 12},
    {label: "Bays", value: 2},
    {label: "Pods", value: 1},
    {label: "Appointments today", value: 20},
]

export const AdminDashboard: React.FC = () => {
    const {selectedSC} = useSCs();
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
        <Box mb={2} className={classes.address}>
            {selectedSC ? concatAddress(selectedSC.address) : null}
        </Box>
        <SquarePaper variant="outlined">
            <Box p={2} display="flex" justifyContent="space-around">
                {overallData.map(d =>
                    <Box key={d.label} display="flex" flexDirection="column" alignItems="center">
                        <span>{d.label}</span>
                        <strong>{d.value}</strong>
                    </Box>
                )}
            </Box>
        </SquarePaper>
        <Box p={1.5} />
        <Grid container spacing={2}>
            {items.map(item =>
                <Grid item xs={12} sm={4} md={3} key={item.label}>
                    <Paper variant="outlined" className={classes.paper}>
                        <div className={classes.icon}>{item.icon}</div>
                        <h4 className={classes.label}>{item.label}</h4>
                        <span className={classes.edit} onClick={item.action}>Edit</span>
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