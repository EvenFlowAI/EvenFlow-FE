import React, {useState} from 'react';
import {useConfirm, useException, useMessage, useModal, useSCs} from "../../../../../utils/hooks";
import {useDispatch} from "react-redux";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {MoreHoriz} from "@material-ui/icons";
import {Table} from "../../../../UI/Table";
import AddMileage from "../../../../Modals/AddMileage/AddMileage";
import {IOrder} from "../../../../../types/types";

type TMileage = {
    value: string;
    id: number;
}

const RowData = [
    {val: (el: TMileage) => el.value, header: "Estimated Mileage", orderId: "value"},
]

const mockMileage: TMileage[] = [
    {value: '3000', id: 1},
    {value: '5000', id: 2},
    {value: '7000', id: 3},
    {value: '10000', id: 4},
    {value: '13000', id: 5},
    {value: '16000', id: 6},
];

const MileageTable = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [currentMileage, setCurrentMileage] = useState<TMileage | null>(null);
    const [mileages, setMileages] = useState<TMileage[]>(mockMileage);
    const [isAscending, setIsAscending] = useState<boolean>(true)
    const { selectedSC } = useSCs();
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();
    const {askConfirm} = useConfirm();
    const {onOpen, onClose, isOpen} = useModal();

    const openMenu = (el: TMileage) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCurrentMileage(el)
        setAnchorEl(e.currentTarget);
    }

    const tableActions = (el: TMileage) => {
        return <IconButton onClick={openMenu(el)}>
            <MoreHoriz />
        </IconButton>;
    }

    const handleRemove = async () => {
        try {
            // TODO remove request
            setCurrentMileage(null);
            showMessage("Removed");
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

    const handleSort = (d: IOrder<TMileage>) => async () => {
        setIsAscending(d.isAscending);
        setMileages(prev => d.isAscending
            ? prev.sort((a, b) => +a.value - +b.value)
            : prev.sort((a, b) => +b.value - +a.value))
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