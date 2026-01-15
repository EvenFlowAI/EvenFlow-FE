import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { DialogProps } from '../../BaseModal/types';
import { IAssignedServiceRequest } from '../../../../store/reducers/serviceRequests/types';
import { RootState } from '../../../../store/rootReducer';
import { Table } from '../../../tables/Table/Table';
import { BaseModal, DialogActions, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { SearchInput } from '../../../formControls/SearchInput/SearchInput';
import {
  loadAssignedServiceRequests,
  setAssignedFilter,
  setAssignedPageData,
} from '../../../../store/reducers/serviceRequests/actions';

import Checkbox from '../../../formControls/Checkbox/Checkbox';
import { useStyles } from './styles';
import { TableRowDataType } from '../../../../types/types';
import { usePagination } from '../../../../hooks/usePaginations/usePaginations';
import { useSCs } from '../../../../hooks/useSCs/useSCs';

type TAssignOpsCodeModalProps = DialogProps & {
  selectedCodes: IAssignedServiceRequest[];
  handleSave?: () => void;
  isEligible?: boolean;
  handleSelect: (el: IAssignedServiceRequest) => void;
  disabledIds?: number[];
};

const tableData: TableRowDataType<IAssignedServiceRequest>[] = [
  { header: 'OP CODE', val: el => el.serviceRequest.code, align: 'left' },
  {
    header: 'DESCRIPTION',
    val: el => el.serviceRequest.description ?? el.serviceRequestOverride?.description,
    align: 'left',
  },
  {
    header: 'PARTS UNIT COST',
    val: el => `$${el.serviceRequestOverride?.partsUnitCost || el.serviceRequest.partsUnitCost}`,
    align: 'left',
  },
  {
    header: '# OF PARTS',
    val: el => `${el.serviceRequestOverride?.numberOfParts || el.serviceRequest.numberOfParts}`,
    align: 'left',
  },
  {
    header: 'PARTS AMOUNT',
    val: el => `$${el.serviceRequestOverride?.partsAmount || 0}`,
    align: 'left',
  },
  {
    header: 'INVOICE AMOUNT',
    val: el => `$${el.serviceRequestOverride?.invoiceAmount || el.serviceRequest.invoiceAmount}`,
    align: 'left',
  },
];

const AddOpsCodeModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TAssignOpsCodeModalProps>>
> = ({ handleSelect, isEligible, disabledIds, handleSave, selectedCodes, ...props }) => {
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const {
    assignedList,
    assignedLoading,
    assignedPageData,
    assignedPaging: { numberOfRecords },
    assignedFilter: { searchTerm },
  } = useSelector((state: RootState) => state.serviceRequests);

  const { changeRowsPerPage, changePage, pageIndex, pageSize } = usePagination(
    (s: RootState) => s.serviceRequests.assignedPageData,
    setAssignedPageData
  );

  useEffect(() => {
    if (props.open && selectedSC) {
      dispatch(loadAssignedServiceRequests(selectedSC.id, isEligible));
    }
  }, [props.open, dispatch, selectedSC, pageSize, pageIndex]);

  const handleClose = useCallback((): void => {
    dispatch(setAssignedFilter({ searchTerm: '' }));
    props.onClose();
  }, [props.onClose, dispatch]);

  const handleSaveOpsCode = useCallback(() => {
    if (handleSave) handleSave();
    handleClose();
  }, [selectedCodes]);

  const preActions = useCallback(
    (el: IAssignedServiceRequest) => {
      const checked = !!selectedCodes.find(item => item.id === el.id);
      return (
        <Checkbox
          color="primary"
          disabled={disabledIds?.includes(el.id)}
          checked={checked}
          onChange={() => handleSelect(el)}
        />
      );
    },
    [selectedCodes, handleSelect, disabledIds]
  );

  const handleSearch = useCallback(async () => {
    if (selectedSC) {
      changePage(null, 0);
      await dispatch(setAssignedPageData({ pageIndex: 0 }));
      await dispatch(loadAssignedServiceRequests(selectedSC.id, isEligible));
    }
  }, [dispatch, selectedSC]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setAssignedFilter({ searchTerm: e.target.value }));
    },
    [dispatch]
  );

  return (
    <BaseModal {...props} width={1150} onClose={handleClose}>
      <DialogTitle onClose={handleClose}>Add Op Codes</DialogTitle>
      <DialogContent>
        <div className={classes.wrapper}>
          <SearchInput onSearch={handleSearch} onChange={handleSearchChange} value={searchTerm} />
        </div>
        <Table<IAssignedServiceRequest>
          data={assignedList}
          index="id"
          smallHeaderFont
          startActions={preActions}
          hidePagination={numberOfRecords <= assignedPageData.pageSize}
          compact
          rowData={tableData}
          isLoading={assignedLoading}
          page={pageIndex}
          rowsPerPage={pageSize}
          onChangePage={changePage}
          onChangeRowsPerPage={changeRowsPerPage}
          count={numberOfRecords}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="info">
          Close
        </Button>
        {handleSave && (
          <Button onClick={handleSaveOpsCode} color="primary" variant="contained">
            Save
          </Button>
        )}
      </DialogActions>
    </BaseModal>
  );
};

export default AddOpsCodeModal;
