import React, {useCallback, useMemo} from "react";
import {Box, Button, Grid, Paper} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
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
import {useCurrentUser, useModal, useSCs} from "../../../utils/hooks";
import {Routes} from "../../../config/routes";
import {Technicians} from "../../Modals/Technicians/Technicians";
import {Bays} from "../../Modals/Bays/Bays";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {concatAddress} from "../../../utils/utils";
import {DashPodsModal} from "../../Modals/PODModal/DashPodsModal";
import {TransportationOptions} from "../../Modals/TransportationOptions/TransportationOptions";
import {SquarePaper} from "../../UI/Paper";
import {RootState} from "../../../store/rootReducer";
import {ReactComponent as ServiceCodes} from "../../../assets/img/serviceOpsCodes.svg";
import {ReactComponent as Transportation} from "../../../assets/img/transportation_options.svg";
import {ReactComponent as Consultant} from "../../../assets/img/consultant_configuration.svg";
import {ReactComponent as Vehicle} from "../../../assets/img/vehicleDetails.svg";

const useStyles = makeStyles(theme => ({
    paper: {
        display: "flex",
        padding: theme.spacing(2),
        minHeight: 120,
        flexFlow: "row nowrap",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        borderRadius: 0,
        gap: '8px',
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
    },
    countWrapper: {
        display: "flex",
        justifyContent: "space-around",
        [theme.breakpoints.down("sm")]: {
            flexWrap: "wrap",
            "&>*": {
                textAlign: "center",
                padding: theme.spacing(1),
                width: "50%"
            }
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
type TCountData = {
    technicians: number;
    bays: number;
    pods: number;
    appointments: number;
}
type TDataMap = {
    label: string;
    value: keyof TCountData;
}
const overallData: TDataMap[] = [
    {label: "Technicians", value: "technicians"},
    {label: "Bays", value: "bays"},
    {label: "Pods", value: "pods"},
    {label: "Appointments today", value: "appointments"},
];

export const AdminDashboard: React.FC = () => {
    const {selectedSC} = useSCs();
    const currentUser = useCurrentUser();
    const history = useHistory();
    const isCCRView: boolean = useMemo(() => {
        return ["Call Center Rep", "Advisor"].includes(currentUser?.role || "")
    }, [currentUser]);

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
    const {
        onClose: onCloseTransOptions,
        onOpen: onOpenTransOptions,
        isOpen: isOpenTransOptions,
    } = useModal();
    // todo change actions
    const {
        onClose: onCloseServicesOps,
        onOpen: onOpenServicesOps,
        isOpen: isOpenServicesOps,
    } = useModal();
    const {
        onClose: onCloseConsultant,
        onOpen: onOpenConsultant,
        isOpen: isOpenConsultant,
    } = useModal();

    const countData: TCountData = useSelector(({serviceCenters: {analytics}}:RootState) => ({
        technicians: analytics.countOfTechnicians,
        bays: analytics.countOfBays,
        appointments: analytics.countOfAppointmentsToday,
        pods: analytics.countOfPods
    }));

    const onOpenVehicle = (): void => {
        history.push(Routes.Admin.VehicleDetails);
    }

    const items: TItem[] = [
        {label: "Address", icon: <PlaceOutlined htmlColor='rgb(94, 95, 102)'/>, action: onOpenAddress},
        {label: "Hours of operation", icon: <Alarm htmlColor='rgb(94, 95, 102)'/>, action: onOpenHOO},
        {label: "Weekly schedule", icon: <DateRange htmlColor='rgb(94, 95, 102)'/>, action: onOpenWS},
        {label: "Bays", icon: <Build htmlColor='rgb(94, 95, 102)'/>, action: onOpenBays},
        {label: "Breaks", icon: <FreeBreakfastOutlined htmlColor='rgb(94, 95, 102)'/>, action: onOpenB},
        {label: "Holidays", icon: <LockOutlined htmlColor='rgb(94, 95, 102)'/>, action: onOpenH},
        {label: "Technicians", icon: <PeopleAltOutlined htmlColor='rgb(94, 95, 102)'/>, action: onOpenTech},
        {label: "Pods", icon: <FormatListNumbered htmlColor='rgb(94, 95, 102)'/>, action: onOpenPods},
        {label: "Transportation Options", icon: <Transportation />, action: onOpenTransOptions},
        {label: "Service Ops Codes Mapping", icon: <ServiceCodes />, action: onOpenServicesOps},
        {label: "Consultant Configuration", icon: <Consultant />, action: onOpenConsultant},
        {label: "Vehicle Detail Options", icon: <Vehicle />, action: onOpenVehicle},
    ];

    const classes = useStyles();
    return <div className={classes.container}>
        <DashboardTitle />
        <Box mb={2} className={classes.address}>
            {selectedSC ? concatAddress(selectedSC.address) : null}
        </Box>
        <SquarePaper variant="outlined">
            <Box className={classes.countWrapper} p={2}>
                {overallData.map(d =>
                    <Box key={d.label} display="flex" flexDirection="column" alignItems="center">
                        <span>{d.label}</span>
                        <strong>{countData[d.value]}</strong>
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
                        <span className={classes.edit} onClick={item.action}>
                            {isCCRView
                                ? "View"
                                : "Edit"
                            }
                        </span>
                    </Paper>
                </Grid>
            )}
        </Grid>
        <EditAddress open={isAddressOpen} viewMode={isCCRView} onClose={onCloseAddress} />
        <HourOfOperations viewMode={isCCRView} open={isHOOOpen} onClose={onCloseHOO} />
        <WeeklySchedule viewMode={isCCRView} open={isWSOpen} onClose={onCloseWS} />
        <Break viewMode={isCCRView} open={isBOpen} onClose={onCloseB} />
        <Holidays viewMode={isCCRView} open={isHOpen} onClose={onCloseH} />
        <Technicians open={isTechOpen} onClose={onCloseTech} />
        <Bays viewMode={isCCRView} open={isBaysOpen} onClose={onCloseBays} />
        <DashPodsModal viewMode={isCCRView} open={isOpenPods} onClose={onClosePods} />
        <TransportationOptions viewMode={isCCRView} open={isOpenTransOptions} onClose={onCloseTransOptions}/>
    </div>
}