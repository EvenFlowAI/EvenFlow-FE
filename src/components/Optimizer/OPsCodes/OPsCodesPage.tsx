import React, {useEffect, useState} from "react";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {OPsCodesListDialog} from "../../Modals/OPsCodesListDialog/OPsCodesListDialog";
import {useConfirm, useException, useMessage, useModal, useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadAssignedServiceRequests} from "../../../store/reducers/serviceRequests/actions";
import {TableRowDataType} from "../../UI/types";
import {IAssignedServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {Table} from "../../UI/Table";
import {MoreHoriz} from "@material-ui/icons";
import {OverrideOPsCodeDialog} from "../../Modals/OPsCodesListDialog/OverrideOPsCodeDialog";
import {Api} from "../../../config/requests";
import {SC_UNDEFINED} from "../../../config/constants";

const tableRow: TableRowDataType<IAssignedServiceRequest>[] = [
    {header: "Service Ops Code", val: el => el.serviceRequest.code},
    {
        header: "Description",
        val: el => <CellData
            data={el.serviceRequest.description}
            override={el.serviceRequestOverride?.description}
        />
    },
    {
        header: "Duration (hours)",
        align: "center",
        val: el => <CellData
            data={el.serviceRequest.durationInHours.toFixed(1)}
            override={el.serviceRequestOverride?.durationInHours.toFixed(1)}
        />
    },
    {
        header: "Number of technicians",
        align: "center",
        val: el => <CellData
            data={el.serviceRequest.countOfTechnicians.toString()}
            override={el.serviceRequestOverride?.countOfTechnicians.toString()}
        />
    },
    {
        header: "Skill level of technicians",
        align: "center",
        val: el => <CellData
            data={el.serviceRequest.skillLevelOfTechnicians.toString()}
            override={el.serviceRequestOverride?.skillLevelOfTechnicians.toString()}
        />
    },
    {
        header: "Warranty invoice",
        align: "center",
        val: el => <CellData
            data={"$" + el.serviceRequest.warrantyInvoiceAmount.toString()}
            override={"$" + el.serviceRequestOverride?.warrantyInvoiceAmount.toString()}
        />
    },
    {
        header: "Regular invoice",
        align: "center",
        val: el => <CellData
            data={"$" + el.serviceRequest.invoiceAmount.toString()}
            override={"$" + el.serviceRequestOverride?.invoiceAmount.toString()}
        />
    }
]

const CellData: React.FC<{data: string; override?: string}> = ({data, override}) => {
    return <span>{data}</span>;
}

export const OPsCodesPage = () => {
    const {isOpen, onOpen, onClose} = useModal();
    const {isOpen: isOOpen, onOpen: onOOpen, onClose: onOClose} = useModal();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();
    const [serviceRequestsList, isLoading] = useSelector((state: RootState) => [
        state.serviceRequests.assignedList,
        state.serviceRequests.assignedLoading
    ]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [editedItem, setEditedItem] = useState<IAssignedServiceRequest|undefined>(undefined);
    const {askConfirm} = useConfirm();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadAssignedServiceRequests(selectedSC.id));
        }
    }, [selectedSC, dispatch]);
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
    const askRemove = () => {
        setAnchorEl(null);
        askConfirm({
            title: "Remove Service Request?",
            content: `Remove ${editedItem?.serviceRequest.code} from selected?`,
            onConfirm: handleRemove
        });
    }
    const handleRemove = async () => {
        if (selectedSC && editedItem) {
            try {
                await Api.call(
                    Api.endpoints.ServiceRequests.RemoveOverride,
                    {urlParams: {id: editedItem.id}}
                )
                setEditedItem(undefined);
                dispatch(loadAssignedServiceRequests(selectedSC.id));
                showMessage("Service request removed.")
            } catch (e) {
                showError(e);
            }
        } else {
            showError(SC_UNDEFINED);
        }
    }

    return <>
        <TitleContainer
            title="Service Requests"
            pad
            parent={optimizerRoot}
            actions={
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleAddOpsCode}
                >
                    Add Ops Code
                </Button>
            }
        />
        <Table<IAssignedServiceRequest>
            data={serviceRequestsList}
            index="id"
            rowData={tableRow}
            actions={actions}
            isLoading={isLoading}
        />
        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleCloseMenu}>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={askRemove}>Remove</MenuItem>
        </Menu>
        <OPsCodesListDialog open={isOpen} onClose={onClose} />
        <OverrideOPsCodeDialog open={isOOpen} onClose={onOClose} payload={editedItem} />
    </>;
}