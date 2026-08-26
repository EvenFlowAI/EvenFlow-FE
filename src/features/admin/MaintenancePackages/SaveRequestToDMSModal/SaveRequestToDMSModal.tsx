import React, { useEffect, useState, Dispatch, SetStateAction, useCallback } from 'react';
import {
  BaseModal,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import {
  IPackageById,
  IPackageOptionDetailed,
  TExtendedService,
  TIntervalUpsellForPackage,
} from '../../../../api/types';
import { TableContainer, Table, Button } from '@mui/material';
import { useTableStyles } from './styles';
import { SaveRequestTableSection } from './SaveRequestTableSection';

type TSaveRequestModalProps = DialogProps & {
  packageData: IPackageById | null;
  setPackageData: Dispatch<SetStateAction<IPackageById | null>>;
  onSave: (packageData: IPackageById) => void;
};

const SaveRequestToDMSModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TSaveRequestModalProps>>
> = ({ packageData, setPackageData, onSave, ...props }) => {
  const [newRequests, setNewRequests] = useState<TExtendedService[]>([]);
  const [newUpsellRequests, setNewUpsellRequests] = useState<TIntervalUpsellForPackage[]>([]);
  const [temporaryData, setTemporaryData] = useState<IPackageById | null>(null);
  const { classes } = useTableStyles();

  useEffect(() => {
    setTemporaryData(packageData);
  }, [packageData]);

  useEffect(() => {
    setNewRequests(prev => (temporaryData ? temporaryData.serviceRequests : prev));
    setNewUpsellRequests(prev =>
      temporaryData?.intervalUpsells ? temporaryData.intervalUpsells : prev
    );
  }, [temporaryData]);

  const getCellClass = useCallback(
    (cellIndex: number, rowIndex: number) => {
      if (cellIndex === 0) {
        if (newRequests.length === 1) return classes.firstCellLastRow;
        switch (rowIndex) {
          case 0:
            return classes.firstCellFirstRow;
          case newRequests.length - 1:
            return classes.firstCellLastRow;
          default:
            return classes.firstCell;
        }
      } else if (cellIndex === 2) {
        if (newRequests.length === 1) return classes.lastCellLastRow;
        switch (rowIndex) {
          case 0:
            return classes.lastCellFirstRow;
          case newRequests.length - 1:
            return classes.lastCellLastRow;
          default:
            return classes.lastCell;
        }
      }

      if (newRequests.length === 1) return classes.cellLastRow;
      switch (rowIndex) {
        case 0:
          return classes.cellFirstRow;
        case newRequests.length - 1:
          return classes.cellLastRow;
        default:
          return classes.cell;
      }
    },
    [newRequests, classes]
  );

  const onCheckboxClick = useCallback((option: IPackageOptionDetailed, requestId: number): void => {
    setTemporaryData(prev => {
      if (!prev) {
        return prev;
      }

      const optionToUpdate = prev.options.find(item => item.type === option.type);
      if (!optionToUpdate) {
        return prev;
      }

      const request = optionToUpdate.serviceRequests.find(
        item => item.serviceRequestId === requestId
      );
      if (!request) {
        return prev;
      }

      const updatedRequest = { ...request, isSendToDMS: !request.isSendToDMS };
      const updatedOption = {
        ...optionToUpdate,
        serviceRequests: optionToUpdate.serviceRequests
          .filter(item => item.serviceRequestId !== requestId)
          .concat(updatedRequest),
      };
      const newOptions = prev.options
        .filter(item => item.type !== updatedOption.type)
        .concat(updatedOption)
        .sort((a, b) => a.type - b.type);
      return { ...prev, options: newOptions };
    });
  }, []);

  const onUpsellCheckboxClick = useCallback(
    (option: IPackageOptionDetailed, requestId: number): void => {
      setTemporaryData(prev => {
        if (!prev) {
          return prev;
        }

        const optionToUpdate = prev.options.find(item => item.type === option.type);
        if (!optionToUpdate) {
          return prev;
        }

        const request = optionToUpdate.intervalUpsells.find(
          item => item.serviceRequestId === requestId
        );
        if (!request) {
          return prev;
        }

        const updatedRequest = { ...request, isSendToDMS: !request.isSendToDMS };
        const updatedOption = {
          ...optionToUpdate,
          intervalUpsells: optionToUpdate.intervalUpsells
            .filter(item => item.serviceRequestId !== requestId)
            .concat(updatedRequest),
        };
        const newOptions = prev.options
          .filter(item => item.type !== updatedOption.type)
          .concat(updatedOption)
          .sort((a, b) => a.type - b.type);
        return { ...prev, options: newOptions };
      });
    },
    []
  );

  const onCancel = () => {
    props.onClose();
  };

  const onSaveRequest = () => {
    if (temporaryData) {
      setPackageData(temporaryData);
      onSave(temporaryData);
    }
  };

  const sortedOptions = (temporaryData?.options ?? []).slice().sort((a, b) => a.type - b.type);

  return (
    <BaseModal {...props} style={{ minWidth: 1000 }}>
      <DialogTitle onClose={props.onClose}>Choose Op Codes to send to DMS</DialogTitle>
      <DialogContent>
        <div className={classes.wrapper}>
          <TableContainer>
            <Table>
              <SaveRequestTableSection
                title="Included in Package Service Requests"
                requests={newRequests}
                options={sortedOptions}
                classes={classes}
                getCellClass={getCellClass}
                onToggle={onCheckboxClick}
                getRequestState={(option, requestId) =>
                  option.serviceRequests.find(req => req.serviceRequestId === requestId)
                }
              />
              <SaveRequestTableSection
                title="Service Interval Upsells"
                requests={newUpsellRequests}
                options={sortedOptions}
                classes={classes}
                getCellClass={getCellClass}
                onToggle={onUpsellCheckboxClick}
                getRequestState={(option, requestId) =>
                  option.intervalUpsells.find(req => req.serviceRequestId === requestId)
                }
              />
            </Table>
          </TableContainer>
        </div>
        <div className={classes.buttonsWrapper}>
          <Button onClick={onCancel} className={classes.cancelButton}>
            Cancel
          </Button>
          <Button onClick={onSaveRequest} className={classes.saveButton}>
            save
          </Button>
        </div>
      </DialogContent>
    </BaseModal>
  );
};

export default SaveRequestToDMSModal;
