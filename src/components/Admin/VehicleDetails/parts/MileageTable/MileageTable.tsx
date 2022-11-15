import React, {useEffect, useState} from 'react';
import {useConfirm, useException, useMessage, useModal, useSCs} from "../../../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {MoreHoriz} from "@material-ui/icons";
import {Table} from "../../../../UI/Table";
import AddMileage from "../../../../Modals/AddMileage/AddMileage";
import {IOrder} from "../../../../../types/types";
import {IMileage} from "../../../../../store/reducers/vehicleDetails/types";
import {loadMileage, removeMileage} from "../../../../../store/reducers/vehicleDetails/actions";
import {RootState} from "../../../../../store/rootReducer";

const RowData = [
    {val: (el: IMileage) => `${el.value}`, header: "Estimated Mileage", orderId: "value"},
]

const MileageTable = () => {
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
    const {onOpen, onClose, isOpen} = useModal();

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
        try {
            if (currentMileage && selectedSC) {
                dispatch(removeMileage(currentMileage.id, selectedSC.id, onRemoveSuccess));
            }
        } catch (e) {
            showError(e);
        }
    }

    const askRemove = () => {
        setAnchorEl(null);
        if (currentMileage) {
            askConfirm({
                isRemove: true,
                title: `Remove Mileage Option ${currentMileage?.value}?`,
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
        <div>
            <div style={{display: "flex", alignItems: "center", justifyContent: 'flex-end', marginBottom: 20}}>
                <Button
                    style={{marginLeft: 16}}
                    color="primary"
                    onClick={onOpen}
                    variant="contained">
                    Add Mileage
                </Button>
            </div>
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
            <AddMileage open={isOpen} onClose={onClose}/>
        </div>
    );
};

export default MileageTable;