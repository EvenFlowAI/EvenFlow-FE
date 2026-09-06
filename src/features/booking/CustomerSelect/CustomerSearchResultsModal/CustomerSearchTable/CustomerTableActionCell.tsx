import React from 'react';
import { Button, IconButton, TableCell } from '@mui/material';
import { ReactComponent as CancelApp } from '../../../../../assets/img/cancel_appointment.svg';
import { ReactComponent as CancelAppDisabled } from '../../../../../assets/img/Disabled-Cancel-appointment.svg';
import { ReactComponent as Create } from '../../../../../assets/img/create_appointment.svg';
import { ReactComponent as Edit } from '../../../../../assets/img/editIcon.svg';
import { ReactComponent as EditDisabled } from '../../../../../assets/img/Manage appointment_dis.svg';
import { ReactComponent as Search } from '../../../../../assets/img/repair_history.svg';
import { ReactComponent as SearchDisabled } from '../../../../../assets/img/searchInfoIconDisabled.svg';
import { ReactComponent as Update } from '../../../../../assets/img/Manage appointment.svg';
import { ICustomerWithPhones } from '../../../../../store/reducers/enhancedCustomerSearch/types';
import { HtmlTooltip, IconsBlock } from './styles';
import { TRowActionHandlers } from './types';

type TProps = {
  customer: ICustomerWithPhones;
  isNewVehicleMode: boolean;
  isEditRow: boolean;
  stickyClassName: string;
  handlers: TRowActionHandlers;
};

const iconButtonStyle = { padding: '9px 3px' };

const CustomerTableActionCell: React.FC<TProps> = ({
  customer,
  isNewVehicleMode,
  isEditRow,
  stickyClassName,
  handlers,
}) => {
  if (isNewVehicleMode) {
    return (
      <TableCell key="icon" className={stickyClassName} width={124}>
        <IconsBlock>
          <Button
            onClick={handlers.onSelectCustomerForNewVehicle(customer)}
            color="primary"
            variant="text"
            size="small"
          >
            SELECT
          </Button>
        </IconsBlock>
      </TableCell>
    );
  }

  if (isEditRow) {
    return (
      <TableCell key="icon" className={stickyClassName} width={124}>
        <IconsBlock>
          <Button
            style={{ fontSize: 11, minWidth: 46 }}
            onClick={handlers.onCancelEditing}
            color="secondary"
            variant="text"
            size="small"
          >
            Cancel
          </Button>
          <Button
            onClick={handlers.onSaveInfo}
            style={{ fontSize: 11, minWidth: 46 }}
            color="primary"
            variant="text"
            size="small"
          >
            Save
          </Button>
        </IconsBlock>
      </TableCell>
    );
  }

  return (
    <TableCell key="icon" className={stickyClassName} width={124}>
      <IconsBlock>
        <HtmlTooltip title="Create Appointment">
          <IconButton
            disabled={!customer.vehicleId}
            onClick={() => handlers.onCreateNewForCar(customer)}
            size="small"
            style={iconButtonStyle}
          >
            <Create />
          </IconButton>
        </HtmlTooltip>
        <HtmlTooltip title="Update Appointment">
          <div>
            <IconButton
              disabled={!customer.hasPlannedAppointment}
              onClick={() => handlers.onUpdateAppForCar(customer)}
              size="small"
              style={iconButtonStyle}
            >
              {customer.hasPlannedAppointment ? <Update /> : <EditDisabled />}
            </IconButton>
          </div>
        </HtmlTooltip>
        <HtmlTooltip title="Cancel appointment">
          <div>
            <IconButton
              disabled={!customer.hasPlannedAppointment}
              onClick={() => handlers.onCancelAppointment(customer)}
              size="small"
              style={iconButtonStyle}
            >
              {customer.hasPlannedAppointment ? <CancelApp /> : <CancelAppDisabled />}
            </IconButton>
          </div>
        </HtmlTooltip>
        <HtmlTooltip title="Repair history">
          <div>
            <IconButton
              disabled={!customer.hasOrders}
              onClick={() => handlers.onViewRepairHistory(customer)}
              size="small"
              style={iconButtonStyle}
            >
              {customer.hasOrders ? <Search /> : <SearchDisabled />}
            </IconButton>
          </div>
        </HtmlTooltip>
        <HtmlTooltip title="Edit customer Information">
          <div>
            <IconButton
              onClick={() => handlers.onEditData(customer)}
              size="small"
              style={iconButtonStyle}
            >
              <Edit />
            </IconButton>
          </div>
        </HtmlTooltip>
      </IconsBlock>
    </TableCell>
  );
};

export default CustomerTableActionCell;
