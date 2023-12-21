import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Table} from "../../../../components/Table/Table";
import {IconButton, Menu, MenuItem} from "@material-ui/core";
import {IFirstScreenOption} from "../../../../store/reducers/serviceTypes/types";
import {MoreHoriz} from "@material-ui/icons";
import {deleteFirstScreenOptionById, loadFirstScreenOptionsList} from "../../../../store/reducers/serviceTypes/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {TableRowDataType, TCallback} from "../../../../types/types";
import {serviceTypeNames} from "../constants";
import {useConfirm} from "../../../../hooks/useConfirm/useConfirm";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

const RowData: TableRowDataType<IFirstScreenOption>[] = [
    {val: (el: IFirstScreenOption) => el.name, header: "First Screen Option",  width: 300},
    {val: (el: IFirstScreenOption) => el.orderIndex?.toString() ?? '-', header: "Order Index", align: 'center', width: 150},
    {val: (el: IFirstScreenOption) => serviceTypeNames[el.type] ?? '-', header: "Booking Flow Config"},
    {val: (el: IFirstScreenOption) => el.transportationOption?.name ?? '-', header: "Default Transportation Option"},
]

type TProps = {
    setCurrentItem: Dispatch<SetStateAction<IFirstScreenOption | null>>;
    currentItem: IFirstScreenOption | null;
    onOpen: TCallback;
}

export const FirstScreenOptionsTable: React.FC<TProps> = ({setCurrentItem, currentItem, onOpen}) => {
    const { firstScreenOptions, isLoading } = useSelector((state: RootState) => state.serviceTypes);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const {selectedSC} = useSCs();
    const showMessage = useMessage();
    const showError = useException();
    const {askConfirm} = useConfirm();
    const dispatch = useDispatch();

    useEffect(() => {
        selectedSC && dispatch(loadFirstScreenOptionsList(selectedSC.id));
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

    return (
        <>
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
        </>
    );
};