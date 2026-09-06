import React from 'react';
import { useStyles } from './styles';
import CustomerSearchTableView from './CustomerSearchTableView';
import { TCustomerSearchTableProps } from './types';
import useCustomerSearchTableController from './useCustomerSearchTableController';

const CustomerSearchTable: React.FC<TCustomerSearchTableProps> = props => {
  const { classes } = useStyles();
  const controller = useCustomerSearchTableController(props);

  return (
    <CustomerSearchTableView
      classes={classes}
      isLoading={controller.isLoading}
      selectedColumns={controller.selectedColumns}
      orderedColumns={controller.orderedColumns}
      offset={controller.offset}
      sorting={controller.sorting}
      data={controller.data}
      currentFirstItemIndex={controller.currentFirstItemIndex}
      currentLastItemIndex={controller.currentLastItemIndex}
      isEdit={controller.isEdit}
      isNewVehicleMode={controller.isNewVehicleMode}
      editingElement={controller.editingElement}
      pagingNumberOfRecords={controller.pagingNumberOfRecords}
      pageIndex={controller.pageData.pageIndex}
      pageSize={controller.pageData.pageSize}
      hashIdForSelectedAppointment={controller.hashIdForSelectedAppointment}
      loadedAppointmentsByCar={controller.loadedAppointmentsByCar}
      selectedAppointmentForCancelOrEdit={controller.selectedAppointmentForCancelOrEdit}
      isEditAppointment={controller.isEditAppointment}
      isOpenHistory={controller.isOpenHistory}
      isOpenConfirm={controller.isOpenConfirm}
      isOpenAppointmentSelection={controller.isOpenAppointmentSelection}
      loadData={controller.loadData}
      onSort={controller.onSort}
      getIsEdit={controller.getIsEdit}
      onCloseHistory={controller.onCloseHistory}
      resetSelectedAppointmentData={controller.resetSelectedAppointmentData}
      onCloseConfirm={controller.onCloseConfirm}
      handleCancelAppointment={controller.handleCancelAppointment}
      handleUpdateAppointment={controller.handleUpdateAppointment}
      onCloseAppointmentSelection={controller.onCloseAppointmentSelection}
      handleChangePage={controller.handleChangePage}
      handleChangeRows={controller.handleChangeRows}
      rowActionHandlers={{
        onSelectCustomerForNewVehicle: controller.onSelectCustomerForNewVehicle,
        onCreateNewForCar: controller.onCreateNewForCar,
        onUpdateAppForCar: controller.onUpdateAppForCar,
        onCancelAppointment: controller.onCancelAppointment,
        onViewRepairHistory: controller.onViewRepairHistory,
        onEditData: controller.onEditData,
        onCancelEditing: controller.onCancelEditing,
        onSaveInfo: controller.onSaveInfo,
      }}
      editingHandlers={{
        onFieldChange: controller.onFieldChange,
        onAddressChange: controller.onAddressChange,
      }}
    />
  );
};

export default CustomerSearchTable;
