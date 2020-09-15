import React, {useEffect, useRef, useState} from "react";
import {Table} from "../../UI/Table";
import {IAssignedServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {TableRowDataType} from "../../UI/types";
import {CheckCircle, MoreHoriz} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useModal, usePagination, useSCs} from "../../../utils/hooks";
import {
    loadAssignedServiceRequests,
    setAssignedFilter,
    setAssignedPageData
} from "../../../store/reducers/serviceRequests/actions";
import {IconButton, Menu, MenuItem} from "@material-ui/core";
import {RequiredSkillsDialog} from "../../Modals/RequiredSkillsDialog/RequiredSkillsDialog";

const Checked: React.FC<{ val?: boolean }> = ({val}) => {
    return val ? <CheckCircle color="primary" /> : <span>-</span>;
}

const rowData: TableRowDataType<IAssignedServiceRequest>[] = [
    {
        header: "Service Request",
        val: el => <span>
            {el.serviceRequest.code}<br />
            <small>
                {el.serviceRequestOverride?.description
                || el.serviceRequest.description}
            </small>
        </span>
    },
    {
        header: "Technician Level 1",
        val: el => <Checked val={el.requiredSkill?.technicianLevel1} />,
        align: "center"
    },
    {
        header: "Technician Level 2",
        val: el => <Checked val={el.requiredSkill?.technicianLevel2} />,
        align: "center"
    },
    {
        header: "Technician Level 3",
        val: el => <Checked val={el.requiredSkill?.technicianLevel3} />,
        align: "center"
    },
]

export const RequiredSkills = () => {
    const [data, loading, count] = useSelector((state: RootState) => [
        state.serviceRequests.assignedList,
        state.serviceRequests.assignedLoading,
        state.serviceRequests.assignedPaging.numberOfRecords
    ]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [editedItem, setEditedItem] = useState<IAssignedServiceRequest|undefined>();
    const {pageSize, pageIndex, changeRowsPerPage, changePage} = usePagination(
        (state: RootState) => state.serviceRequests.assignedPageData,
        setAssignedPageData
    )
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const {onOpen, onClose, isOpen} = useModal();
    const initial = useRef(true);

    useEffect(() => {
        if (initial.current) {
            // Clear search input
            // TODO: Possibly go through other list
            dispatch(setAssignedFilter({searchTerm: ""}));
        }
    }, [dispatch]);
    useEffect(() => {
        if (selectedSC) {
            dispatch(loadAssignedServiceRequests(selectedSC.id));
        }
    }, [dispatch, selectedSC, pageSize, pageIndex]);

    useEffect(() => {
        initial.current = false;
    }, []);

    const openMenu = (el: IAssignedServiceRequest) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setAnchorEl(e.currentTarget);
        setEditedItem(el);
    }
    const closeMenu = () => {
        setAnchorEl(null);
        setEditedItem(undefined);
    }
    const actions = (el: IAssignedServiceRequest) => {
        return <IconButton onClick={openMenu(el)}><MoreHoriz /></IconButton>
    }

    const openEdit = () => {
        if (editedItem) {
            onOpen();
        }
        setAnchorEl(null);
    }

    return <div>
        <Table<IAssignedServiceRequest>
            rowData={rowData}
            data={data}
            isLoading={loading}
            index="id"
            compact
            count={count}
            page={pageIndex}
            actions={actions}
            rowsPerPage={pageSize}
            onChangePage={changePage}
            onChangeRowsPerPage={changeRowsPerPage}
        />
        <Menu open={Boolean(anchorEl)} onClose={closeMenu} anchorEl={anchorEl}>
            <MenuItem onClick={openEdit}>Edit</MenuItem>
        </Menu>
        <RequiredSkillsDialog
            payload={editedItem}
            open={isOpen}
            onClose={onClose}
        />
    </div>
}