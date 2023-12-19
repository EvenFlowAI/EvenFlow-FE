import React, {useCallback, useEffect, useState} from "react";
import {TitleContainer} from "../../components/Content/TitleContainer/TitleContainer";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {OPsCodesListDialog} from "../../components/Modals/OPsCodesListDialog/OPsCodesListDialog";
import {useConfirm, useException, useMessage, useModal, usePagination, useSCs} from "../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {
    addUpsellServiceRequests,
    loadUpsellServiceRequests,
    setUpsellFilter, setUpsellOrdering, setUpsellPageData
} from "../../store/reducers/serviceRequests/actions";
import {TableRowDataType} from "../../components/UI/types";
import {IUpsellServiceRequest} from "../../store/reducers/serviceRequests/types";
import {Table} from "../../components/UI/Table";
import {MoreHoriz} from "@material-ui/icons";
import {Api} from "../../config/requests";
import {optimizerRoot, SC_UNDEFINED} from "../../config/constants";
import {SearchInput} from "../../components/UI/SearchInput";
import {IOrder} from "../../types/types";
import IntervalUpsellModal from "./IntervalUpsellModal/IntervalUpsellModal";
import {ServiceRequestCellData} from "../../components/UI/ServiceRequestCellData";

const tableRow: TableRowDataType<IUpsellServiceRequest>[] = [
    {
        header: "Service Ops Code",
        val: el => el.code ?? el.serviceRequest.code, orderId: "code"
    },
    {
        header: "Description",
        val: el => <ServiceRequestCellData data={el.serviceRequest?.description} override={el.description}/>,
        orderId: "description"
    },
    {
        header: "Duration (hours)",
        align: "center",
        val: el => <ServiceRequestCellData
            override={el.durationInHours?.toFixed(1)}
            data={el.serviceRequest?.durationInHours?.toFixed(1)}
        />,
        orderId: "duration"
    },
    {
        header: "Regular Invoice",
        align: "center",
        val: el => <ServiceRequestCellData
            prefix="$"
            override={el.invoiceAmount?.toFixed(2)}
            data={el.serviceRequest?.invoiceAmount?.toFixed(2)}
        />,
        orderId: "invoiceAmount"
    },
    {
        header: "Parts Unit Cost",
        align: "center",
        val: el => <ServiceRequestCellData
            prefix="$"
            override={el.partsUnitCost?.toFixed(2)}
            data={el.serviceRequest?.partsUnitCost?.toFixed(2)}
        />,
    },
    {
        header: "Number of Parts",
        align: "center",
        val: el => <ServiceRequestCellData
            override={el.numberOfParts?.toString()}
            data={el.serviceRequest?.numberOfParts?.toString()}
        />,
    }
]

export const IntervalUpsell = () => {
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
        state.serviceRequests.intervalUpsellList,
        state.serviceRequests.upsellLoading,
        state.serviceRequests.upsellPaging.numberOfRecords,
        state.serviceRequests.upsellPageData,
        state.serviceRequests.upsellFilter.searchTerm,
        state.serviceRequests.upsellOrdering
    ]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [editedItem, setEditedItem] = useState<IUpsellServiceRequest|undefined>(undefined);
    const {askConfirm} = useConfirm();
    const {changeRowsPerPage,changePage,pageIndex,pageSize} = usePagination(
        (s: RootState) => s.serviceRequests.upsellPageData,
        setUpsellPageData
    );

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadUpsellServiceRequests(selectedSC.id));
        }
    }, [selectedSC, dispatch, pageData, order]);

    const actions = (el: IUpsellServiceRequest) => {
        return <IconButton onClick={handleOpenMenu(el)}><MoreHoriz /></IconButton>
    }

    const handleAddOpsCode = () => {
        setEditedItem(undefined);
        onOpen();
    }
    const handleOpenMenu = (el: IUpsellServiceRequest) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
        dispatch(setUpsellFilter({searchTerm: e.target.value}));
    }
    const handleSort = (o: IOrder<IUpsellServiceRequest>) => () => {
        dispatch(setUpsellOrdering(o));
    }
    const handleSearch = useCallback(() => {
        if (selectedSC) {
            changePage(null, 0);
            dispatch(setUpsellPageData({pageIndex: 0}));
            dispatch(loadUpsellServiceRequests(selectedSC.id));
        }
    }, [selectedSC, dispatch]);

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
                    Api.endpoints.IntervalUpsell.RemoveUpsell,
                    {urlParams: {id: editedItem.id}}
                ).then(res => {
                    if (res) showMessage("Interval Upsell removed.")
                })
                setEditedItem(undefined);
                dispatch(loadUpsellServiceRequests(selectedSC.id));
            } catch (e) {
                showError(e);
            }
        } else {
            showError(SC_UNDEFINED);
        }
    }
    const onSuccessAdding = useCallback((selectedCodes: number[]) => {
        showMessage(`${selectedCodes.length} ${selectedCodes.length > 1 ? 'Ops Codes' : 'Ops Code'} added`)
    }, [])

    const onRequestAssign = useCallback((selectedCodes: number[], serviceCenterId: number) => {
        dispatch(addUpsellServiceRequests(selectedCodes, serviceCenterId, showError, onSuccessAdding));
    }, [dispatch, showError, onSuccessAdding])

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
        <Table<IUpsellServiceRequest>
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
            hidePagination={requestsCount < 11}
            actions={actions}
            isLoading={isLoading}
        />
        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleCloseMenu}>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={askRemove}>Remove</MenuItem>
        </Menu>
        <OPsCodesListDialog open={isOpen} onClose={onClose} onSave={onRequestAssign}/>
        <IntervalUpsellModal payload={editedItem} open={isOOpen} onClose={onOClose}/>
    </>;
}