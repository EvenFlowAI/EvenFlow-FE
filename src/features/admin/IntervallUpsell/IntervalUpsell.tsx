import React, {useCallback, useEffect, useState} from "react";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {Button, IconButton, Menu, MenuItem} from "@mui/material";
import {OPsCodesListDialog} from "../../../components/modals/admin/OPsCodesListDialog/OPsCodesListDialog";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    addUpsellServiceRequests,
    loadUpsellServiceRequests,
    setUpsellFilter, setUpsellOrdering, setUpsellPageData
} from "../../../store/reducers/serviceRequests/actions";
import {IUpsellServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {Table} from "../../../components/tables/Table/Table";
import {MoreHoriz} from "@mui/icons-material";
import {capacityManagementRoot, SC_UNDEFINED} from "../../../utils/constants";
import {SearchInput} from "../../../components/formControls/SearchInput/SearchInput";
import {IOrder, TableRowDataType} from "../../../types/types";
import IntervalUpsellModal from "./IntervalUpsellModal/IntervalUpsellModal";
import {ServiceRequestCellData} from "../../../components/wrappers/ServiceRequestCellData/ServiceRequestCellData";
import {useModal} from "../../../hooks/useModal/useModal";
import {useConfirm} from "../../../hooks/useConfirm/useConfirm";
import {usePagination} from "../../../hooks/usePaginations/usePaginations";

import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";

const tableRow: TableRowDataType<IUpsellServiceRequest>[] = [
    {
        header: "Ops Code",
        val: el => el.code ?? el.serviceRequest.code, orderId: "code",
        width: 130
    },
    {
        header: "Description",
        val: el => <ServiceRequestCellData data={el.serviceRequest?.description} override={el.description}/>,
        orderId: "description",
    },
    {
        header: "Labor Hours",
        val: el => <ServiceRequestCellData
            override={el.durationInHours?.toFixed(1)}
            data={el.serviceRequest?.durationInHours?.toFixed(1)}
        />,
        orderId: "duration",
        width: 100,
    },
    {
        header: "Labor Amount",
        val: el => <ServiceRequestCellData
            prefix="$"
            override={el.invoiceAmount?.toFixed(2)}
            data={el.serviceRequest?.invoiceAmount?.toFixed(2)}
        />,
        orderId: "invoiceAmount",
        width: 100,
    },
    {
        header: "Parts Price",
        val: el => <ServiceRequestCellData
            prefix="$"
            override={el.partsUnitCost?.toFixed(2)}
            data={el.serviceRequest?.partsUnitCost?.toFixed(2)}
        />,
        width: 100,
    },
    {
        header: "Total Amount",
        val: el => <ServiceRequestCellData
            prefix="$"
            override={el.numberOfParts?.toString()}
            data={el.serviceRequest?.numberOfParts?.toString()}
        />,
        width: 100,
    }
]

export const IntervalUpsell = () => {
    const {
        intervalUpsellList,
        upsellLoading,
        upsellPaging: {numberOfRecords},
        upsellPageData,
        upsellFilter: {searchTerm},
        upsellOrdering
    } = useSelector(({serviceRequests}: RootState) => serviceRequests);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [editedItem, setEditedItem] = useState<IUpsellServiceRequest|undefined>(undefined);

    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();
    const {askConfirm} = useConfirm();
    const {isOpen, onOpen, onClose} = useModal();
    const {isOpen: isOOpen, onOpen: onOOpen, onClose: onOClose} = useModal();
    const {changeRowsPerPage,changePage,pageIndex,pageSize} = usePagination(
        (s: RootState) => s.serviceRequests.upsellPageData,
        setUpsellPageData
    );

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadUpsellServiceRequests(selectedSC.id));
        }
    }, [selectedSC, dispatch, upsellPageData, upsellOrdering]);

    const actions = (el: IUpsellServiceRequest) => {
        return <IconButton onClick={handleOpenMenu(el)} size="large"><MoreHoriz /></IconButton>;
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
            parent={capacityManagementRoot}
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
                    onClick={handleAddOpsCode}
                >
                    Add Ops Codes
                </Button>
            </div>}
        />
        <Table<IUpsellServiceRequest>
            data={intervalUpsellList}
            order={upsellOrdering.orderBy}
            isAscending={upsellOrdering.isAscending}
            onSort={handleSort}
            index="id"
            rowData={tableRow}
            rowsPerPage={pageSize}
            page={pageIndex}
            onChangePage={changePage}
            onChangeRowsPerPage={changeRowsPerPage}
            count={numberOfRecords}
            hidePagination={numberOfRecords < 11}
            actions={actions}
            isLoading={upsellLoading}
        />
        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleCloseMenu}>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={askRemove}>Remove</MenuItem>
        </Menu>
        <OPsCodesListDialog open={isOpen} onClose={onClose} onSave={onRequestAssign}/>
        <IntervalUpsellModal payload={editedItem} open={isOOpen} onClose={onOClose}/>
    </>;
}