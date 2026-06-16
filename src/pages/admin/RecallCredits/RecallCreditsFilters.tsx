import React, { useEffect, useState } from 'react';
import { TextField } from '../../../components/formControls/TextFieldStyled/TextField';
import { Search } from '@mui/icons-material';
import { ServiceCenterCredit } from '../RecallDatabase/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { autocompleteRender } from '../../../utils/autocompleteRenders';
import { Autocomplete } from '@mui/material';

const ALL_DEALERSHIP_GROUPS_ID = -1;

interface IRecallCreditsFilters {
  searchTerm?: string;
  dealershipId?: number;
}

interface RecallCreditsFiltersI {
  sourceData: ServiceCenterCredit[];
  setData: React.Dispatch<React.SetStateAction<ServiceCenterCredit[]>>;
  setPageData: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>;
}

const RecallCreditsFilters = ({ sourceData, setData, setPageData }: RecallCreditsFiltersI) => {
  const [filters, setFilters] = useState<IRecallCreditsFilters>({
    dealershipId: ALL_DEALERSHIP_GROUPS_ID,
    searchTerm: '',
  });
  const { dealershipList } = useSelector((state: RootState) => state.dealershipGroups);
  const dealershipOptions = [
    { id: ALL_DEALERSHIP_GROUPS_ID, name: 'All dealership groups' },
    ...dealershipList,
  ];

  useEffect(() => {
    if (sourceData) {
      applyFilters(filters, false);
    }
  }, [sourceData]);

  const applyFilters = (newFilters: IRecallCreditsFilters, resetPage = true) => {
    let filtered = [...sourceData];

    if (
      newFilters.dealershipId !== undefined &&
      newFilters.dealershipId !== ALL_DEALERSHIP_GROUPS_ID
    ) {
      filtered = filtered.filter(credit => credit.dealershipId === newFilters.dealershipId);
    }

    if (newFilters.searchTerm && newFilters.searchTerm.trim() !== '') {
      const term = newFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(u => u.serviceCenterName?.toLowerCase().includes(term));
    }

    setData(filtered);
    if (resetPage) {
      setPageData(prev => ({ ...prev, pageIndex: 0 }));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFilters = {
      ...filters,
      searchTerm: e.target.value,
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSelectDealership = (e: React.SyntheticEvent, value?: number) => {
    const newFilters = {
      ...filters,
      dealershipId: value ?? ALL_DEALERSHIP_GROUPS_ID,
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
      <TextField
        style={{ width: 310 }}
        placeholder="Search Service Centers..."
        endAdornment={<Search />}
        value={filters.searchTerm}
        onChange={e => handleSearchChange(e)}
      />

      <Autocomplete
        options={dealershipOptions}
        disableClearable
        getOptionLabel={option => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={dealershipOptions.find(d => d.id === filters.dealershipId) ?? dealershipOptions[0]}
        onChange={(event, newValue) => {
          handleSelectDealership(event, newValue?.id);
        }}
        style={{ width: '291px' }}
        renderInput={autocompleteRender({
          label: '',
          fullWidth: true,
          placeholder: 'Not selected',
        })}
      />
    </div>
  );
};

export default RecallCreditsFilters;
