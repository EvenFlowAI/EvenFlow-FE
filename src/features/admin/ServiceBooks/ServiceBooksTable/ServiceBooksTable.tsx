import React, {useEffect, useState} from 'react';
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useDispatch, useSelector} from "react-redux";
import {loadPodsSummary, removePod, setPodById} from "../../../../store/reducers/pods/actions";
import {Table} from "../../../../components/tables/Table/Table";
import {RootState} from "../../../../store/rootReducer";
import {rowData} from "./constants";
import {IconButton, Menu, MenuItem} from "@mui/material";
import {MoreHoriz} from "@mui/icons-material";
import {IPodSummary} from "../../../../store/reducers/pods/types";
import {useException} from "../../../../hooks/useException/useException";
import {useConfirm} from "../../../../hooks/useConfirm/useConfirm";
import {useModal} from "../../../../hooks/useModal/useModal";
import {ServiceBookModal} from "../../ServiceBookModal/ServiceBookModal";

const ServiceBooksTable = () => {
    const {summary, podsLoading} = useSelector((state: RootState) => state.pods);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [currentItem, setCurrentItem] = useState<IPodSummary | null>(null);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const {askConfirm} = useConfirm();
    const {isOpen, onClose, onOpen} = useModal();

    useEffect(() => {
        if (selectedSC) dispatch(loadPodsSummary(selectedSC.id))
    }, [selectedSC])

    const openMenu = (el: IPodSummary) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCurrentItem(el);
        setAnchorEl(e.currentTarget);
    }

    const tableActions = (el: IPodSummary) => {
        return (
            <IconButton onClick={openMenu(el)} size="large">
                <MoreHoriz />
            </IconButton>
        );
    }

    const openEdit = () => {
        onOpen()
        setAnchorEl(null);
    }

    const handleRemove = async () => {
        if (!currentItem) {
            showError("Service Book not specified");
        } else {
            try {
                await dispatch(removePod(currentItem.serviceBookId, selectedSC?.id, showError));
                setCurrentItem(null);
            } catch (e) {
                showError(e);
            }
        }
    }

    const askRemove = () => {
        setAnchorEl(null);
        if (!currentItem) {
            showError("Service Book is not chosen");
        } else {
            askConfirm({
                isRemove: true,
                title: `Please confirm you want to remove Service Book ${currentItem.serviceBookName ?? "-"}?`,
                onConfirm: handleRemove
            });
        }
    }

    const onEditClose = () => {
        setCurrentItem(null);
        dispatch(setPodById(null));
        onClose()
    }

    return (
        <div style={{paddingTop: 32}}>
            <Table
                data={summary}
                index="serviceBookId"
                rowData={rowData}
                actions={tableActions}
                hidePagination
                verticalAlign="bottom"
                isLoading={podsLoading}/>
            <Menu
                open={Boolean(anchorEl)}
                onClose={() => {setAnchorEl(null);}}
                anchorEl={anchorEl}
            >
                <MenuItem onClick={openEdit} disabled={podsLoading}>Edit</MenuItem>
                <MenuItem onClick={askRemove} disabled={podsLoading}>Remove</MenuItem>
            </Menu>
            <ServiceBookModal open={isOpen} onClose={onEditClose} editingItemId={currentItem?.serviceBookId} />
        </div>
    );
};

export default ServiceBooksTable;