import React, {useEffect, useMemo, useState} from "react";
import {Box, Grid, Paper} from "@mui/material";
import {useSelector} from "react-redux";
import {EditAddressModal} from "../../../features/admin/EditAddressModal/EditAddressModal";
import {HourOfOperationsModal} from "../../../features/admin/HourOfOperationsModal/HourOfOperationsModal";
import {HolidaysModal} from "../../../features/admin/HolidaysModal/HolidaysModal";
import {BreaksModal} from "../../../features/admin/BreaksModal/BreaksModal";
import {Bays} from "../../../components/modals/admin/Bays/Bays";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {concatAddress} from "../../../utils/utils";
import {SquarePaper} from "../../../components/styled/Paper";
import {RootState} from "../../../store/rootReducer";
import {ReactComponent as LaborRateIcon} from "../../../assets/img/labor_rate.svg";
import {ReactComponent as HoursIcon} from "../../../assets/img/Icon 2 Hours of operation.svg";
import {ReactComponent as AddressIcon} from "../../../assets/img/Icon_1_Address.svg";
import {ReactComponent as BaysIcon} from "../../../assets/img/Icon_6 _Bays.svg";
import {ReactComponent as BreaksIcon} from "../../../assets/img/Icon 4 Breaks.svg";
import {ReactComponent as LockOutlined} from "../../../assets/img/Icon 5 Holidays.svg";
import LaborRateModal from "../../../features/admin/LaborRateModal/LaborRateModal";
import {useStyles} from "./styles";
import {TCountData, TItem} from "./types";
import {useModal} from "../../../hooks/useModal/useModal";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useCurrentUser} from "../../../hooks/useCurrentUser/useCurrentUser";
import {blankCountData, overallData} from "./constants";

export const AdminDashboard: React.FC<React.PropsWithChildren<React.PropsWithChildren>> = () => {
    const {analytics} = useSelector((state:RootState) => state.serviceCenters);
    const [countData, setCountData] = useState<TCountData>(blankCountData)
    const {selectedSC} = useSCs();
    const currentUser = useCurrentUser();
    const { classes  } = useStyles();

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
        onClose: onCloseLaborRate,
        onOpen: onOpenLaborRate,
        isOpen: isOpenLaborRate,
    } = useModal();

    const items: TItem[] = [
        {label: "Address", icon: <AddressIcon />, action: onOpenAddress},
        {label: "Hours of operation", icon: <HoursIcon />, action: onOpenHOO},
        {label: "Holidays", icon: <LockOutlined />, action: onOpenH},
        {label: "Breaks", icon: <BreaksIcon />, action: onOpenB},
        {label: "Bays", icon: <BaysIcon />, action: onOpenBays},
        {label: "Labor Rate", icon: <LaborRateIcon />, action: onOpenLaborRate},
    ];

    useEffect(() => {
        setCountData({
            technicians: analytics.countOfTechnicians,
            bays: analytics.countOfBays,
            appointments: analytics.countOfAppointmentsToday,
            pods: analytics.countOfPods
        })
    }, [analytics]);

    return <div className={classes.container}>
        {selectedSC ? <TitleContainer pad title={selectedSC.name}/> : null}
        <Box mb={2} className={classes.address}>
            {selectedSC ? concatAddress(selectedSC.address) : null}
        </Box>
        <SquarePaper variant="outlined">
            <Box className={classes.countWrapper} p={2}>
                {overallData.map(d =>
                    <Box key={d.label} display="flex" flexDirection="column" alignItems="center" sx={{fontSize: 14}}>
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
        <HolidaysModal viewMode={isCCRView} open={isHOpen} onClose={onCloseH} />
        <BreaksModal viewMode={isCCRView} open={isBOpen} onClose={onCloseB} />
        <Bays viewMode={isCCRView} open={isBaysOpen} onClose={onCloseBays} />
        <LaborRateModal open={isOpenLaborRate} onClose={onCloseLaborRate}/>
    </div>
}