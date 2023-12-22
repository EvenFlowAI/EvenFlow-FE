import React, {Dispatch, SetStateAction, useState} from 'react';
import {Table} from "../../../../components/Table/Table";
import {IAssignedServiceRequest} from "../../../../store/reducers/serviceRequests/types";
import {IconButton, Menu, MenuItem} from "@material-ui/core";
import {Api} from "../../../../config/requests";
import {
    loadAssignedServiceRequests,
    setAssignedOrdering,
} from "../../../../store/reducers/serviceRequests/actions";
import {SC_UNDEFINED} from "../../../../utils/constants";
import {IOrder, TableRowDataType, TCallback} from "../../../../types/types";
import {MoreHoriz} from "@material-ui/icons";
import {RootState} from "../../../../store/rootReducer";
import {useDispatch, useSelector} from "react-redux";
import {ServiceRequestCellData} from "../../../../components/ServiceRequestCellData/ServiceRequestCellData";
import {useConfirm} from "../../../../hooks/useConfirm/useConfirm";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

const RowData: TableRowDataType<IAssignedServiceRequest>[] = [
    {header: "Service Ops Code", val: el => el.serviceRequest.code, orderId: "code"},
    {
        header: "Description",
        val: el => <ServiceRequestCellData
            data={el.serviceRequest.description}
            override={el.serviceRequestOverride?.description}
        />,
        orderId: "description"
    },
    {
        header: "Duration (hours)",
        align: "center",
        val: el => <ServiceRequestCellData
            data={el.serviceRequest.durationInHours.toFixed(1)}
            override={el.serviceRequestOverride?.durationInHours?.toFixed(1)}
        />,
        orderId: "duration"
    },
    {
        header: "Number of Technicians",
        align: "center",
        val: el => <ServiceRequestCellData
            data={el.serviceRequest.countOfTechnicians.toString()}
            override={el.serviceRequestOverride?.countOfTechnicians?.toString()}
        />,
        orderId: "countOfTechnicians"
    },
    {
        header: "Skill Level of Technicians",
        align: "center",
        val: el => <ServiceRequestCellData
            data={el.serviceRequest.skillLevelOfTechnicians.toString()}
            override={el.serviceRequestOverride?.skillLevelOfTechnicians?.toString()}
        />,
        orderId: "skillLevelOfTechnicians"
    },
    {
        header: "Warranty Invoice",
        align: "center",
        val: el => <ServiceRequestCellData
            prefix="$"
            data={el.serviceRequest.warrantyInvoiceAmount.toFixed(2)}
            override={el.serviceRequestOverride?.warrantyInvoiceAmount?.toFixed(2)}
        />,
        orderId: "warrantyInvoiceAmount"
    },
    {
        header: "Regular Invoice",
        align: "center",
        val: el => <ServiceRequestCellData
            prefix="$"
            data={el.serviceRequest.invoiceAmount.toFixed(2)}
            override={el.serviceRequestOverride?.invoiceAmount?.toFixed(2)}
        />,
        orderId: "invoiceAmount"
    },
    {
        header: "Parts Unit Cost",
        align: "center",
        val: el => <ServiceRequestCellData
            prefix="$"
            data={el.serviceRequest.partsUnitCost?.toFixed(2)}
            override={el.serviceRequestOverride?.partsUnitCost?.toFixed(2)}
        />,
        orderId: "partsUnitCost"
    },
    {
        header: "Number of Parts",
        align: "center",
        val: el => <ServiceRequestCellData
            data={el.serviceRequest.numberOfParts?.toString()}
            override={el.serviceRequestOverride?.numberOfParts?.toString()}
        />,
        orderId: "numberOfParts"
    }
]

type TProps = {
    setEditedItem: Dispatch<SetStateAction<IAssignedServiceRequest|undefined>>;
    onOOpen: TCallback;
    editedItem: IAssignedServiceRequest|undefined,
    pageSize: number;
    pageIndex: number;
    changePage: (e: React.MouseEvent<Element, MouseEvent> | null, pageNumber: number) => void;
    changeRowsPerPage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ServiceRequestsTable: React.FC<TProps> = ({setEditedItem, onOOpen, editedItem, pageSize, pageIndex, changePage, changeRowsPerPage}) => {
    const [
        serviceRequestsList,
        isLoading,
        requestsCount,
        order
    ] = useSelector((state: RootState) => [
        state.serviceRequests.assignedList,
        state.serviceRequests.assignedLoading,
        state.serviceRequests.assignedPaging.numberOfRecords,
        state.serviceRequests.assignedOrdering
    ]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const {selectedSC} = useSCs();

    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();
    const {askConfirm} = useConfirm();


    const handleOpenMenu = (el: IAssignedServiceRequest) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEditedItem(el);
        setAnchorEl(e.currentTarget);
    }

    const actions = (el: IAssignedServiceRequest) => {
        return <IconButton onClick={handleOpenMenu(el)}><MoreHoriz /></IconButton>
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setEditedItem(undefined);
    }

    const handleEdit = () => {
        setAnchorEl(null);
        onOOpen();
    }

    const handleSort = (o: IOrder<IAssignedServiceRequest>) => () => {
        dispatch(setAssignedOrdering(o));
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

    const askRemove = () => {
        setAnchorEl(null);
        askConfirm({
            isRemove: true,
            title: `Please confirm you want to remove Ops Code ${editedItem?.serviceRequest.code}`,
            onConfirm: handleRemove
        });
    }

    return (
        <>
            <Table<IAssignedServiceRequest>
                data={serviceRequestsList}
                order={order.orderBy}
                isAscending={order.isAscending}
                onSort={handleSort}
                index="id"
                rowData={RowData}
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
        </>
    );
};