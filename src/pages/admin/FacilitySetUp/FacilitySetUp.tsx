import React, {useMemo} from "react";
import {Grid, Paper} from "@mui/material";
import {HourOfOperationsModal} from "../../../features/admin/HourOfOperationsModal/HourOfOperationsModal";
import {HolidaysModal} from "../../../features/admin/HolidaysModal/HolidaysModal";
import {BreaksModal} from "../../../features/admin/BreaksModal/BreaksModal";
import {Bays} from "../../../components/modals/admin/Bays/Bays";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {ReactComponent as LaborRateIcon} from "../../../assets/img/labor_rate.svg";
import {ReactComponent as HoursIcon} from "../../../assets/img/Icon 2 Hours of operation.svg";
import {ReactComponent as BaysIcon} from "../../../assets/img/Icon_6 _Bays.svg";
import {ReactComponent as BreaksIcon} from "../../../assets/img/Icon 4 Breaks.svg";
import {ReactComponent as LockOutlined} from "../../../assets/img/Icon 5 Holidays.svg";
import LaborRateModal from "../../../features/admin/LaborRateModal/LaborRateModal";
import {useModal} from "../../../hooks/useModal/useModal";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useCurrentUser} from "../../../hooks/useCurrentUser/useCurrentUser";
import {centerProfileRoot} from "../../../utils/constants";
import {useDashboardStyles} from "../../../hooks/styling/useDashboardStyles";
import {TDashboardItem} from "../../../types/types";
import DnDExample from "../../../components/DragAndDrop/dnDExample";

export const FacilitySetUp: React.FC<React.PropsWithChildren<React.PropsWithChildren>> = () => {
    const {selectedSC} = useSCs();
    const currentUser = useCurrentUser();
    const { classes  } = useDashboardStyles();


    const isCCRView: boolean = useMemo(() => {
        return ["Call Center Rep", "Advisor"].includes(currentUser?.role || "")
    }, [currentUser]);

    const isManager: boolean = useMemo(() => {
        return ["Manager"].includes(currentUser?.role || "")
    }, [currentUser]);

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

    const items: TDashboardItem[] = [
        {label: "Hours of operation", icon: <HoursIcon />, action: onOpenHOO},
        {label: "Holidays", icon: <LockOutlined />, action: onOpenH},
        {label: "Breaks", icon: <BreaksIcon />, action: onOpenB},
        {label: "Bays", icon: <BaysIcon />, action: onOpenBays},
        {label: "Labor Rate", icon: <LaborRateIcon />, action: onOpenLaborRate},
    ];

    // todo replace Labor rate

    return <div className={classes.container}>
        {selectedSC ? <TitleContainer pad title="Facility Set Up" parent={centerProfileRoot}/> : null}
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
            <DnDExample/>
        </Grid>
        <HourOfOperationsModal viewMode={isCCRView} open={isHOOOpen} onClose={onCloseHOO} />
        <HolidaysModal viewMode={isCCRView} open={isHOpen} onClose={onCloseH} />
        <BreaksModal viewMode={isCCRView} open={isBOpen} onClose={onCloseB} />
        <Bays viewMode={isCCRView} open={isBaysOpen} onClose={onCloseBays} />
        <LaborRateModal open={isOpenLaborRate} onClose={onCloseLaborRate}/>
    </div>
}