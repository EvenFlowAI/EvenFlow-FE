import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { Autocomplete, Button } from '@mui/material';
import { OPsCodesListDialog } from '../../../components/modals/admin/OPsCodesListDialog/OPsCodesListDialog';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import {
  assignServiceRequests,
  downloadAssignedServiceRequestsCSV,
  loadAssignedServiceRequests,
  setAssignedFilter,
  setAssignedPageData,
  setDefaultLaborTypes,
} from '../../../store/reducers/serviceRequests/actions';
import { IAssignedServiceRequest } from '../../../store/reducers/serviceRequests/types';
import { OverrideOPsCodeModal } from './OverrideOpsCodeModal/OverrideOPsCodeModal';
import { SearchInput } from '../../../components/formControls/SearchInput/SearchInput';
import { ServiceRequestsTable } from './ServiceRequestsTable/ServiceRequestsTable';
import { capacityManagementRoot } from '../../../utils/constants';
import { useModal } from '../../../hooks/useModal/useModal';
import { usePagination } from '../../../hooks/usePaginations/usePaginations';

import { useMessage } from '../../../hooks/useMessage/useMessage';
import { useException } from '../../../hooks/useException/useException';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { autocompleteRender } from '../../../utils/autocompleteRenders';
import {
  loadGeneralSettings,
  updateGeneralSettings,
} from '../../../store/reducers/generalSettings/actions';
import { ESettingType } from '../../../store/reducers/generalSettings/types';
import { SystemIntegrationType } from '../../../store/reducers/serviceCenters/types';
import { ReactComponent as DownloadIcon } from '../../../assets/img/download.svg';

export const ServiceRequests = () => {
  const {
    assignedPageData,
    assignedFilter: { searchTerm },
    assignedOrdering,
    laborType,
    defaultLaborTypesOptions,
  } = useSelector(({ serviceRequests }: RootState) => serviceRequests);

  const { settings } = useSelector(({ generalSettings }: RootState) => generalSettings);

  const [editedItem, setEditedItem] = useState<IAssignedServiceRequest | undefined>(undefined);
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const showError = useException();
  const showMessage = useMessage();
  const { isOpen, onOpen, onClose } = useModal();
  const { isOpen: isOOpen, onOpen: onOOpen, onClose: onOClose } = useModal();
  const { changeRowsPerPage, changePage, pageIndex, pageSize } = usePagination(
    (s: RootState) => s.serviceRequests.assignedPageData,
    setAssignedPageData
  );

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadAssignedServiceRequests(selectedSC.id));
    }
  }, [selectedSC, dispatch, assignedPageData, assignedOrdering]);

  useEffect(() => {
    return () => {
      dispatch(setAssignedFilter({ searchTerm: '' }));
    };
  }, []);

  useEffect(() => {
    if (selectedSC) {
      if (selectedSC?.integration === SystemIntegrationType.Fortellis) {
        dispatch(loadGeneralSettings(selectedSC.id, [ESettingType.DMS]));
        dispatch(setDefaultLaborTypes(selectedSC.id));
      }
    }
  }, [selectedSC]);

  const handleAddOpsCode = () => {
    setEditedItem(undefined);
    onOpen();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setAssignedFilter({ searchTerm: e.target.value }));
  };

  const handleSearch = useCallback(() => {
    if (selectedSC) {
      changePage(null, 0);
      dispatch(setAssignedPageData({ pageIndex: 0 }));
      dispatch(loadAssignedServiceRequests(selectedSC.id));
    }
  }, [selectedSC, dispatch]);

  const onSuccessAssign = useCallback((selectedCodes: number[]) => {
    showMessage(
      `${selectedCodes.length} ${selectedCodes.length > 1 ? 'Op Codes' : 'Op Code'} added`
    );
  }, []);

  const onRequestAssign = useCallback(
    (selectedCodes: number[], serviceCenterId: number) => {
      dispatch(assignServiceRequests(selectedCodes, serviceCenterId, showError, onSuccessAssign));
    },
    [dispatch, showError, onSuccessAssign]
  );

  const onSuccess = () => {
    showMessage('Default Labor Type updated successfully.');
  };

  const onError = (e: string) => {
    showError(e);
  };

  const handleLaborTypeChange = (_e: SyntheticEvent, value: string | null) => {
    if (value && selectedSC) {
      const updatedSettings = settings.map((s, idx) =>
        idx === 0
          ? {
              ...s,
              data: {
                ...s.data,
                laborType: value,
              },
            }
          : s
      );

      dispatch(updateGeneralSettings(selectedSC?.id, null, updatedSettings, onError, onSuccess));
    }
  };

  const handleDownloadCSV = () => {
    if (!selectedSC) {
      showError('No service center selected');
      return;
    }

    dispatch(downloadAssignedServiceRequestsCSV(selectedSC.id, onError));
  };

  return (
    <>
      <TitleContainer
        pad
        parent={capacityManagementRoot}
        actions={
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18 }}>
            {selectedSC?.integration === SystemIntegrationType.Fortellis ? (
              <Autocomplete
                style={{ width: 170 }}
                disableClearable
                options={defaultLaborTypesOptions}
                isOptionEqualToValue={(option, value) => option === value}
                value={laborType}
                onChange={handleLaborTypeChange}
                renderInput={autocompleteRender({
                  label: 'Default Labor Type',
                  placeholder: 'Labor Type',
                })}
              />
            ) : null}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <SearchInput
                onChange={handleSearchChange}
                value={searchTerm}
                onSearch={handleSearch}
              />
              <Button
                style={{ marginLeft: 16 }}
                color="primary"
                variant="contained"
                onClick={handleAddOpsCode}
              >
                Add Op Codes
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                variant="outlined"
                onClick={handleDownloadCSV}
                disabled={!selectedSC}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>Download</span>
                  <DownloadIcon />
                </div>
              </Button>
            </div>
          </div>
        }
      />
      <ServiceRequestsTable
        setEditedItem={setEditedItem}
        onOOpen={onOOpen}
        editedItem={editedItem}
        pageSize={pageSize}
        pageIndex={pageIndex}
        changePage={changePage}
        changeRowsPerPage={changeRowsPerPage}
      />
      <OPsCodesListDialog open={isOpen} onClose={onClose} onSave={onRequestAssign} />
      <OverrideOPsCodeModal open={isOOpen} onClose={onOClose} payload={editedItem} />
    </>
  );
};
