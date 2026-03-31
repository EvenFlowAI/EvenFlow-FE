import React from 'react';
import { TextField } from '../../../components/formControls/TextFieldStyled/TextField';
import { Search } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { autocompleteRender } from '../../../utils/autocompleteRenders';
import { Autocomplete } from '@mui/material';

interface RecallDatabaseFiltersProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  manufacturer: string;
  setManufacturer: React.Dispatch<React.SetStateAction<string>>;
}

const RecallDatabaseFilters = ({
  searchTerm,
  setSearchTerm,
  manufacturer,
  setManufacturer,
}: RecallDatabaseFiltersProps) => {
  const { manufacturers } = useSelector((state: RootState) => state.recallDatabase);

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
      <TextField
        style={{ width: 182 }}
        placeholder="Search..."
        endAdornment={<Search />}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <Autocomplete
        style={{ width: 180 }}
        value={manufacturer}
        options={manufacturers}
        isOptionEqualToValue={(o, v) => o === v}
        getOptionLabel={o => o}
        onChange={(e, v) => setManufacturer(v || '')}
        renderInput={autocompleteRender({
          label: 'Manufacturer',
          placeholder: 'Not selected',
        })}
      />
    </div>
  );
};

export default RecallDatabaseFilters;
