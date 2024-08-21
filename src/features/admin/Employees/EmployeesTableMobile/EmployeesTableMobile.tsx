import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {IEmployee} from "../../../../store/reducers/employees/types";
import {Drawer, IconButton, TablePagination} from "@mui/material";
import {ReactComponent as Close} from "../../../../assets/img/close_grey.svg";
import {IOrder, TCallback} from "../../../../types/types";
import {ReactComponent as ArrowDownGrey} from '../../../../assets/img/arrow_down_grey.svg'
import {
    changePageData,
    loadByFilters,
    removeEmployee,
    setEmplOrder,
    setEmployeeFilters
} from "../../../../store/reducers/employees/actions";
import {RootState} from "../../../../store/rootReducer";
import {useDispatch, useSelector} from "react-redux";
import {useConfirm} from "../../../../hooks/useConfirm/useConfirm";
import {usePagination} from "../../../../hooks/usePaginations/usePaginations";
import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useModal} from "../../../../hooks/useModal/useModal";
import ResendEmailModal from "../ResendEmailModal/ResendEmailModal";
import {
    Menu,
    MenuItem,
    TitleRow,
    useStyles
} from "./styles";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {defaultRowsPerPageOptions} from "../../../../config/config";
import EmployeeTableRow from "./EmployeeTableRow/EmployeeTableRow";

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
    const [expandedItem, setExpandedItem] = useState<IEmployee|null>(null)
    const {selectedSC} = useSCs();
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

    const onCloseDrawer = () => {
        setAnchorEl(null)
    }

    return (
        <>
            {loading
                ? <Loading/>
                : <>
                    <div style={{marginBottom: 24}}>
                        <TitleRow>
                            <div style={{color: order.orderBy ? "#252733" : "#858585"}}>
                                <div>Name</div>
                                <ArrowDownGrey
                                    className={!order.orderBy ? classes.disabledIcon : ''}
                                    onClick={handleOrder({orderBy: "name", isAscending: !order.isAscending})}
                                    style={!order.isAscending
                                        ? {transform: 'rotate(180deg)', transition: '0.6s ease'}
                                        : {transform: 'rotate(360deg)', transition: '0.6s ease'}}
                                />
                            </div>
                            <div>Service Center</div>
                        </TitleRow>
                        {employeesList.map((item, idx) => {
                            const isOpened = item.id === expandedItem?.id;
                            return <EmployeeTableRow
                                isOpened={isOpened}
                                item={item}
                                idx={idx}
                                expandedItem={expandedItem}
                                setEditedItem={setEditedItem}
                                setExpandedItem={setExpandedItem}
                                setAnchorEl={setAnchorEl}/>
                        })}
                    </div>
                    <TablePagination
                        component="div"
                        count={numberOfRecords}
                        page={pageIndex}
                        onPageChange={changePage}
                        className={classes.pagination}
                        onRowsPerPageChange={changeRowsPerPage}
                        rowsPerPage={pageSize}
                        hidden={numberOfRecords < pageSize}
                        rowsPerPageOptions={defaultRowsPerPageOptions}/>
                </>}
            <Drawer anchor="bottom" open={Boolean(anchorEl)} variant="persistent" classes={{paper: classes.drawer}}>
                <Menu>
                    <MenuItem>
                        <MenuItem onClick={editEmployee}>Edit</MenuItem>
                        <MenuItem onClick={onDeleteEmployee}>Remove</MenuItem>
                        <MenuItem
                            onClick={onOpenResend}
                            style={editedItem?.emailConfirmed ? {} : {color: "#858585"}}>
                            Resend
                        </MenuItem>
                    </MenuItem>
                    <div>
                        <IconButton
                            onClick={onCloseDrawer}
                            style={{padding: 0}}
                            size="small">
                            <Close />
                        </IconButton>
                    </div>
                </Menu>
            </Drawer>
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