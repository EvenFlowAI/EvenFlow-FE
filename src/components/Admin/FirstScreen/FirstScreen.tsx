import React, {useEffect, useState} from 'react';
import {TableRowDataType} from "../../UI/types";
import {IServiceType} from "../../../store/reducers/serviceTypes/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useConfirm, useException, useMessage, useModal, useSCs} from "../../../utils/hooks";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {MoreHoriz} from "@material-ui/icons";
import {deleteServiceTypeById, loadServiceTypesByQuery} from "../../../store/reducers/serviceTypes/actions";
import {Table} from "../../UI/Table";
import {bookingFlowRoot} from "../../Optimizer/utils";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";

const optionNames = {
    0: 'Visit Center',
    1: 'Mobile Service',
    2: 'Pick Up Drop Off',
}

const RowData: TableRowDataType<IServiceType>[] = [
    {val: (el: IServiceType) => el.name, header: "Service Name",  width: 300},
    {val: (el: IServiceType) => el.orderIndex?.toString() ?? '', header: "Order Index", align: 'center', width: 150},
    {val: (el: IServiceType) => optionNames[el.type] ?? '', header: "Service Option"},
]

const FirstScreen = () => {
    const { serviceTypes, isLoading } = useSelector((state: RootState) => state.serviceTypes);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [currentItem, setCurrentItem] = useState<IServiceType | null>(null);

    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();
    const {askConfirm} = useConfirm();
    const {selectedSC} = useSCs();
    const {isOpen, onOpen, onClose} = useModal();

    useEffect(() => {
        selectedSC && dispatch(loadServiceTypesByQuery(selectedSC.id));
    }, [selectedSC])

    const openMenu = (el: IServiceType) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCurrentItem(el);
        setAnchorEl(e.currentTarget);
    }

    const tableActions = (el: IServiceType) => {
        return <IconButton onClick={openMenu(el)}>
            <MoreHoriz />
        </IconButton>;
    }

    const handleRemove = async () => {
        if (!currentItem) {
            showError("Service Type is not chosen");
        } else {
            try {
                if (currentItem.id && selectedSC) dispatch(deleteServiceTypeById(currentItem.id, selectedSC.id))
                showMessage("Removed");
                setCurrentItem(null);
            } catch (e) {
                showError(e);
            }
        }
    }

    const askRemove = () => {
        setAnchorEl(null);
        if (!currentItem) {
            showError("Service Type is not chosen");
        } else {
            askConfirm({
                isRemove: true,
                title: `Remove Service Type ${currentItem.name}?`,
                onConfirm: handleRemove
            });
        }
    }

    const openEdit = () => {
        setAnchorEl(null);
        onOpen();
    }

    const onOpenAdd = async () => {
        await setCurrentItem(null);
        await onOpen();
    }

    return (
        <React.Fragment>
            <TitleContainer title="First Screen" pad parent={bookingFlowRoot}/>
            <div style={{width: '100%', display: "flex", alignItems: "center", justifyContent: 'flex-end', marginBottom: 20}}>
                <Button
                    style={{marginLeft: 16}}
                    color="primary"
                    onClick={onOpenAdd}
                    variant="contained">
                    Add Service Option
                </Button>
            </div>
            <Table
                data={serviceTypes}
                index="name"
                rowData={RowData}
                actions={tableActions}
                hidePagination
                isLoading={isLoading}
            />
            <Menu
                open={Boolean(anchorEl)}
                onClose={() => {setAnchorEl(null);}}
                anchorEl={anchorEl}
            >
                <MenuItem onClick={openEdit}>Edit</MenuItem>
                <MenuItem onClick={askRemove}>Remove</MenuItem>
            </Menu>
        </React.Fragment>
    );
};

export default FirstScreen;