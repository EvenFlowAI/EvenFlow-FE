import React from 'react';
import { TextField } from '../../../components/formControls/TextFieldStyled/TextField';
import { Search } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { autocompleteRender } from '../../../utils/autocompleteRenders';
import { Autocomplete } from '@mui/material';
import { useAutocompleteStyles } from '../../../hooks/styling/useAutocompleteStyles';
import dayjs from 'dayjs';
import CustomDateRangePicker from '../../../components/pickers/CustomDateRangePicker/CustomDateRangePicker';

interface RecallDatabaseFiltersProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  manufacturer: string[];
  setManufacturer: React.Dispatch<React.SetStateAction<string[]>>;
  date: [dayjs.Dayjs | null, dayjs.Dayjs | null];
  setDate: React.Dispatch<React.SetStateAction<[dayjs.Dayjs | null, dayjs.Dayjs | null]>>;
}

const RecallDatabaseFilters = ({
  searchTerm,
  setSearchTerm,
  manufacturer,
  setManufacturer,
  date,
  setDate,
}: RecallDatabaseFiltersProps) => {
  const { manufacturers } = useSelector((state: RootState) => state.recallDatabase);
  const { classes } = useAutocompleteStyles();

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
        classes={classes}
        style={{ width: 350 }}
        multiple
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
      <CustomDateRangePicker
        shortcuts
        title="Date Reported"
        value={date}
        setValue={date => setDate(date)}
        format="MMM D, YYYY"
      />
    </div>
  );
};

export default RecallDatabaseFilters;
