import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {IconButton, useMediaQuery, useTheme} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {loadSRs, setAppointmentWasChanged} from "../../../../../store/reducers/appointment/actions";
import {ExpandLess, ExpandMore} from '@mui/icons-material';
import {
    clearSelectedServices,
    deleteGeneralService,
    deleteIndService,
    deletePackage,
    deleteRecall,
    deleteValueService,
    setSideBarSteps,
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {loadCategoriesByQuery} from "../../../../../store/reducers/categories/actions";
import {EServiceType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {useStyles} from "./styles";
import {CartItem} from "./ShoppingCartItem/ShoppingCartItem";
import {IMaintenanceItem} from "../../../../../types/types";
import {getMaintenanceList} from "../../../../../utils/utils";
import {useConfirm} from "../../../../../hooks/useConfirm/useConfirm";

const ShoppingCart = () => {
    const {
        selectedPackage,
        categoriesIds,
        valueService,
        sideBarSteps,
        serviceTypeOption,
        selectedRecalls,
        packageEMenuType
    } = useSelector((state: RootState) => state.appointmentFrame);
    const { scProfile, selectedSR, serviceRequests, customerLoadedData } = useSelector((state: RootState) => state.appointment);
    const { allCategories } = useSelector((state: RootState) => state.categories);

    const [isOpen, setOpen] = useState<boolean>(true);

    const {askConfirm, closeConfirm} = useConfirm();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const theme = useTheme();
    const { classes  } = useStyles();
    const isSM = useMediaQuery(theme.breakpoints.down('md'));

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

    const setAppointmentChanged = () => {
        if (customerLoadedData?.isUpdating) dispatch(setAppointmentWasChanged(true))
    }

    const deleteService = (item: IMaintenanceItem) => {
        switch (item.type) {
            case 'service':
                dispatch(deleteIndService(item));
                setAppointmentChanged();
                handleSideBarSteps()
                return;
            case 'package':
                dispatch(deletePackage())
                setAppointmentChanged();
                handleSideBarSteps();
                return;
            case 'valueService':
                dispatch(deleteValueService())
                setAppointmentChanged();
                handleSideBarSteps();
                return;
            case 'recall':
                dispatch(deleteRecall(item))
                setAppointmentChanged();
                return;
            default:
                dispatch(deleteGeneralService(item))
                setAppointmentChanged();
                handleSideBarSteps();
                return;
        }
    }

    const onRemoveAll = () => {
        dispatch(clearSelectedServices());
        closeConfirm()
    }

    const onClick = (item: IMaintenanceItem) => {
        askConfirm({
            isRemove: true,
            title: t("Do you want to remove selected service?"),
            onConfirm: () => deleteService(item),
            onCancel: closeConfirm,
            onAdditional: onRemoveAll,
            additionalContent: t("Remove all"),
            cancelBtnVariant: 'outlined',
            width: 500,
            isBooking: true
        })
    }

    return selectedServices?.length
        ? <div className={classes.wrapper}>
            <div className={classes.title}>
                <span>{t("Selected Services")}</span>
                {isSM && <IconButton onClick={() => setOpen(prev => !prev)} size="large">
                    {isOpen ? <ExpandLess/> : <ExpandMore/>}
                </IconButton>}
            </div>
            {isOpen && selectedServices.map(item => <CartItem key={item.campaignNumber ?? item.id} item={item} onClick={onClick}/>)}
        </div>
        : null;
};

export default ShoppingCart;