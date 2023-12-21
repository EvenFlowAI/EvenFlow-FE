import React from "react";
import {useStyles} from "../styles";
import {IconButton} from "@material-ui/core";
import {IMaintenanceItem} from "../../AppointmentFrame/types";
import {ReactComponent as TrashBin} from "../../../assets/img/trash_bin.svg";

type TCartItemProps = {
    item: IMaintenanceItem;
    onClick: (item: IMaintenanceItem) => void;
}
export const CartItem: React.FC<TCartItemProps> = ({item, onClick}) => {
    const classes = useStyles();
    return <div className={classes.itemWrapper}>
        <div>{item.name}</div>
        <IconButton onClick={() => onClick(item)} style={{padding: 0}}><TrashBin/></IconButton>
    </div>
}