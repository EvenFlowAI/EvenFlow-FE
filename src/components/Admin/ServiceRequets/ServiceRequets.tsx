import React, {useCallback, useEffect, useState} from "react";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {SearchInput} from "../../UI/SearchInput";
import {useDispatch, useSelector} from "react-redux";
import {
    archiveAdminServiceRequest,
    loadAdminServiceRequests,
    removeAdminServiceRequest,
    setAdminFilter,
    setAdminPageData
} from "../../../store/reducers/serviceRequests/actions";
import {useConfirm, useException, useMessage, useModal, usePagination} from "../../../utils/hooks";
import {TableRowDataType} from "../../UI/types";
import {EServiceStatus, ISRAdmin} from "../../../store/reducers/serviceRequests/types";
import {Table} from "../../UI/Table";
import {RootState} from "../../../store/rootReducer";
import {ArchiveOutlined, CheckCircle, MoreHoriz} from "@material-ui/icons";
import {CreateOPsCode} from "../../Modals/CreateOPsCode/CreateOPsCode";

const rowData: TableRowDataType<ISRAdmin>[] = [
    {header: "OPs Code", val: el => el.code},
    {header: "Description", val: el => el.description},
    {
        header: "Duration (hours)",
        align: "center",
        val: el => String(el.durationInHours)
    },
    {
        header: "Number of technicians",
        align: "center",
        val: el => String(el.countOfTechnicians)
    },
    {
        header: "Skill Level of technicians",
        align: "center",
        val: el => String(el.skillLevelOfTechnicians)
    },
    {
        header: "Warranty Invoice",
        align: "center",
        val: el => `$${el.warrantyInvoiceAmount}`
    },
    {
        header: "Regular Invoice",
        align: "center",
        val: el => `$${el.invoiceAmount}`
    },
    {
        header: "Parts Unit Cost",
        align: "center",
        val: el => `$${el.partsUnitCost}`
    },
    {
        header: "Number of Parts",
        align: "center",
        val: el => `${el.numberOfParts}`
    },
    {
        header: "Status",
        align: "center",
        val: el => el.status === EServiceStatus.Archived
            ? <ArchiveOutlined fontSize="small" color="secondary" />
            : <CheckCircle fontSize="small" color="primary" />
    }
];

export const ServiceRequests = () => {
    const [
        serviceRequests,
        loading,
        count,
        searchTerm
    ] = useSelector((state: RootState) => [
        state.serviceRequests.adminList,
        state.serviceRequests.adminLoading,
        state.serviceRequests.adminPaging.numberOfRecords,
        state.serviceRequests.adminFilters.searchTerm
    ]);
    const [editedItem, setEditedItem] = useState<ISRAdmin|undefined>(undefined);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);

    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();
    const {askConfirm} = useConfirm();
    const {onOpen, onClose, isOpen} = useModal();
    const {pageIndex, pageSize, changePage, changeRowsPerPage} = usePagination(
        state => state.serviceRequests.adminPageData, setAdminPageData
    );

    useEffect(() => {
        dispatch(loadAdminServiceRequests());
    }, [dispatch, pageIndex, pageSize]);

    const openMenu = (el: ISRAdmin) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEditedItem(el);
        setAnchorEl(e.currentTarget);
    }

    const openEdit = () => {
        setAnchorEl(null);
        onOpen();
    }
    const openCreate = () => {
        setAnchorEl(null);
        setEditedItem(undefined);
        onOpen();
    }

    const askRemove = () => {
        setAnchorEl(null);
        if (!editedItem) {
            showError("Service request is not loaded");
        } else {
            askConfirm({
                isRemove: true,
                title: `Please confirm you want to remove Service Request ${editedItem.code}?`,
                onConfirm: handleRemove
            });
        }
    }

    const handleRemove = async () => {
        if (!editedItem) {
            showError("Service request is not loaded");
        } else {
            try {
                await dispatch(removeAdminServiceRequest(editedItem));
                showMessage("Removed");
                setEditedItem(undefined);
            } catch (e) {
                showError(e);
            }
        }
    }

    const askArchive = () => {
        setAnchorEl(null);
        if (!editedItem) {
            showError("Service request is not loaded");
        } else {
            const isArchived = editedItem.status === EServiceStatus.Archived;
            askConfirm({
                isRemove: true,
                confirmContent: isArchived ? "Restore" : "Archive",
                title: `${isArchived ? "Restore" : "Archive"} service request ${editedItem.code}?`,
                onConfirm: handleArchive
            });
        }
    }

    const handleArchive = async () => {
        if (!editedItem) {
            showError("Service request is not loaded");
        } else {
            try {
                await dispatch(archiveAdminServiceRequest(editedItem));
                showMessage("Archived");
                setEditedItem(undefined);
            } catch (e) {
                showError(e);
            }
        }
    }

    const handleSearch = useCallback(() => {
        dispatch(loadAdminServiceRequests());
    }, [dispatch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setAdminFilter({searchTerm: e.target.value}));
    }

    const titleActions = <div style={{display: "flex", alignItems: "center"}}>
        <SearchInput onSearch={handleSearch} onChange={handleSearchChange} value={searchTerm} />
        <Button
            style={{marginLeft: 16}}
            color="primary"
            onClick={openCreate}
            variant="contained">
            Add Ops Code
        </Button>
    </div>;

    const tableActions = (el: ISRAdmin) => {
        return <IconButton onClick={openMenu(el)}>
            <MoreHoriz />
        </IconButton>;
    }

    return <>
        <TitleContainer title="Service Requests" pad actions={titleActions} />
        <Table<ISRAdmin>
            data={serviceRequests}
            index="id"
            rowData={rowData}
            count={count}
            page={pageIndex}
            rowsPerPage={pageSize}
            compact
            actions={tableActions}
            onChangePage={changePage}
            isLoading={loading}
            onChangeRowsPerPage={changeRowsPerPage}
        />
        <CreateOPsCode open={isOpen} onClose={onClose} payload={editedItem} />
        <Menu
            open={Boolean(anchorEl)}
            onClose={() => {setAnchorEl(null);}}
            anchorEl={anchorEl}
        >
            <MenuItem onClick={openEdit}>Edit</MenuItem>
            <MenuItem onClick={askArchive}>{
                editedItem && editedItem.status === EServiceStatus.Archived
                    ? "Restore"
                    : "Archive"
            }</MenuItem>
            <MenuItem onClick={askRemove}>Remove</MenuItem>
        </Menu>
    </>
}