import React, {useEffect, useState} from 'react';
import {TableRowDataType} from "../../UI/types";
import {IFirstScreenOption} from "../../../store/reducers/serviceTypes/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useConfirm, useException, useMessage, useModal, useSCs} from "../../../utils/hooks";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {MoreHoriz} from "@material-ui/icons";
import {deleteFirstScreenOptionById, loadFirstScreenOptionsByQuery} from "../../../store/reducers/serviceTypes/actions";
import {Table} from "../../UI/Table";
import {bookingFlowRoot} from "../../Optimizer/utils";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import AddFirstScreenOption from "../../Modals/AddFirstScreenOption/AddFirstScreenOption";

export const serviceTypeNames = {
    0: 'Visit Center',
    1: 'Mobile Service',
    2: 'Pick Up Drop Off',
    3: 'General',
}

const RowData: TableRowDataType<IFirstScreenOption>[] = [
    {val: (el: IFirstScreenOption) => el.name, header: "First Screen Option",  width: 300},
    {val: (el: IFirstScreenOption) => el.orderIndex?.toString() ?? '', header: "Order Index", align: 'center', width: 150},
    {val: (el: IFirstScreenOption) => serviceTypeNames[el.type] ?? '', header: "Booking Flow Config"},
]

const FirstScreen = () => {
    const { firstScreenOptions, isLoading } = useSelector((state: RootState) => state.serviceTypes);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [currentItem, setCurrentItem] = useState<IFirstScreenOption | null>(null);

    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();
    const {askConfirm} = useConfirm();
    const {selectedSC} = useSCs();
    const {isOpen, onOpen, onClose} = useModal();

    useEffect(() => {
        selectedSC && dispatch(loadFirstScreenOptionsByQuery(selectedSC.id));
    }, [selectedSC])

    const openMenu = (el: IFirstScreenOption) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCurrentItem(el);
        setAnchorEl(e.currentTarget);
    }

    const tableActions = (el: IFirstScreenOption) => {
        return <IconButton onClick={openMenu(el)}>
            <MoreHoriz />
        </IconButton>;
    }

    const handleRemove = async () => {
        if (!currentItem) {
            showError("Service Type is not chosen");
        } else {
            try {
                if (currentItem.id && selectedSC) dispatch(deleteFirstScreenOptionById(currentItem.id, selectedSC.id))
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
                data={firstScreenOptions}
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
            <AddFirstScreenOption open={isOpen} editingItem={currentItem} onClose={onClose}/>
        </React.Fragment>
    );
};

export default FirstScreen;