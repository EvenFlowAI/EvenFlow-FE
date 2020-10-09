import React, {useState} from "react";
import {Table} from "../../UI/Table";
import {IEmployee} from "../../../store/reducers/employees/types";
import {IconButton, Menu, MenuItem} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {useConfirm, useException, useMessage, useModal, useSCs} from "../../../utils/hooks";
import {loadTechnicians, removeEmployee} from "../../../store/reducers/employees/actions";
import {RootState} from "../../../store/rootReducer";
import {MoreHoriz} from "@material-ui/icons";
import {TableAvatar} from "../../Admin/TableAvatar";
import {CreateEmployee} from "../../Modals/CreateEmployee/CreateEmployee";
import {TableRowDataType} from "../../UI/types";

const rowData: TableRowDataType<IEmployee>[] = [
    {header: "Technician Name", val: v => v.fullName},
    {header: "Level", val: v => v.employeeInfo?.skillLevel.toString() || '-', align: "center"},
    {header: "Hourly Rate", val: v => `$${v.employeeInfo?.hourlyRate || 0}`, align: "right"},
    {header: "Overtime Rate", val: v => `$${v.employeeInfo?.overtimeRate || 0}`, align: "right"}
]

export const TechniciansList = () => {
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [edit, setEdit] = useState<IEmployee|undefined>();
    const {isOpen, onClose, onOpen} = useModal();
    const showMessage = useMessage();
    const showError = useException();
    const {askConfirm, closeConfirm} = useConfirm();

    React.useEffect(() => {
        if (selectedSC) {
            dispatch(loadTechnicians(selectedSC.id));
        }
    }, [dispatch, selectedSC]);
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
    const askRemove = () => {
        setAnchorEl(null);
        if (edit) {
            askConfirm({
                isRemove: true,
                title: `Remove ${edit.fullName}?`,
                onConfirm: handleRemove
            })
        }
    }
    const handleRemove = async () => {
        if (!edit) {
            closeConfirm();
        } else {
            try {
                await dispatch(removeEmployee(edit.id));
                showMessage(`${edit.fullName} removed.`);
                setEdit(undefined);
                if (selectedSC) {
                    dispatch(loadTechnicians(selectedSC.id));
                }
            } catch (e) {
                showError(e);
            }
        }
    }

    const actions = (u: IEmployee) => {
        return <IconButton onClick={openMenu(u)}>
            <MoreHoriz />
        </IconButton>
    }
    const startActions = (el: IEmployee) => (
        <TableAvatar name={el.fullName} src={el.avatarPath} />
    )

    return <>
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
            <MenuItem onClick={askRemove}>Remove</MenuItem>
        </Menu>
        <CreateEmployee open={isOpen} onAction={reloadTechnicians} onClose={onClose} payload={edit} />
    </>
}