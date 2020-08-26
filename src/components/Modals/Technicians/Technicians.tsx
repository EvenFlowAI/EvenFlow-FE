import React from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogTitle} from "../BaseModal";
import {Button, IconButton} from "@material-ui/core";
import {Table} from "../../UI/Table";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {IEmployee} from "../../../store/reducers/employees/types";
import {TableRowDataType} from "../../UI/types";
import {loadTechnicians} from "../../../store/reducers/employees/actions";
import {MoreHoriz} from "@material-ui/icons";
import {TableAvatar} from "../../Admin/TableAvatar";


const rowData: TableRowDataType<IEmployee>[] = [
    {header: "Technician Name", val: v => v.fullName},
    {header: "Level", val: v => v.employeeInfo?.skillLevel.toString() || '-'},
    {header: "Hourly Rate", val: v => `$${v.employeeInfo?.hourlyRate || 0}`},
    {header: "Overtime Rate", val: v => `$${v.employeeInfo?.overtimeRate || 0}`}
]

export const Technicians: React.FC<DialogProps> = props => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(loadTechnicians());
    }, [dispatch]);
    const {techniciansList, loadingTechnicians} = useSelector((state: RootState) => state.employees);

    const actions = (u: IEmployee) => {
        return <IconButton>
            <MoreHoriz />
        </IconButton>
    }
    const startActions = (el: IEmployee) => (
        <TableAvatar name={el.fullName} />
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

        <DialogActions>
            <Button variant="contained" color="primary" onClick={props.onClose}>Close</Button>
        </DialogActions>
    </BaseModal>
}