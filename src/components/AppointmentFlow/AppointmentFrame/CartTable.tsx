import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {IconButton, useMediaQuery, useTheme} from "@material-ui/core";
import {getMaintenanceList} from "./uiUtils";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {ReactComponent as TrashBin} from "../../../assets/img/trash_bin.svg";
import {
    loadSRs,
    selectAppointment,
    selectServiceValetAppointment,
    selectSR
} from "../../../store/reducers/appointment/actions";
import {IMaintenanceItem} from "./types";
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import {
    loadMakes,
    selectCategoriesIds,
    selectService,
    selectSubService,
    setMaintenanceDetails,
    setPackage, setPackageEMenuType, setSelectedRecalls,
    setSideBarSteps,
    setValueService,
    setVehicle
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useConfirm} from "../../../utils/hooks";
import {loadCategoriesByQuery} from "../../../store/reducers/categories/actions";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {EServiceCenterName, ILoadedVehicle} from "../../../api/types";
import {yearOptions} from "./MaintenanceDetails";
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
        subService,
        service,
        valueService,
        makes,
        sideBarSteps,
        serviceType,
        selectedRecalls,
        packageEMenuType
    } = useSelector((state: RootState) => state.appointmentFrame);
    const { scProfile, selectedSR, serviceRequests } = useSelector((state: RootState) => state.appointment);
    const { allCategories } = useSelector((state: RootState) => state.categories);
    const [isOpen, setOpen] = useState<boolean>(true);
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
        [serviceRequests, selectedSR, selectedPackage, allCategories, categoriesIds, valueService,
            selectedRecalls, packageEMenuType, scProfile])
    const isBmWService = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
        || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest, [scProfile]);
    const dispatch = useDispatch();
    const {askConfirm, closeConfirm} = useConfirm();
    const theme = useTheme();
    const classes = useStyles(theme);
    const isSM = useMediaQuery(theme.breakpoints.down("sm"));
    const {t} = useTranslation();

    useEffect(() => {
        if (scProfile) {
            dispatch(loadCategoriesByQuery(scProfile.id))
            dispatch(loadMakes(scProfile.id))
            dispatch(loadSRs(scProfile.id))
        }
    }, [scProfile, dispatch])

    const deleteIndService = (item: IMaintenanceItem) => {
        const services = selectedSR.filter(sr => sr !== item.id);
        item.id && dispatch(selectSR(item.id));
        dispatch(selectAppointment(null));
        dispatch(selectServiceValetAppointment(null));
        const indServiceCategory = allCategories.find(category => category.type === EServiceCategoryType.IndividualServices);
        const diagnoseCategory = allCategories.find(category => category.type === EServiceCategoryType.Diagnose);
        let categories = [...categoriesIds];
        if (!indServiceCategory?.serviceRequests.find(request => services.includes(request.id))) {
            if (subService?.type === indServiceCategory?.type) dispatch(selectSubService(null))
            if (service?.type === indServiceCategory?.type) dispatch(selectService(null))
            categories = categoriesIds.filter(id => id !== indServiceCategory?.id);
            dispatch(selectCategoriesIds(categories));
        }
        if (!diagnoseCategory?.serviceRequests.find(request => services.includes(request.id))) {
            if (subService?.type === diagnoseCategory?.type) dispatch(selectSubService(null))
            if (service?.type === diagnoseCategory?.type) dispatch(selectService(null))
            categories = categories.filter(id => id !== diagnoseCategory?.id)
            dispatch(selectCategoriesIds(categories));
        }
    }

    const filterCategories = useCallback(() => {
        if (service?.type === EServiceCategoryType.ValueService) {
            dispatch(selectService(null));
            dispatch(selectCategoriesIds(categoriesIds.filter(id => id !== service?.id)));
        }
        if (subService?.type === EServiceCategoryType.ValueService) {
            dispatch(selectSubService(null));
            dispatch(selectCategoriesIds(categoriesIds.filter(id => id !== subService?.id)));
        }
    }, [service, subService, categoriesIds])

    const handleMaintenanceDetails = useCallback(() => {
        // todo add possibility to use value service with other dealerships if needed
        if (valueService && isBmWService) {
            const vehicle: ILoadedVehicle = {
                vin: '',
                make: "",
                model: "",
                year: null,
                mileage: null,
                appointmentHashKeys: [],
            };
            const bmwMake = makes.find(item => item.name === "BMW");
            if (bmwMake) {
                dispatch(setMaintenanceDetails({make: bmwMake.name}));
                vehicle.make = bmwMake.name;

                if (valueService?.year?.year && yearOptions.find(option => Number(option) === valueService?.year?.year)) {
                    dispatch(setMaintenanceDetails({year: valueService.year.year.toString()}));
                    vehicle.year = Number(valueService.year.year)
                }

                const model = bmwMake.models.find(model => model === valueService.series?.name);
                if (model) {
                    dispatch(setMaintenanceDetails({model}));
                    vehicle.model = model;
                }
                dispatch(setVehicle(vehicle));
            }
        }
    }, [valueService, isBmWService, makes, yearOptions])

    const deleteValueService = useCallback(() => {
        handleMaintenanceDetails()
        filterCategories();
        dispatch(setValueService(null));
        dispatch(selectAppointment(null));
        dispatch(selectServiceValetAppointment(null));
    }, [handleMaintenanceDetails, filterCategories])

    const handleSideBarSteps = useCallback(() => {
        if (sideBarSteps?.length) {
            dispatch(setSideBarSteps(serviceType === EServiceType.VisitCenter ? ["serviceNeeds"] : ["location", "serviceNeeds"]));
        }
    }, [sideBarSteps, serviceType])

    const handleDeleteRecall = useCallback((item: IMaintenanceItem) => {
        item.nhtsaRecallNumber && dispatch(setSelectedRecalls(selectedRecalls.filter(el => el.nhtsaRecallNumber !== item.nhtsaRecallNumber)))
    }, [selectedRecalls])

    const deleteService = (item: IMaintenanceItem) => {
        switch (item.type) {
            case 'service':
                deleteIndService(item);
                handleSideBarSteps()
                return;
            case 'package':
                if (service?.type === 1) dispatch(selectService(null));
                dispatch(selectAppointment(null));
                dispatch(selectServiceValetAppointment(null));
                handleSideBarSteps();
                if (packageEMenuType !== null) dispatch(setPackageEMenuType(null));
                return dispatch(setPackage(null));
            case 'valueService':
                handleSideBarSteps();
                deleteValueService();
               return;
            case 'recall':
                handleDeleteRecall(item)
                return;
            default:
                if (service?.id === item.id) dispatch(selectService(null));
                if (subService?.id === item.id) dispatch(selectSubService(null));
                dispatch(selectAppointment(null));
                dispatch(selectServiceValetAppointment(null));
                handleSideBarSteps();
                return dispatch(selectCategoriesIds(categoriesIds.filter(id => id !== item.id)));
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