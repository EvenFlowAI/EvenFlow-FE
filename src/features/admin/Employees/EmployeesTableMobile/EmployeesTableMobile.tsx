import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {IEmployee} from "../../../../store/reducers/employees/types";
import {IconButton, Menu, MenuItem} from "@mui/material";
import {MoreHoriz, Visibility} from "@mui/icons-material";
import {IOrder, Roles, TableRowDataType, TCallback} from "../../../../types/types";
import {ReactComponent as ArrowDown} from '../../../../assets/img/dropdown_closed.svg'
import {
    changePageData,
    loadByFilters,
    removeEmployee,
    setEmplOrder,
    setEmployeeFilters
} from "../../../../store/reducers/employees/actions";
import {RootState} from "../../../../store/rootReducer";
import {useDispatch, useSelector} from "react-redux";
import {concatAddress} from "../../../../utils/utils";
import {useConfirm} from "../../../../hooks/useConfirm/useConfirm";
import {usePagination} from "../../../../hooks/usePaginations/usePaginations";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useCurrentUser} from "../../../../hooks/useCurrentUser/useCurrentUser";
import {useModal} from "../../../../hooks/useModal/useModal";
import ResendEmailModal from "../ResendEmailModal/ResendEmailModal";
import {useStyles} from "./styles";
import {Loading} from "../../../../components/wrappers/Loading/Loading";

// todo uncomment multiple centers fucntionality
// todo add multiple centers field to all requests

type TProps = {
    editedItem: IEmployee|undefined;
    setEditedItem: Dispatch<SetStateAction<IEmployee|undefined>>;
    onOpen: TCallback;
}

const EmployeesTableMobile:React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({editedItem, setEditedItem, onOpen}) => {
    const {
        employeesList,
        loading,
        paging: {numberOfRecords},
        order,
        searchTerm
    } = useSelector(({employees}: RootState) => employees);
    const [anchorEl, setAnchorEl] = useState<EventTarget&HTMLButtonElement|null>(null);
    const [openedItem, setOpenedItem] = useState<IEmployee|null>(null)
    const {selectedSC} = useSCs();
    const currentUser = useCurrentUser();
    const {classes} = useStyles();
    const {askConfirm} = useConfirm();
    const showError = useException();
    const showMessage = useMessage();
    const dispatch = useDispatch();
    const {onOpen: onOpenResend, onClose: onCloseResend, isOpen: isOpenResesnd} = useModal();

    const {changeRowsPerPage, changePage, pageIndex, pageSize} = usePagination(
        (s: RootState) => s.employees.pageData,
        changePageData
    );

    useEffect(() => {
        if (selectedSC) {
            dispatch(setEmployeeFilters({serviceCenterId: selectedSC.id}))
        }
    }, [selectedSC])

    useEffect(() => {
        selectedSC && dispatch(loadByFilters())
    }, [order, searchTerm, selectedSC])

    const handleMenuOpen = (item: IEmployee) => (e: React.MouseEvent<HTMLButtonElement>) => {
        setEditedItem(item);
        setAnchorEl(e.currentTarget);
    }
    const editEmployee = () => {
        onOpen();
        setAnchorEl(null);
    }
    const handleRemove = async () => {
        try {
            await dispatch(removeEmployee(editedItem?.id || ''))
            showMessage(`Employee removed`);
            setEditedItem(undefined);
        } catch (e) {
            showError(e);
        }
    }
    const onDeleteEmployee = () => {
        setAnchorEl(null);
        if (editedItem?.role === 'Owner') {
            showError("You cannot remove dealership account");
        } else {
            askConfirm({
                isRemove: true,
                title: `Please confirm you want to remove employee ${editedItem?.fullName}?`,
                onConfirm: handleRemove
            });
        }
    }

    const handleOrder = (order: IOrder<IEmployee>) => () => {
        dispatch(setEmplOrder(order));
    }

    const handleView = (el: IEmployee) => () => alert(`View ${el.fullName}`);

    const viewActions = (el: IEmployee) => (
        currentUser?.isSuperUser
            ? <IconButton size="small" onClick={handleView(el)} style={{padding: 0}}><Visibility /></IconButton>
            : <IconButton
                disabled={el.role === Roles.Owner || el.id === currentUser?.id}
                size="small"
                style={{padding: 0}}
                onClick={handleMenuOpen(el)}>
                <MoreHoriz />
            </IconButton>
    );

    const onOpenRow = (item: IEmployee) => () => {
        item.id === openedItem?.id
            ? setOpenedItem(null)
            : setOpenedItem(item)
    }

    return (
        <>
            {loading
                ? <Loading/>
                : <div>
                    {employeesList.map((item, idx) => {
                        const isOpened = item.id === openedItem?.id;
                        return <>
                            <div className={classes.row} style={{backgroundColor: idx % 2 === 0 ? '#FFFFFF' : "#F2F4FB"}}>
                                <div className={classes.cell}>{item.fullName}</div>
                                <div className={classes.cell}>{item.serviceCenter?.name}</div>
                                <div className={classes.btnsCell}>
                                    <div>{viewActions(item)}</div>
                                    <div>
                                        <IconButton
                                            style={{padding: 0}}
                                            onClick={onOpenRow(item)}>
                                            <ArrowDown style={
                                                isOpened ? {transform: 'rotate(180deg)', transition: '0.6s ease'}
                                                    : {transform: 'rotate(360deg)', transition: '0.6s ease'}}
                                            />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                            {isOpened
                                ? <div style={{backgroundColor: idx % 2 === 0 ? '#FFFFFF' : "#F2F4FB"}}>
                                    <div className={classes.subCellWrapper}>
                                        <div className={classes.subCell}>
                                            <div className={classes.subTitle}>Role</div>
                                            <div className={classes.subText}>{item.role}</div>
                                        </div>
                                        <div className={classes.subCell}>
                                            <div className={classes.subTitle}>DMS ID</div>
                                            <div className={classes.subText}>{item.dmsId ?? '-'}</div>
                                        </div>
                                    </div>
                                    <div className={classes.subCell}>
                                        <div className={classes.subTitle}>Email Address</div>
                                        <div className={classes.subText}>{item.email ?? '-'}</div>
                                    </div>
                                </div>
                                : null}
                        </>
                    })}
                </div>}
            <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={editEmployee}>Edit</MenuItem>
                <MenuItem onClick={onDeleteEmployee}>Remove</MenuItem>
                <MenuItem onClick={onOpenResend} disabled={editedItem?.emailConfirmed}>Resend</MenuItem>
            </Menu>
            <ResendEmailModal
                open={isOpenResesnd}
                onClose={onCloseResend}
                employeeEmail={editedItem?.email}
                employeeId={editedItem?.id}
                employeeName={editedItem?.fullName}/>
        </>
    );
};

export default EmployeesTableMobile;