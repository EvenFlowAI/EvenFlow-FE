import React, {useMemo} from "react";
import {Box, Grid, Paper} from "@material-ui/core";
import {useSelector} from "react-redux";
import {EditAddressModal} from "../../../features/admin/EditAddressModal/EditAddressModal";
import {HourOfOperationsModal} from "../../../features/admin/HourOfOperationsModal/HourOfOperationsModal";
import {HolidaysModal} from "../../../features/admin/HolidaysModal/HolidaysModal";
import {BreaksModal} from "../../../features/admin/BreaksModal/BreaksModal";
import {Technicians} from "../../../components/modals/admin/Technicians/Technicians";
import {Bays} from "../../../components/modals/admin/Bays/Bays";
import {TitleContainer} from "../../../components/TitleContainer/TitleContainer";
import {concatAddress} from "../../../utils/utils";
import {SquarePaper} from "../../../components/styled/Paper";
import {RootState} from "../../../store/rootReducer";
import {ReactComponent as LaborRateIcon} from "../../../assets/img/labor_rate.svg";
import {ReactComponent as HoursIcon} from "../../../assets/img/Icon 2 Hours of operation.svg";
import {ReactComponent as AddressIcon} from "../../../assets/img/Icon_1_Address.svg";
import {ReactComponent as BaysIcon} from "../../../assets/img/Icon_6 _Bays.svg";
import {ReactComponent as RemindersIcon} from "../../../assets/img/Icon_36px_Appointment_reminders.svg";
import {ReactComponent as EmployeeScheduleIcon} from "../../../assets/img/Subtract.svg";
import {ReactComponent as BreaksIcon} from "../../../assets/img/Icon 4 Breaks.svg";
import {ReactComponent as LockOutlined} from "../../../assets/img/Icon 5 Holidays.svg";
import {ReactComponent as AdvisorIcon} from "../../../assets/img/advisor_assignment.svg";
import {ReactComponent as NotificationsIcon} from "../../../assets/img/notifications.svg";
import RemindersModal from "../../../features/admin/RemindersModal/RemindersModal";
import LaborRateModal from "../../../features/admin/LaborRateModal/LaborRateModal";
import {EmployeeSchedule} from "../../../components/modals/admin/EmployeeSchedule/EmployeeSchedule";
import AdvisorAssignmentModal from "../../../features/admin/AdvisorAssignmentModal/AdvisorAssignmentModal";
import ManageNotificationsModal from "../../../features/admin/ManageNotificationsModal/ManageNotificationsModal";
import {useStyles} from "./styles";
import {TCountData, TDataMap, TItem} from "./types";
import {useModal} from "../../../hooks/useModal/useModal";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useCurrentUser} from "../../../hooks/useCurrentUser/useCurrentUser";

const overallData: TDataMap[] = [
    {label: "Technicians", value: "technicians"},
    {label: "Bays", value: "bays"},
    {label: "Pods", value: "pods"},
    {label: "Appointments Today", value: "appointments"},
];

export const AdminDashboard: React.FC = () => {
    const countData: TCountData = useSelector(({serviceCenters: {analytics}}:RootState) => ({
        technicians: analytics.countOfTechnicians,
        bays: analytics.countOfBays,
        appointments: analytics.countOfAppointmentsToday,
        pods: analytics.countOfPods
    }));
    const {selectedSC} = useSCs();
    const currentUser = useCurrentUser();
    const classes = useStyles();

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
        onClose: onCloseAdvisorAssignment,
        onOpen: onOpenAdvisorAssignment,
        isOpen: isOpenAdvisorAssignment,
    } = useModal();
    const {
        onClose: onCloseManageNotifications,
        onOpen: onOpenManageNotifications,
        isOpen: isOpenManageNotifications,
    } = useModal();

    const items: TItem[] = [
        {label: "Address", icon: <AddressIcon />, action: onOpenAddress},
        {label: "Hours of operation", icon: <HoursIcon />, action: onOpenHOO},
        {label: "Employee Schedule", icon: <EmployeeScheduleIcon />, action: onOpenEmployeeSchedule},
        {label: "Holidays", icon: <LockOutlined />, action: onOpenH},
        {label: "Breaks", icon: <BreaksIcon />, action: onOpenB},
        {label: "Bays", icon: <BaysIcon />, action: onOpenBays},
        {label: "Labor Rate", icon: <LaborRateIcon />, action: onOpenLaborRate},
        {label: "Appointment Reminders", icon: <RemindersIcon />, action: onOpenReminders},
        {label: "Advisor Assignment", icon: <AdvisorIcon />, action: onOpenAdvisorAssignment},
        {label: "Service Center Notifications", icon: <NotificationsIcon />, action: onOpenManageNotifications},
    ];

    return <div className={classes.container}>
        {selectedSC ? <TitleContainer pad title={selectedSC.name}/> : null}
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
        <EditAddressModal open={isAddressOpen} viewMode={isCCRView} onClose={onCloseAddress} />
        <HourOfOperationsModal viewMode={isCCRView} open={isHOOOpen} onClose={onCloseHOO} />
        <EmployeeSchedule open={isOpenEmployeeSchedule} onClose={onCloseEmployeeSchedule}/>
        <HolidaysModal viewMode={isCCRView} open={isHOpen} onClose={onCloseH} />
        <BreaksModal viewMode={isCCRView} open={isBOpen} onClose={onCloseB} />
        <Bays viewMode={isCCRView} open={isBaysOpen} onClose={onCloseBays} />
        <RemindersModal open={isOpenReminders} onClose={onCloseReminders}/>
        <LaborRateModal open={isOpenLaborRate} onClose={onCloseLaborRate}/>
        <AdvisorAssignmentModal open={isOpenAdvisorAssignment} onClose={onCloseAdvisorAssignment}/>
        <ManageNotificationsModal open={isOpenManageNotifications} onClose={onCloseManageNotifications}/>
    </div>
}