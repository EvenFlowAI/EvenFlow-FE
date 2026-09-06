import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';
import VehicleRepairHistory from '../../../../../components/modals/common/VehicleRepairHistory/VehicleRepairHistory';
import AppointmentSelectionModal from '../../AppointmentSelectionModal/AppointmentSelectionModal';
import CancelAppointmentModal from '../../CancelAppoitntmentModal/CancelAppointmentModal';
import { getTableColumnWidth } from './helpers';
import CustomerTableActionCell from './CustomerTableActionCell';
import CustomerTableDataCells from './CustomerTableDataCells';
import { TTableViewProps } from './types';

const FIXED_COLUMNS_WIDTH = 424;
const MIN_TABLE_WIDTH = 1550;

const CustomerSearchTableView: React.FC<TTableViewProps> = ({
  classes,
  isLoading,
  selectedColumns,
  orderedColumns,
  offset,
  sorting,
  data,
  currentFirstItemIndex,
  currentLastItemIndex,
  isEdit,
  isNewVehicleMode,
  editingElement,
  pagingNumberOfRecords,
  pageIndex,
  pageSize,
  hashIdForSelectedAppointment,
  loadedAppointmentsByCar,
  selectedAppointmentForCancelOrEdit,
  isEditAppointment,
  isOpenHistory,
  isOpenConfirm,
  isOpenAppointmentSelection,
  loadData,
  onSort,
  getIsEdit,
  onCloseHistory,
  resetSelectedAppointmentData,
  onCloseConfirm,
  handleCancelAppointment,
  handleUpdateAppointment,
  onCloseAppointmentSelection,
  handleChangePage,
  handleChangeRows,
  rowActionHandlers,
  editingHandlers,
}) => {
  if (isLoading) {
    return (
      <div className={classes.emptyWrapper}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={classes.tableWrapper}>
      <div className={classes.tableContainer}>
        <div className={classes.tableContent}>
          <Table
            className={classes.wrapper}
            style={{
              tableLayout: 'fixed',
              width: Math.max(
                MIN_TABLE_WIDTH,
                FIXED_COLUMNS_WIDTH +
                  (selectedColumns.length > 2 ? (selectedColumns.length - 2) * 150 : 0)
              ),
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell className={classes.stickyTHeadCell} key="emptyCell" width={124} />
                {orderedColumns.map(({ name, order }, index) => {
                  const isLastName = name === 'Last Name';
                  const isFirstName = name === 'First Name';

                  return (
                    <TableCell
                      key={name}
                      className={
                        isLastName || isFirstName ? classes.stickyTHeadCell : classes.headerCell
                      }
                      style={{
                        left: isLastName
                          ? offset.secondColumn
                          : isFirstName
                            ? offset.thirdColumn
                            : 'unset',
                      }}
                      width={getTableColumnWidth(name, index)}
                    >
                      {order ? (
                        <TableSortLabel
                          direction={sorting.isAscending ? 'desc' : 'asc'}
                          onClick={() => onSort(order)}
                          active={order === sorting.order}
                        >
                          {name}
                        </TableSortLabel>
                      ) : (
                        name
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(currentFirstItemIndex, currentLastItemIndex).map((customer, index) => {
                const isEditRow = getIsEdit(customer);

                return (
                  <TableRow key={customer.vin + index}>
                    <CustomerTableActionCell
                      customer={customer}
                      isNewVehicleMode={isNewVehicleMode}
                      isEditRow={isEditRow}
                      stickyClassName={classes.stickyLeftCell}
                      handlers={rowActionHandlers}
                    />
                    <CustomerTableDataCells
                      orderedColumns={orderedColumns}
                      customer={customer}
                      editingElement={editingElement}
                      isEdit={isEdit}
                      isEditRow={isEditRow}
                      offset={offset}
                      bodyCellClassName={classes.bodyCell}
                      stickyCellClassName={classes.stickyLeftCell}
                      onFieldChange={editingHandlers.onFieldChange}
                      onAddressChange={editingHandlers.onAddressChange}
                    />
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {editingElement ? (
        <VehicleRepairHistory
          customerId={editingElement.customerId}
          open={isOpenHistory}
          onClose={onCloseHistory}
          vehicleId={editingElement.vehicleId}
        />
      ) : null}

      {hashIdForSelectedAppointment ? (
        <CancelAppointmentModal
          open={isOpenConfirm}
          resetSelectedAppointmentData={resetSelectedAppointmentData}
          onClose={onCloseConfirm}
          loadData={loadData}
          hashKey={hashIdForSelectedAppointment}
        />
      ) : null}

      {loadedAppointmentsByCar.length ? (
        <AppointmentSelectionModal
          open={isOpenAppointmentSelection}
          isEditAppointment={isEditAppointment}
          selectedAppointmentForCancelOrEdit={selectedAppointmentForCancelOrEdit}
          handleCancelAppointment={handleCancelAppointment}
          handleUpdateAppointment={handleUpdateAppointment}
          onClose={onCloseAppointmentSelection}
          appointments={loadedAppointmentsByCar}
        />
      ) : null}

      {pagingNumberOfRecords && pagingNumberOfRecords > 10 ? (
        <TablePagination
          className={classes.pagination}
          component="div"
          count={pagingNumberOfRecords}
          page={pageIndex}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRows}
          rowsPerPage={pageSize}
        />
      ) : null}
    </div>
  );
};

export default CustomerSearchTableView;
