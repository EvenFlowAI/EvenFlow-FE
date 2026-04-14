import React from 'react';
import { TextField } from '../../../components/formControls/TextFieldStyled/TextField';
import { Search } from '@mui/icons-material';
import dayjs from 'dayjs';
import CustomDateRangePicker from '../../../components/pickers/CustomDateRangePicker/CustomDateRangePicker';
import ManufacturerForm from './ManufacturerForm';

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
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
      <TextField
        style={{ width: 320 }}
        placeholder="Search..."
        endAdornment={<Search />}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <ManufacturerForm setManufacturer={setManufacturer} selectedManufacturer={manufacturer} />
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
