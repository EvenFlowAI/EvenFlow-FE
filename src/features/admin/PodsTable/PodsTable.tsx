import React, {useEffect, useState} from "react";
import {PODModal} from "./PODModal/PODModal";
import {Button, IconButton, Menu, MenuItem} from "@mui/material";
import {EAppointmentType, EJobType, IPod} from "../../../store/reducers/pods/types";
import {useDispatch, useSelector} from "react-redux";
import {loadPods, removePod, setPodsPageData} from "../../../store/reducers/pods/actions";
import {RootState} from "../../../store/rootReducer";
import {Table} from "../../../components/tables/Table/Table";
import {MoreHoriz} from "@mui/icons-material";
import {TViewMode} from "../../../components/modals/BaseModal/types";
import {getTransportationOptionString} from "../../../utils/utils";
import {getNameFromEnum} from "./utils";
import {TableRowDataTypeResp} from "../../../types/types";
import {useModal} from "../../../hooks/useModal/useModal";
import {useConfirm} from "../../../hooks/useConfirm/useConfirm";
import {usePagination} from "../../../hooks/usePaginations/usePaginations";

import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";

const rowData: TableRowDataTypeResp<IPod>[] = [
    {
        header: "POD#",
        val: el => el.name
    },
    {
        header: "Description",
        val: e => e.description,
        xsHidden: true
    },
    {
        header: "Advisor",
        val: e => e.advisor?.fullName
    },
    {
        header: "Technicians",
        val: e => e.technicians?.map(t => t.fullName).join(", ") || ""
    },
    {
        header: "Bays",
        val: e => e.bays?.map(b => b.name).join(", ") || ""
    },
    {
        header: "Service Requests",
        val: e => e.serviceRequests?.map(s => s.code).join(", ") || "",
        xsHidden: true
    },
    {
        header: "Makes",
        val: e => e.vehicleMakes?.map(s => s.name).join(", ") || "",
        xsHidden: true
    },
    {
        header: "Models",
        val: e => e.vehicleModels?.map(s => s.name).join(", ") || "",
        xsHidden: true
    },
    {
        header: "Job Type",
        val: e => typeof e.jobType !== "undefined" && Number.isInteger(+e.jobType) ? EJobType[e.jobType] : "",
        xsHidden: true
    },
    {
        header: "Engine Types",
        val: e => e.engineTypes?.map(type => type.name).join(", ") || "",
        xsHidden: true
    },
    {
        header: "Service Valet Zones",
        val: e => {
            return e.serviceValetZones?.length
                ? <div>
                    {e.serviceValetZones?.map((zone, i) => {
                        const notLastElement = e.serviceValetZones && i !== e.serviceValetZones?.length - 1;
                        return <div>{zone.name}{notLastElement ? ',' : ''}</div>})}
                        </div>
                : ''
                    },
        xsHidden: true,
    },
    {
        header: "Mobile Zones",
        val: e => {
            return e.mobileZones?.length
                ? <div>
                    {e.mobileZones?.map((zone, i) => {
                        const notLastElement = e.mobileZones && i !== e.mobileZones?.length - 1;
                        return <div>{zone.name}{notLastElement ? ',' : ''}</div>})}
                </div>
                : ''
        },
        xsHidden: true
    },
    {
        header: "Appointment Type",
        val: e => typeof e.appointmentType !== "undefined" && Number.isInteger(+e.appointmentType)
            ? getNameFromEnum(EAppointmentType[e.appointmentType])
            : "",
        xsHidden: true
    },
    {
        header: "Transportation Options",
        val: e => e.transportationOptions?.map(tr => getTransportationOptionString(tr.type)).join(", ") || "",
        xsHidden: true
    },
]

export const PodsTable:React.FC<React.PropsWithChildren<React.PropsWithChildren<{dense?: boolean}&TViewMode>>> = ({dense, viewMode}) => {
    const {
        podsList,
        podsPaging: {numberOfRecords},
        podsLoading
    } = useSelector(({pods}: RootState) => pods);
    const [editedItem, setEditedItem] = useState<IPod|undefined>(undefined);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);

    const {selectedSC} = useSCs();
    const showMessage = useMessage();
    const showError = useException();
    const {askConfirm} = useConfirm();
    const dispatch = useDispatch();
    const {isOpen, onClose, onOpen} = useModal();
    const {pageSize, pageIndex, changeRowsPerPage, changePage} = usePagination(state => state.pods.podsPageData, setPodsPageData);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadPods(selectedSC.id));
        }
    }, [selectedSC, dispatch, pageIndex, pageSize]);

    const handleAdd = () => {
        setEditedItem(undefined);
        onOpen();
    }
    const handleEdit = () => {
        setAnchorEl(null);
        onOpen();
    }

    const askRemove = () => {
        setAnchorEl(null);
        askConfirm({
            isRemove: true,
            title: `Please confirm you want to remove POD ${editedItem?.name}`,
            onConfirm: handleRemove
        });
    }

    const handleRemove = async () => {
        if (!editedItem) {
            showError("POD not specified");
        } else {
            try {
                await dispatch(removePod(editedItem.id, selectedSC?.id));
                showMessage(`POD removed`);
                setEditedItem(undefined);
            } catch (e) {
                showError(e);
            }
        }
    }

    const handleOpenMenu = (el: IPod) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setAnchorEl(e.currentTarget);
        setEditedItem(el);
    }

    const actions = (el: IPod) => {
        return (
            <IconButton onClick={handleOpenMenu(el)} size="large">
                <MoreHoriz />
            </IconButton>
        );
    }

    const onEditClose = () => {
        setEditedItem(undefined);
        onClose()
    }

    return <div>
        {!viewMode ? <div style={{textAlign: "right"}}>
            <Button
                onClick={handleAdd}
                variant="contained"
                color="primary"
            >
                Create POD
            </Button>
        </div> : null}
        <Table<IPod>
            data={podsList}
            viewMode={viewMode}
            index='id'
            rowData={rowData}
            compact={dense}
            page={pageIndex}
            rowsPerPage={pageSize}
            onChangePage={changePage}
            onChangeRowsPerPage={changeRowsPerPage}
            count={numberOfRecords}
            actions={actions}
            startActions={actions}
            isLoading={podsLoading}
        />
        <PODModal open={isOpen} onClose={onEditClose} editingItemId={editedItem?.id} />
        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={askRemove}>Remove</MenuItem>
        </Menu>
    </div>
}