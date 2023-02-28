import React, {useCallback, useEffect, useState} from 'react';
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {SearchInput} from "../../UI/SearchInput";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {
    changeComplimentaryPageData,
    loadComplimentary, setComplimentaryPageData,
    setComplimentarySearchTerm,
    setComplimentarySort
} from "../../../store/reducers/packages/actions";
import {useDispatch, useSelector} from "react-redux";
import {useConfirm, useException, useMessage, useModal, usePagination, useSCs} from "../../../utils/hooks";
import {TableRowDataType} from "../../UI/types";
import {IComplimentaryServiceByQuery} from "../../../store/reducers/packages/types";
import {Table} from "../../UI/Table";
import {RootState} from "../../../store/rootReducer";
import {MoreHoriz} from "@material-ui/icons";
import {Api} from "../../../config/requests";
import {SC_UNDEFINED} from "../../../config/constants";
import AddServiceManually from "../../Modals/AddServiceManually/AddServiceManually";
import {OPsCodesListDialog} from "../../Modals/OPsCodesListDialog/OPsCodesListDialog";
import {addOpsCodeFromList, loadAllComplimentary} from "../../../store/reducers/complimentary/actions";
import {IOrder} from "../../../types/types";

const ComplimentaryServices = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [editedItem, setEditedItem] = useState<IComplimentaryServiceByQuery|undefined>(undefined);
    const [selectedOpsCodes, setSelectedOpsCodes] = useState<number[]>([]);

    const [
        complimentary,
        isLoading,
        servicesCount,
        sortOrder,
        searchTerm,
        allComplimentary,
    ] = useSelector((state: RootState) => [
        state.packages.complimentary,
        state.packages.isComplimentaryLoading,
        state.packages.complimentaryPaging.numberOfRecords,
        state.packages.complimentarySortOrder,
        state.packages.complimentarySearchTerm,
        state.packages.allComplimentary,
    ]);
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
        {header: "Service Ops Code", val: el => el.code, align: "center", orderId: "code"},
        {header: "Service Description", val: el => el.name, width: '57%', orderId: "name"},
        {header: "Duration (hours)", val: el => `${el.durationInHours}`, align: "center", width: 85, orderId: "durationInHours"},
        {header: "Regular Invoice", val: el => `$${el.price.toFixed(2)}`, align: "center", width: 85, orderId: "price" },
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
        return <IconButton onClick={handleOpenMenu(el)}><MoreHoriz /></IconButton>
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
                parent={optimizerRoot}
                actions={<div style={{display: "flex", alignItems: "center"}}>
                    <SearchInput
                        onChange={handleSearchChange}
                        value={searchTerm}
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
                        variant="contained"
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
                    order={sortOrder?.orderBy}
                    isAscending={sortOrder?.isAscending}
                    rowData={tableData}
                    isLoading={isLoading}
                    page={pageIndex}
                    onSort={handleSort}
                    hidePagination={servicesCount < pageSize && pageSize < 11}
                    rowsPerPage={pageSize}
                    onChangePage={changePage}
                    onChangeRowsPerPage={changeRowsPerPage}
                    count={servicesCount}
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

export default ComplimentaryServices;