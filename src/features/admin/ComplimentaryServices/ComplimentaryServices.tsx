import React, {useCallback, useEffect, useState} from 'react';
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {SearchInput} from "../../../components/formControls/SearchInput/SearchInput";
import {Button, IconButton, Menu, MenuItem} from "@mui/material";
import {
    changeComplimentaryPageData,
    loadComplimentary, setComplimentaryPageData,
    setComplimentarySearchTerm,
    setComplimentarySort
} from "../../../store/reducers/packages/actions";
import {useDispatch, useSelector} from "react-redux";
import {IComplimentaryServiceByQuery} from "../../../store/reducers/packages/types";
import {Table} from "../../../components/tables/Table/Table";
import {RootState} from "../../../store/rootReducer";
import {MoreHoriz} from "@mui/icons-material";
import {capacityManagementRoot, SC_UNDEFINED} from "../../../utils/constants";
import AddServiceManually from "./AddServiceManually/AddServiceManually";
import {OPsCodesListDialog} from "../../../components/modals/admin/OPsCodesListDialog/OPsCodesListDialog";
import {addOpsCodeFromList, loadAllComplimentary} from "../../../store/reducers/complimentary/actions";
import {IOrder, TableRowDataType} from "../../../types/types";
import {useModal} from "../../../hooks/useModal/useModal";
import {useConfirm} from "../../../hooks/useConfirm/useConfirm";
import {usePagination} from "../../../hooks/usePaginations/usePaginations";

import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";

