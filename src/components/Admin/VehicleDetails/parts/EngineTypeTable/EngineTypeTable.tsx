import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {IEngineType} from "../../../../../store/reducers/vehicleDetails/types";
import {useConfirm, useException, useMessage, useModal, useSCs} from "../../../../../utils/hooks";
import {loadEngineType, removeEngineType} from "../../../../../store/reducers/vehicleDetails/actions";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {MoreHoriz} from "@material-ui/icons";
import {IOrder} from "../../../../../types/types";
import {Table} from "../../../../UI/Table";
import AddEngineType from "../../../../Modals/AddEngineType/AddEngineType";

const RowData = [
    {val: (el: IEngineType) => `${el.name}`, header: "Estimated Mileage", orderId: "name"},
]

const EngineTypeTable = () => {
    const { engineTypes } = useSelector((state: RootState) => state.vehicleDetails);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [currentEngineType, setCurrentEngineType] = useState<IEngineType | null>(null);
    const [types, setTypes] = useState<IEngineType[]>([]);
    const [isAscending, setIsAscending] = useState<boolean>(true)
    const { selectedSC } = useSCs();
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();
    const {askConfirm} = useConfirm();
    const {onOpen, onClose, isOpen} = useModal();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadEngineType(selectedSC.id));
        }
    }, [selectedSC])

    useEffect(() => {
        setTypes(engineTypes);
    }, [engineTypes])

    const openMenu = (el: IEngineType) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCurrentEngineType(el)
        setAnchorEl(e.currentTarget);
    }

    const tableActions = (el: IEngineType) => {
        return <IconButton onClick={openMenu(el)}>
            <MoreHoriz />
        </IconButton>;
    }

    const onRemoveSuccess = () => {
        setCurrentEngineType(null);
        showMessage("Engine Type removed");
    }

    const handleRemove = async () => {
        if (currentEngineType && selectedSC) {
            dispatch(removeEngineType(currentEngineType.id, selectedSC.id, onRemoveSuccess, e => showError(e)));
        }
    }

    const askRemove = () => {
        setAnchorEl(null);
        if (currentEngineType) {
            askConfirm({
                isRemove: true,
                title: `Remove Engine Type ${currentEngineType?.name}?`,
                onConfirm: handleRemove
            });
        }
    }

    const handleSort = (d: IOrder<IEngineType>) => async () => {
        setIsAscending(d.isAscending);
        setTypes(prev => d.isAscending
            ? [...prev].sort((a, b) => a.id - b.id)
            : [...prev].sort((a, b) => b.id - a.id))
    }

    return (
        <div>
            <div style={{display: "flex", alignItems: "center", justifyContent: 'flex-end', marginBottom: 20}}>
                <Button
                    style={{marginLeft: 16}}
                    color="primary"
                    onClick={onOpen}
                    variant="contained">
                    Add Engine Type
                </Button>
            </div>
            <Table
                data={types}
                index="name"
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
            <AddEngineType open={isOpen} onClose={onClose}/>
        </div>
    );
};

export default EngineTypeTable;