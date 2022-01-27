import React, {useEffect, useMemo, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {IconButton, useMediaQuery, useTheme} from "@material-ui/core";
import {getMaintenanceList} from "./uiUtils";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {ReactComponent as TrashBin} from "../../../assets/img/trash_bin.svg";
import {loadAllServiceCategories, selectSR} from "../../../store/reducers/appointment/actions";
import {IMaintenanceItem} from "./types";
import {ExpandMore, ExpandLess} from '@material-ui/icons';
import {
    selectCategoriesIds,
    selectService,
    selectSubService,
    setPackage
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useConfirm} from "../../../utils/hooks";

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
    const { selectedPackage, categoriesIds, subService, service } = useSelector((state: RootState) => state.appointmentFrame);
    const { allServiceCategories, scProfile, selectedSR, serviceRequests } = useSelector((state: RootState) => state.appointment);
    const [isOpen, setOpen] = useState<boolean>(true);
    const selectedServices = useMemo(() => getMaintenanceList(serviceRequests, selectedSR, selectedPackage, allServiceCategories, categoriesIds),
        [serviceRequests, selectedSR, selectedPackage, allServiceCategories, categoriesIds])
    const dispatch = useDispatch();
    const {askConfirm, closeConfirm} = useConfirm();
    const theme = useTheme();
    const classes = useStyles(theme);
    const isSM = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        scProfile && dispatch(loadAllServiceCategories(scProfile.id))
    }, [scProfile])

    const deleteService = (item: IMaintenanceItem) => {
        switch (item.type) {
            case 'service':
                const services = selectedSR.filter(sr => sr !== item.id);
                dispatch(selectSR(item.id));
                if (!services.length && subService?.type === 2) dispatch(selectSubService(null));
                return;
            case 'package':
                if (service?.type === 1) dispatch(selectService(null));
                return dispatch(setPackage(null));
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