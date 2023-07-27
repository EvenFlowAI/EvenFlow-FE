import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {IconButton, useMediaQuery, useTheme} from "@material-ui/core";
import {getMaintenanceList} from "./uiUtils";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {ReactComponent as TrashBin} from "../../../assets/img/trash_bin.svg";
import {loadSRs} from "../../../store/reducers/appointment/actions";
import {IMaintenanceItem} from "./types";
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import {
    deleteGeneralService,
    deleteIndService,
    deletePackage,
    deleteRecall,
    deleteValueService,
    setSideBarSteps,
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useConfirm} from "../../../utils/hooks";
import {loadCategoriesByQuery} from "../../../store/reducers/categories/actions";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles((theme) => ({
    wrapper: {
        width: '100%',
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.down("sm")]: {

        }
    },
    itemWrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: '16px 24px',
        background: "white",
        border: "1px solid #DADADA",
        fontSize: 18,
        [theme.breakpoints.down("sm")]: {
            padding: '24px 16px',
        }
    },
    title: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        color: '#252525',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    }
}))

type TCartItemProps = {
    item: IMaintenanceItem;
    onClick: (item: IMaintenanceItem) => void;
}

const CartItem: React.FC<TCartItemProps> = ({ item, onClick}) => {
    const classes = useStyles();
    return <div className={classes.itemWrapper}>
        <div>{item.name}</div>
        <IconButton onClick={() => onClick(item)} style={{padding: 0}}><TrashBin/></IconButton>
    </div>
}

const CartTable = () => {
    const {
        selectedPackage,
        categoriesIds,
        valueService,
        sideBarSteps,
        serviceTypeOption,
        selectedRecalls,
        packageEMenuType
    } = useSelector((state: RootState) => state.appointmentFrame);
    const { scProfile, selectedSR, serviceRequests } = useSelector((state: RootState) => state.appointment);
    const { allCategories } = useSelector((state: RootState) => state.categories);

    const [isOpen, setOpen] = useState<boolean>(true);

    const {askConfirm, closeConfirm} = useConfirm();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const theme = useTheme();
    const classes = useStyles(theme);
    const isSM = useMediaQuery(theme.breakpoints.down("sm"));

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const selectedServices = useMemo(() => {
           return getMaintenanceList(
               serviceRequests,
               selectedRecalls,
               selectedSR,
               selectedPackage,
               allCategories,
               categoriesIds,
               valueService,
               packageEMenuType,
               scProfile?.maintenancePackageOptionTypes)
        },
        [serviceRequests, selectedSR, selectedPackage,
            allCategories, categoriesIds, valueService,
            selectedRecalls, packageEMenuType, scProfile])

    useEffect(() => {
        if (scProfile) {
            dispatch(loadCategoriesByQuery(scProfile.id))
            dispatch(loadSRs(scProfile.id))
        }
    }, [scProfile])

    const handleSideBarSteps = useCallback(() => {
        if (sideBarSteps?.length) {
            dispatch(setSideBarSteps(serviceType === EServiceType.VisitCenter ? ["serviceNeeds"] : ["location", "serviceNeeds"]));
        }
    }, [sideBarSteps, serviceType])

    const deleteService = (item: IMaintenanceItem) => {
        switch (item.type) {
            case 'service':
                dispatch(deleteIndService(item));
                handleSideBarSteps()
                return;
            case 'package':
                dispatch(deletePackage())
                handleSideBarSteps();
                return;
            case 'valueService':
                dispatch(deleteValueService())
                handleSideBarSteps();
                return;
            case 'recall':
                dispatch(deleteRecall(item))
                return;
            default:
                dispatch(deleteGeneralService(item))
                handleSideBarSteps();
                return;
        }
    }

    const onClick = (item: IMaintenanceItem) => {
        askConfirm({
            isRemove: true,
            title: t("Do you want to remove selected service?"),
            onConfirm: () => deleteService(item),
            onCancel: closeConfirm,
        })
    }

    return selectedServices?.length
        ? <div className={classes.wrapper}>
            <div className={classes.title}>
                <span>{t("Selected Services")}</span>
                {isSM && <IconButton onClick={() => setOpen(prev => !prev)}>
                    {isOpen ? <ExpandLess/> : <ExpandMore/>}
                </IconButton>}
            </div>
            {isOpen && selectedServices.map(item => <CartItem key={item.nhtsaRecallNumber ?? item.id} item={item} onClick={onClick}/>)}
        </div>
        : null;
};

export default CartTable;