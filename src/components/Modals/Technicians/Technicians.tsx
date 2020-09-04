import React, {useState} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogTitle} from "../BaseModal";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {Table} from "../../UI/Table";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {IEmployee} from "../../../store/reducers/employees/types";
import {TableRowDataType} from "../../UI/types";
import {loadTechnicians} from "../../../store/reducers/employees/actions";
import {MoreHoriz} from "@material-ui/icons";
import {TableAvatar} from "../../Admin/TableAvatar";
import {useModal, useSCs} from "../../../utils/hooks";
import {CreateEmployee} from "../CreateEmployee/CreateEmployee";

const rowData: TableRowDataType<IEmployee>[] = [
    {header: "Technician Name", val: v => v.fullName},
    {header: "Level", val: v => v.employeeInfo?.skillLevel.toString() || '-'},
    {header: "Hourly Rate", val: v => `$${v.employeeInfo?.hourlyRate || 0}`},
    {header: "Overtime Rate", val: v => `$${v.employeeInfo?.overtimeRate || 0}`}
]

export const Technicians: React.FC<DialogProps> = props => {
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [edit, setEdit] = useState<IEmployee|undefined>();
    const {isOpen, onClose, onOpen} = useModal();

    React.useEffect(() => {
        if (props.open && selectedSC) {
            dispatch(loadTechnicians(selectedSC.id));
        }
    }, [dispatch, props.open, selectedSC]);
    const {techniciansList, loadingTechnicians} = useSelector((state: RootState) => state.employees);

    const closeMenu = () => {
        setAnchorEl(null);
    }

    const reloadTechnicians = () => {
        if (selectedSC) {
            dispatch(loadTechnicians(selectedSC.id));
        }
    }
    const openMenu = (u: IEmployee) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEdit({...u, serviceCenterId: selectedSC?.id || 0, serviceCenter: selectedSC});
        setAnchorEl(e.currentTarget);
    }
    const openEdit = () => {
        closeMenu();
        onOpen();
    }

    const actions = (u: IEmployee) => {
        return <IconButton onClick={openMenu(u)}>
            <MoreHoriz />
        </IconButton>
    }
    const startActions = (el: IEmployee) => (
        <TableAvatar name={el.fullName} src={el.avatarPath} />
    )

    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>Technician Stuff</DialogTitle>
        <Table<IEmployee>
            compact
            startActions={startActions}
            actions={actions}
            hidePagination
            data={techniciansList}
            index={"id"}
            rowData={rowData}
            isLoading={loadingTechnicians} />

        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu}>
            <MenuItem onClick={openEdit}>Edit</MenuItem>
        </Menu>

        <DialogActions>
            <Button variant="contained" color="primary" onClick={props.onClose}>Close</Button>
        </DialogActions>
        <CreateEmployee open={isOpen} onAction={reloadTechnicians} onClose={onClose} payload={edit} />
    </BaseModal>
}