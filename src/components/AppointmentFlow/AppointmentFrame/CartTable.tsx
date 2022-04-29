import React, {useEffect, useMemo, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {IconButton, useMediaQuery, useTheme} from "@material-ui/core";
import {getMaintenanceList} from "./uiUtils";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {ReactComponent as TrashBin} from "../../../assets/img/trash_bin.svg";
import {selectSR} from "../../../store/reducers/appointment/actions";
import {IMaintenanceItem} from "./types";
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import {
    loadMakes,
    selectCategoriesIds,
    selectService,
    selectSubService,
    setMaintenanceDetails,
    setPackage,
    setValueService,
    setVehicle
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useConfirm} from "../../../utils/hooks";
import {loadCategoriesByQuery} from "../../../store/reducers/categories/actions";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {EServiceCenterName, ILoadedVehicle} from "../../../api/types";
import {yearOptions} from "./MaintenanceDetails";

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
    const { selectedPackage, categoriesIds, subService, service, valueService, makes } = useSelector((state: RootState) => state.appointmentFrame);
    const { scProfile, selectedSR, serviceRequests } = useSelector((state: RootState) => state.appointment);
    const { allCategories } = useSelector((state: RootState) => state.categories);
    const [isOpen, setOpen] = useState<boolean>(true);
    const selectedServices = useMemo(() => getMaintenanceList(serviceRequests, selectedSR, selectedPackage, allCategories, categoriesIds, valueService),
        [serviceRequests, selectedSR, selectedPackage, allCategories, categoriesIds, valueService])
    const isBmWService = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
        || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest, [scProfile]);
    const dispatch = useDispatch();
    const {askConfirm, closeConfirm} = useConfirm();
    const theme = useTheme();
    const classes = useStyles(theme);
    const isSM = useMediaQuery(theme.breakpoints.down("sm"));


    useEffect(() => {
        if (scProfile) {
            dispatch(loadCategoriesByQuery(scProfile.id))
            dispatch(loadMakes(scProfile.id))
        }
    }, [scProfile, dispatch])

    const deleteIndService = (item: IMaintenanceItem) => {
        dispatch(selectSR(item.id));
        const services = selectedSR.filter(sr => sr !== item.id);
        const indServiceCategory = allCategories.find(category => category.type === EServiceCategoryType.IndividualServices);
        const diagnoseCategory = allCategories.find(category => category.type === EServiceCategoryType.Diagnose);
        let categories = [...categoriesIds];

        if (!indServiceCategory?.serviceRequests.find(request => services.includes(request.id))) {
            if (subService?.type === indServiceCategory?.type) dispatch(selectSubService(null))
            categories = categoriesIds.filter(id => id !== indServiceCategory?.id);
            dispatch(selectCategoriesIds(categories));
        }
        if (!diagnoseCategory?.serviceRequests.find(request => services.includes(request.id))) {
            if (service?.type === diagnoseCategory?.type) dispatch(selectService(null))
            categories = categories.filter(id => id !== diagnoseCategory?.id)
            dispatch(selectCategoriesIds(categories));
        }
    }

    const deleteValueService = () => {
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

                if (valueService?.year?.year && yearOptions.find(option => option === valueService?.year?.year)) {
                    dispatch(setMaintenanceDetails({year: valueService.year.year}));
                    vehicle.year = Number(valueService.year.year)
                }

                const model = bmwMake.models.find(model => model === valueService.series?.name);
                if (model) {
                    dispatch(setMaintenanceDetails({model}));
                    vehicle.model = model;
                }
                dispatch(setVehicle(vehicle));
            }
            dispatch(setValueService(null));
            if (service?.type === EServiceCategoryType.ValueService) dispatch(selectService(null));
            if (subService?.type === EServiceCategoryType.ValueService) dispatch(selectSubService(null));
        }
    }

    const deleteService = (item: IMaintenanceItem) => {
        switch (item.type) {
            case 'service':
                deleteIndService(item);
                return;
            case 'package':
                if (service?.type === 1) dispatch(selectService(null));
                return dispatch(setPackage(null));
            case 'valueService':
                deleteValueService();
               return;
            default:
                if (service?.id === item.id) dispatch(selectService(null));
                if (subService?.id === item.id) dispatch(selectSubService(null));
                return dispatch(selectCategoriesIds(categoriesIds.filter(id => id !== item.id)));
        }
    }

    const onClick = (item: IMaintenanceItem) => {
        askConfirm({
            isRemove: true,
            title: 'Do you want to remove selected service?',
            onConfirm: () => deleteService(item),
            onCancel: closeConfirm,
        })
    }

    return selectedServices?.length
        ? <div className={classes.wrapper}>
            <div className={classes.title}>
                <span>Selected Services</span>
                {isSM && <IconButton onClick={() => setOpen(prev => !prev)}>
                    {isOpen ? <ExpandLess/> : <ExpandMore/>}
                </IconButton>}
            </div>
            {isOpen && selectedServices.map(item => <CartItem key={item.id} item={item} onClick={onClick}/>)}
        </div>
        : null;
};

export default CartTable;