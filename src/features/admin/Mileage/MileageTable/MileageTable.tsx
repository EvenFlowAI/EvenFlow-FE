import React, {useEffect, useState} from 'react';
import {Table} from "../../../../components/tables/Table/Table";
import {IconButton, Menu, MenuItem} from "@material-ui/core";
import {loadMileage, removeMileage} from "../../../../store/reducers/vehicleDetails/actions";
import {IMileage} from "../../../../store/reducers/vehicleDetails/types";
import {MoreHoriz} from "@material-ui/icons";
import {IOrder} from "../../../../types/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useConfirm} from "../../../../hooks/useConfirm/useConfirm";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

const RowData = [
    {val: (el: IMileage) => `${el.value}`, header: "Estimated Mileage", orderId: "value"},
]

export const MileageTable = () => {
    const { mileage } = useSelector((state: RootState) => state.vehicleDetails);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [currentMileage, setCurrentMileage] = useState<IMileage | null>(null);
    const [mileages, setMileages] = useState<IMileage[]>([]);
    const [isAscending, setIsAscending] = useState<boolean>(true)
    const { selectedSC } = useSCs();
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();
    const {askConfirm} = useConfirm();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadMileage(selectedSC.id));
        }
    }, [selectedSC])

    useEffect(() => {
        setMileages(mileage);
    }, [mileage])

    const openMenu = (el: IMileage) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCurrentMileage(el)
        setAnchorEl(e.currentTarget);
    }

    const tableActions = (el: IMileage) => {
        return <IconButton onClick={openMenu(el)}>
            <MoreHoriz />
        </IconButton>;
    }

    const onRemoveSuccess = () => {
        setCurrentMileage(null);
        showMessage("Mileage removed");
    }

    const handleRemove = async () => {
        if (currentMileage && selectedSC) {
            dispatch(removeMileage(currentMileage.id, selectedSC.id, onRemoveSuccess, e => showError(e)));
        }
    }

    const askRemove = () => {
        setAnchorEl(null);
        if (currentMileage) {
            askConfirm({
                isRemove: true,
                title: `Please confirm you want to remove Mileage Option ${currentMileage?.value}?`,
                onConfirm: handleRemove
            });
        }
    }

    const handleSort = (d: IOrder<IMileage>) => async () => {
        setIsAscending(d.isAscending);
        setMileages(prev => d.isAscending
            ? [...prev].sort((a, b) => a.value - b.value)
            : [...prev].sort((a, b) => b.value - a.value))
    }

    return (
        <>
            <Table
                data={mileages}
                index="value"
                rowData={RowData}
                actions={tableActions}
                isAscending={isAscending}
                order="value"
                onSort={handleSort}
                hidePagination/>
            <Menu
                open={Boolean(anchorEl)}
                onClose={() => {setAnchorEl(null);}}
                anchorEl={anchorEl}
            >
                <MenuItem onClick={askRemove}>Remove</MenuItem>
            </Menu>
        </>
    );
};