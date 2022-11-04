import React, {useCallback, useEffect, useState} from "react";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {Button, IconButton, Menu, MenuItem, Tooltip} from "@material-ui/core";
import {OPsCodesListDialog} from "../../Modals/OPsCodesListDialog/OPsCodesListDialog";
import {useConfirm, useException, useMessage, useModal, usePagination, useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    assignServiceRequests,
    loadAssignedServiceRequests,
    setAssignedFilter, setAssignedOrdering,
    setAssignedPageData
} from "../../../store/reducers/serviceRequests/actions";
import {TableRowDataType} from "../../UI/types";
import {IAssignedServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {Table} from "../../UI/Table";
import {MoreHoriz} from "@material-ui/icons";
import {OverrideOPsCodeDialog} from "../../Modals/OPsCodesListDialog/OverrideOPsCodeDialog";
import {Api} from "../../../config/requests";
import {SC_UNDEFINED} from "../../../config/constants";
import {SearchInput} from "../../UI/SearchInput";
import {IOrder} from "../../../types/types";

const tableRow: TableRowDataType<IAssignedServiceRequest>[] = [
    {header: "Service Ops Code", val: el => el.serviceRequest.code, orderId: "code"},
    {
        header: "Description",
        val: el => <CellData
            data={el.serviceRequest.description}
            override={el.serviceRequestOverride?.description}
        />,
        orderId: "description"
    },
    {
        header: "Duration (hours)",
        align: "center",
        val: el => <CellData
            data={el.serviceRequest.durationInHours.toFixed(1)}
            override={el.serviceRequestOverride?.durationInHours?.toFixed(1)}
        />,
        orderId: "duration"
    },
    {
        header: "Number of technicians",
        align: "center",
        val: el => <CellData
            data={el.serviceRequest.countOfTechnicians.toString()}
            override={el.serviceRequestOverride?.countOfTechnicians?.toString()}
        />,
        orderId: "countOfTechnicians"
    },
    {
        header: "Skill Level of technicians",
        align: "center",
        val: el => <CellData
            data={el.serviceRequest.skillLevelOfTechnicians.toString()}
            override={el.serviceRequestOverride?.skillLevelOfTechnicians?.toString()}
        />,
        orderId: "skillLevelOfTechnicians"
    },
    {
        header: "Warranty Invoice",
        align: "center",
        val: el => <CellData
            prefix="$"
            data={el.serviceRequest.warrantyInvoiceAmount.toFixed(2)}
            override={el.serviceRequestOverride?.warrantyInvoiceAmount?.toFixed(2)}
        />,
        orderId: "warrantyInvoiceAmount"
    },
    {
        header: "Regular Invoice",
        align: "center",
        val: el => <CellData
            prefix="$"
            data={el.serviceRequest.invoiceAmount.toFixed(2)}
            override={el.serviceRequestOverride?.invoiceAmount?.toFixed(2)}
        />,
        orderId: "invoiceAmount"
    },
    {
        header: "Parts Unit Cost",
        align: "center",
        val: el => <CellData
            prefix="$"
            data={el.serviceRequest.partsUnitCost?.toFixed(2)}
            override={el.serviceRequestOverride?.partsUnitCost?.toFixed(2)}
        />,
        orderId: "partsUnitCost"
    },
    {
        header: "Number of Parts",
        align: "center",
        val: el => <CellData
            data={el.serviceRequest.numberOfParts?.toString()}
            override={el.serviceRequestOverride?.numberOfParts?.toString()}
        />,
        orderId: "numberOfParts"
    }
]

const CellData: React.FC<{
    data: string; override?: string, prefix?: string; suffix?: string;
}> = ({data, override, prefix, suffix}) => {
    return override ? <Tooltip placement="top" title={`Default value: ${prefix || ""}${data}${suffix || ""}`}>
        <strong style={{cursor: "pointer", userSelect: "none"}}>{prefix}{override}{suffix}</strong>
    </Tooltip> : <span>{prefix}{data}{suffix}</span>;
}

export const OPsCodesPage = () => {
    const {isOpen, onOpen, onClose} = useModal();
    const {isOpen: isOOpen, onOpen: onOOpen, onClose: onOClose} = useModal();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();
    const [
        serviceRequestsList,
        isLoading,
        requestsCount,
        pageData,
        search,
        order
    ] = useSelector((state: RootState) => [
        state.serviceRequests.assignedList,
        state.serviceRequests.assignedLoading,
        state.serviceRequests.assignedPaging.numberOfRecords,
        state.serviceRequests.assignedPageData,
        state.serviceRequests.assignedFilter.searchTerm,
        state.serviceRequests.assignedOrdering
    ]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [editedItem, setEditedItem] = useState<IAssignedServiceRequest|undefined>(undefined);
    const {askConfirm} = useConfirm();
    const {changeRowsPerPage,changePage,pageIndex,pageSize} = usePagination(
        (s: RootState) => s.serviceRequests.assignedPageData,
        setAssignedPageData
    );

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadAssignedServiceRequests(selectedSC.id));
        }
    }, [selectedSC, dispatch, pageData, order]);
    const actions = (el: IAssignedServiceRequest) => {
        return <IconButton onClick={handleOpenMenu(el)}><MoreHoriz /></IconButton>
    }

    const handleAddOpsCode = () => {
        setEditedItem(undefined);
        onOpen();
    }
    const handleOpenMenu = (el: IAssignedServiceRequest) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEditedItem(el);
        setAnchorEl(e.currentTarget);
    }
    const handleCloseMenu = () => {
        setAnchorEl(null);
        setEditedItem(undefined);
    }
    const handleEdit = () => {
        setAnchorEl(null);
        onOOpen();
    }
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setAssignedFilter({searchTerm: e.target.value}));
    }
    const handleSort = (o: IOrder<IAssignedServiceRequest>) => () => {
        dispatch(setAssignedOrdering(o));
    }
    const handleSearch = useCallback(() => {
        if (selectedSC) {
            changePage(null, 0);
            dispatch(setAssignedPageData({pageIndex: 0}));
            dispatch(loadAssignedServiceRequests(selectedSC.id));
        }
    }, [selectedSC, dispatch]);

    const askRemove = () => {
        setAnchorEl(null);
        askConfirm({
            isRemove: true,
            title: `Please confirm you want to remove Ops Code ${editedItem?.serviceRequest.code}`,
            onConfirm: handleRemove
        });
    }
    const handleRemove = async () => {
        if (selectedSC && editedItem) {
            try {
                await Api.call(
                    Api.endpoints.ServiceRequests.RemoveOverride,
                    {urlParams: {id: editedItem.id}}
                ).then(res => {
                    if (res) showMessage("Service Request removed.")
                })
                setEditedItem(undefined);
                dispatch(loadAssignedServiceRequests(selectedSC.id));
            } catch (e) {
                showError(e);
            }
        } else {
            showError(SC_UNDEFINED);
        }
    }
    const onSuccessAssign = useCallback((selectedCodes: number[]) => {
        showMessage(`${selectedCodes.length} ${selectedCodes.length > 1 ? 'Ops Codes' : 'Ops Code'} added`)
    }, [])

    const onRequestAssign = useCallback((selectedCodes: number[], serviceCenterId: number) => {
        dispatch(assignServiceRequests(selectedCodes, serviceCenterId, showError, onSuccessAssign));
    }, [dispatch, showError, onSuccessAssign])

    return <>
        <TitleContainer
            pad
            parent={optimizerRoot}
            actions={<div style={{display: "flex", alignItems: "center"}}>
                <SearchInput
                    onChange={handleSearchChange}
                    value={search}
                    onSearch={handleSearch}
                />
                <Button
                    style={{marginLeft: 16}}
                    color="primary"
                    variant="contained"
                    onClick={handleAddOpsCode}
                >
                    Add Ops Codes
                </Button>
            </div>}
        />
        <Table<IAssignedServiceRequest>
            data={serviceRequestsList}
            order={order.orderBy}
            isAscending={order.isAscending}
            onSort={handleSort}
            index="id"
            rowData={tableRow}
            rowsPerPage={pageSize}
            page={pageIndex}
            onChangePage={changePage}
            onChangeRowsPerPage={changeRowsPerPage}
            count={requestsCount}
            hidePagination={requestsCount < pageSize}
            actions={actions}
            isLoading={isLoading}
        />
        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleCloseMenu}>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={askRemove}>Remove</MenuItem>
        </Menu>
        <OPsCodesListDialog open={isOpen} onClose={onClose} onSave={onRequestAssign}/>
        <OverrideOPsCodeDialog open={isOOpen} onClose={onOClose} payload={editedItem} />
    </>;
}