import React, {useMemo} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {IconButton, useTheme} from "@material-ui/core";
import {getMaintenanceDescription} from "./uiUtils";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {ReactComponent as TrashBin} from "../../../assets/img/trash_bin.svg";

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
        marginBottom: 16,
        color: '#252525',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    }
}))

type TCartItemProps = {
    title: string;
    onClick: (name: string) => void;
}

const CartItem: React.FC<TCartItemProps> = ({ title, onClick}) => {
    const classes = useStyles();
    return <div className={classes.itemWrapper}>
        <div>{title}</div>
        <IconButton onClick={() => onClick(title)}><TrashBin/></IconButton>
    </div>
}

const CartTable = () => {
    const { selectedPackage, categoriesIds } = useSelector((state: RootState) => state.appointmentFrame);
    const { allServiceCategories } = useSelector((state: RootState) => state.appointment);
    const [selectedSR, srList] = useSelector((state: RootState) => [
        state.appointment.selectedSR,
        state.appointment.serviceRequests
    ]);
    const theme = useTheme();
    const classes = useStyles(theme);
    const selectedServices = useMemo(() => getMaintenanceDescription(srList, selectedSR, selectedPackage, allServiceCategories, categoriesIds),
        [srList, selectedSR, selectedPackage, allServiceCategories, categoriesIds])

    const onClick = (name: string) => {
        console.log(name);
    }

    return selectedServices?.length
        ? <div className={classes.wrapper}>
            <div className={classes.title}>Selected Services List</div>
            {selectedServices.map(item => <CartItem title={item} onClick={onClick}/>)}
        </div>
        : null;
};

export default CartTable;