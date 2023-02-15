import React, {useMemo} from "react";
import {Box, Grid, Paper} from "@material-ui/core";
import {useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {EditAddress} from "../../Modals/EditAddress/EditAddress";
import {HourOfOperations} from "../../Modals/HourOfOperations/HourOfOperations";
import {Holidays} from "../../Modals/Holydays/Holidays";
import {Break} from "../../Modals/Breaks/Break";
import {useCurrentUser, useModal, useSCs} from "../../../utils/hooks";
import {Technicians} from "../../Modals/Technicians/Technicians";
import {Bays} from "../../Modals/Bays/Bays";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {concatAddress} from "../../../utils/utils";
import {SquarePaper} from "../../UI/Paper";
import {RootState} from "../../../store/rootReducer";
import {ReactComponent as LaborRateIcon} from "../../../assets/img/labor_rate.svg";
import {ReactComponent as HoursIcon} from "../../../assets/img/Icon 2 Hours of operation.svg";
import {ReactComponent as ScheduleIcon} from "../../../assets/img/Icon_3_Weekly_schedule.svg";
import {ReactComponent as AddressIcon} from "../../../assets/img/Icon_1_Address.svg";
import {ReactComponent as BaysIcon} from "../../../assets/img/Icon_6 _Bays.svg";
import {ReactComponent as RemindersIcon} from "../../../assets/img/Icon_36px_Appointment_reminders.svg";
import {ReactComponent as EmployeeScheduleIcon} from "../../../assets/img/Subtract.svg";
import {ReactComponent as BreaksIcon} from "../../../assets/img/Icon 4 Breaks.svg";
import {ReactComponent as LockOutlined} from "../../../assets/img/Icon 5 Holidays.svg";
import Reminders from "../../Modals/Reminders/Reminders";
import LaborRate from "../../Modals/LaborRate/LaborRate";
import {EmployeeSchedule} from "../../Modals/EmployeeSchedule/EmployeeSchedule";
import {WeeklySchedule} from "../../Modals/WeeklySchedule/WeeklySchedule";

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
    const {selectedSC} = useSCs();
    if (!selectedSC) return null;

    return <TitleContainer pad title={selectedSC.name}/>;
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
    {label: "Appointments Today", value: "appointments"},
];

export const AdminDashboard: React.FC = () => {
    const {selectedSC} = useSCs();
    const currentUser = useCurrentUser();
    const isCCRView: boolean = useMemo(() => {
        return ["Call Center Rep", "Advisor"].includes(currentUser?.role || "")
    }, [currentUser]);
    const isManager: boolean = useMemo(() => {
        return ["Manager"].includes(currentUser?.role || "")
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
        onClose: onCloseBays,
        onOpen: onOpenBays,
        isOpen: isBaysOpen
    } = useModal();
    const {
        onClose: onCloseReminders,
        onOpen: onOpenReminders,
        isOpen: isOpenReminders,
    } = useModal();
    const {
        onClose: onCloseLaborRate,
        onOpen: onOpenLaborRate,
        isOpen: isOpenLaborRate,
    } = useModal();
    const {
        onClose: onCloseEmployeeSchedule,
        onOpen: onOpenEmployeeSchedule,
        isOpen: isOpenEmployeeSchedule,
    } = useModal();
    const {
        onClose: onCloseWS,
        onOpen: onOpenWS,
        isOpen: isWSOpen
    } = useModal();

    const countData: TCountData = useSelector(({serviceCenters: {analytics}}:RootState) => ({
        technicians: analytics.countOfTechnicians,
        bays: analytics.countOfBays,
        appointments: analytics.countOfAppointmentsToday,
        pods: analytics.countOfPods
    }));

    const items: TItem[] = [
        {label: "Address", icon: <AddressIcon />, action: onOpenAddress},
        {label: "Hours of operation", icon: <HoursIcon />, action: onOpenHOO},
        {label: "Weekly schedule", icon: <ScheduleIcon />, action: onOpenWS},
        {label: "Employee Schedule", icon: <EmployeeScheduleIcon />, action: onOpenEmployeeSchedule},
        {label: "Holidays", icon: <LockOutlined />, action: onOpenH},
        {label: "Breaks", icon: <BreaksIcon />, action: onOpenB},
        {label: "Bays", icon: <BaysIcon />, action: onOpenBays},
        {label: "Labor Rate", icon: <LaborRateIcon />, action: onOpenLaborRate},
        {label: "Appointment Reminders", icon: <RemindersIcon />, action: onOpenReminders},
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
                            {isCCRView || isManager && item.label === "Holidays"
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
        <EmployeeSchedule open={isOpenEmployeeSchedule} onClose={onCloseEmployeeSchedule}/>
        <Holidays viewMode={isCCRView} open={isHOpen} onClose={onCloseH} />
        <Break viewMode={isCCRView} open={isBOpen} onClose={onCloseB} />
        <Bays viewMode={isCCRView} open={isBaysOpen} onClose={onCloseBays} />
        <Reminders open={isOpenReminders} onClose={onCloseReminders}/>
        <LaborRate open={isOpenLaborRate} onClose={onCloseLaborRate}/>
        <WeeklySchedule open={isWSOpen} onClose={onCloseWS} />
    </div>
}