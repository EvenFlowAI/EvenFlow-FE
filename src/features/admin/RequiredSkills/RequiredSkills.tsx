import React, {useEffect, useRef, useState} from "react";
import {Table} from "../../../components/tables/Table/Table";
import {IAssignedServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {MoreHoriz} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    loadAssignedServiceRequests,
    setAssignedFilter,
    setAssignedPageData
} from "../../../store/reducers/serviceRequests/actions";
import {IconButton, Menu, MenuItem} from "@material-ui/core";
import {RequiredSkillsModal} from "./RequiredSkillsModal/RequiredSkillsModal";
import {CheckmarkCircle} from "../../../components/wrappers/ChekmarkCircle/ChekmarkCircle";
import {TableRowDataType} from "../../../types/types";
import {useModal} from "../../../hooks/useModal/useModal";
import {usePagination} from "../../../hooks/usePaginations/usePaginations";
import {useSCs} from "../../../hooks/useSCs/useSCs";

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
        val: el => <CheckmarkCircle val={el.requiredSkill?.technicianLevel1} />,
        align: "center"
    },
    {
        header: "Technician Level 2",
        val: el => <CheckmarkCircle val={el.requiredSkill?.technicianLevel2} />,
        align: "center"
    },
    {
        header: "Technician Level 3",
        val: el => <CheckmarkCircle val={el.requiredSkill?.technicianLevel3} />,
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
        <RequiredSkillsModal
            payload={editedItem}
            open={isOpen}
            onClose={onClose}
        />
    </div>
}