export const ComplimentaryServices = () => {
    const {
        complimentary,
        isComplimentaryLoading,
        complimentaryPaging: {numberOfRecords},
        complimentarySortOrder,
        complimentarySearchTerm,
        allComplimentary,
    } = useSelector((state: RootState) => state.packages);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null | undefined>(null);
    const [editedItem, setEditedItem] = useState<IComplimentaryServiceByQuery | undefined>(undefined);
    const [selectedOpsCodes, setSelectedOpsCodes] = useState<number[]>([]);

    const {changeRowsPerPage, changePage, pageIndex, pageSize} = usePagination(
        (s: RootState) => s.packages.complimentaryPageData,
        changeComplimentaryPageData
    );
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const {askConfirm} = useConfirm();
    const showError = useException();
    const showMessage = useMessage();
    const {isOpen: isAddManuallyOpen, onOpen: onAddManuallyOpen, onClose: onAddManuallyClose} = useModal();
    const {isOpen: isAddOpsCodeOpen, onOpen: onAddOpsCodeOpen, onClose: onAddOpsCodeClose} = useModal();

    const tableData: TableRowDataType<IComplimentaryServiceByQuery>[] = [
        {header: "Ops Code", val: el => el.code, align: "left", orderId: "code", width: 130},
        {header: "Description", val: el => el.name, orderId: "name"},
        {header: "Labor Hours", val: el => `${el.durationInHours}`, width: 150, orderId: "durationInHours"},
        {header: "Market Rate", val: el => `$${el.price.toFixed(2)}`, width: 150, orderId: "price" },
    ]

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadComplimentary(selectedSC.id))
        }
    }, [selectedSC])

    const handleAddManuallyClose = () => {
        setEditedItem(undefined);
        onAddManuallyClose();
    }

    useEffect(() => {
        setSelectedOpsCodes(() => {
            const data: number[] = [];
            allComplimentary.forEach(item => item.serviceRequestId && data.push(item.serviceRequestId));
            return data;
        });
    }, [allComplimentary])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setComplimentarySearchTerm(e.target.value))
    }

    const handleSearch = useCallback(() => {
        if (selectedSC) {
            changePage(null, 0);
            dispatch(setComplimentaryPageData({pageIndex: 0}));
            dispatch(loadComplimentary(selectedSC.id));
        }
    }, [selectedSC]);

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setEditedItem(undefined);
    }

    const handleEdit = () => {
        setAnchorEl(null);
        onAddManuallyOpen();
    }

    const askRemove = () => {
        setAnchorEl(null);
        askConfirm({
            isRemove: true,
            title: `Please confirm you want to remove Ops Code ${editedItem?.code}`,
            onConfirm: handleRemove
        });
    }
    const handleRemove = async () => {
        if (selectedSC && editedItem) {
            try {
                await Api.call(
                    Api.endpoints.ComplimentaryServices.Remove,
                    {urlParams: {id: editedItem.id}}
                ).then(res => {
                    if (res) showMessage("Complimentary Service removed.");
                })
                setEditedItem(undefined);
                dispatch(loadComplimentary(selectedSC.id))
            } catch (e) {
                showError(e);
            }
        } else {
            showError(SC_UNDEFINED);
        }
    }

    const handleOpenMenu = (el: IComplimentaryServiceByQuery) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEditedItem(el);
        setAnchorEl(e.currentTarget);
    }

    const actions = (el:IComplimentaryServiceByQuery) => {
        return <IconButton onClick={handleOpenMenu(el)} size="large"><MoreHoriz /></IconButton>;
    }

    const onAddOpsCode = async (selectedCodes: number[], serviceCenterId: number) => {
        try {
            const newCodes = selectedCodes.filter(item => !selectedOpsCodes.includes(item));
            await dispatch(addOpsCodeFromList(
                newCodes,
                serviceCenterId,
                (e) => showError(e),
                () => showMessage(`${newCodes.length} ${newCodes.length > 1 ? 'Codes' : 'Code'} added`)
            ));
        } catch (e) {
            showError(e);
        } finally {
            await onAddOpsCodeClose();
        }
    }

    const handleSort = (d: IOrder<IComplimentaryServiceByQuery>) => async () => {
        await dispatch(setComplimentarySort(d));
        if (selectedSC) await dispatch(loadComplimentary(selectedSC.id));
    }

    const handleAddOpsCodeOpen = () => {
        if (selectedSC) dispatch(loadAllComplimentary(selectedSC.id))
        onAddOpsCodeOpen()
    }

    return (
        <div>
            <TitleContainer
                pad
                parent={capacityManagementRoot}
                actions={<div style={{display: "flex", alignItems: "center"}}>
                    <SearchInput
                        onChange={handleSearchChange}
                        value={complimentarySearchTerm}
                        onSearch={handleSearch}
                    />
                    <Button
                        style={{marginLeft: 16}}
                        color="primary"
                        variant="contained"
                        onClick={handleAddOpsCodeOpen}
                    >
                        Add Ops Codes
                    </Button>
                    <Button
                        style={{marginLeft: 16}}
                        color="primary"
                        variant="outlined"
                        onClick={onAddManuallyOpen}
                    >
                        Add Manually
                    </Button>
                </div>}
            />
            <div>
                <Table<IComplimentaryServiceByQuery>
                    data={complimentary}
                    index="id"
                    order={complimentarySortOrder?.orderBy}
                    isAscending={complimentarySortOrder?.isAscending}
                    rowData={tableData}
                    isLoading={isComplimentaryLoading}
                    page={pageIndex}
                    onSort={handleSort}
                    hidePagination={numberOfRecords < 11}
                    rowsPerPage={pageSize}
                    onChangePage={changePage}
                    onChangeRowsPerPage={changeRowsPerPage}
                    count={numberOfRecords}
                    actions={actions}
                />
            </div>
            <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleCloseMenu}>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={askRemove}>Remove</MenuItem>
            </Menu>
            <OPsCodesListDialog
                open={isAddOpsCodeOpen}
                onClose={onAddOpsCodeClose}
                onSave={onAddOpsCode}
                selectedPreviously={selectedOpsCodes}/>
            <AddServiceManually
                open={isAddManuallyOpen}
                onClose={handleAddManuallyClose}
                title={editedItem ? "Edit Complimentary Service" : "Add Service Manually"}
                editedItem={editedItem}/>
        </div>
    );
};