import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete, Button, Checkbox, InputAdornment } from '@mui/material';
import { FileDownloadOutlined, Search } from '@mui/icons-material';
import { ReactComponent as CheckIcon } from '../../../../assets/img/checkboxSmallGreen.svg';
import { ReactComponent as RedCross } from '../../../../assets/img/redCross.svg';
import { useDispatch } from 'react-redux';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import {
  ICreateDmsServiceRequestsResult,
  IDmsConfigurationServiceRequest,
} from '../../../../store/reducers/dmsConfiguration/types';
import {
  downloadDmsConfigurationCsv,
  importDmsOpCodes,
} from '../../../../store/reducers/dmsConfiguration/actions';
import { TableRowDataTypeResp } from '../../../../types/types';
import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import { PaginatedResultsTable } from './PaginatedResultsTable';
import { EOpCodeStatusFilter } from '../types';
import { useStyles } from '../styles';

type TOpCodesResultsProps = {
  opCodes: IDmsConfigurationServiceRequest[];
};

const ALL_TYPES = 'all';

type TFilterOption<T> = { value: T; label: string };

const statusFilterOptions: TFilterOption<EOpCodeStatusFilter>[] = [
  { value: EOpCodeStatusFilter.All, label: 'All Statuses' },
  { value: EOpCodeStatusFilter.Configured, label: 'Configured' },
  { value: EOpCodeStatusFilter.NotConfigured, label: 'Not configured' },
];

const getImportMessage = ({ inserted, updated, failed }: ICreateDmsServiceRequestsResult) => {
  const parts = [`${inserted} added`];
  if (updated) parts.push(`${updated} updated`);
  if (failed) parts.push(`${failed} failed`);
  return `Op codes import completed: ${parts.join(', ')}.`;
};

export const OpCodesResults: React.FC<TOpCodesResultsProps> = ({ opCodes }) => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch();
  const showMessage = useMessage();
  const showError = useException();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string>(ALL_TYPES);
  const [status, setStatus] = useState<EOpCodeStatusFilter>(EOpCodeStatusFilter.All);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [isImporting, setImporting] = useState(false);
  const [isDownloading, setDownloading] = useState(false);

  useEffect(() => {
    const notConfiguredCodes = new Set(opCodes.filter(el => !el.isConfigured).map(el => el.code));
    setSelectedCodes(prev => prev.filter(code => notConfiguredCodes.has(code)));
  }, [opCodes]);

  const typeFilterOptions = useMemo<TFilterOption<string>[]>(
    () => [
      { value: ALL_TYPES, label: 'All types' },
      ...Array.from(new Set(opCodes.map(el => el.type).filter(Boolean)))
        .sort()
        .map(option => ({ value: option, label: option })),
    ],
    [opCodes]
  );

  const filteredOpCodes = useMemo(() => {
    const term = search.trim().toLowerCase();
    return opCodes.filter(el => {
      const matchesSearch =
        !term ||
        el.code?.toLowerCase().includes(term) ||
        el.description?.toLowerCase().includes(term);
      const matchesType = type === ALL_TYPES || el.type === type;
      const matchesStatus =
        status === EOpCodeStatusFilter.All ||
        (status === EOpCodeStatusFilter.Configured) === el.isConfigured;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [opCodes, search, type, status]);

  const selectableCodes = useMemo(
    () => filteredOpCodes.filter(el => !el.isConfigured).map(el => el.code),
    [filteredOpCodes]
  );
  const selectedVisibleCount = selectableCodes.filter(code => selectedCodes.includes(code)).length;
  const isAllSelected =
    selectableCodes.length > 0 && selectedVisibleCount === selectableCodes.length;

  const renderCellText = (el: IDmsConfigurationServiceRequest, text: string) => (
    <span className={el.isConfigured ? classes.disabledText : undefined}>{text || '-'}</span>
  );

  const toggleCode = (code: string) => {
    setSelectedCodes(prev =>
      prev.includes(code) ? prev.filter(el => el !== code) : [...prev, code]
    );
  };

  const toggleAll = () => {
    setSelectedCodes(prev =>
      isAllSelected
        ? prev.filter(code => !selectableCodes.includes(code))
        : Array.from(new Set([...prev, ...selectableCodes]))
    );
  };

  const handleImport = () => {
    setImporting(true);
    dispatch(
      importDmsOpCodes(
        selectedCodes,
        result => {
          setImporting(false);
          setSelectedCodes([]);
          showMessage(getImportMessage(result), result.failed ? 'warning' : 'success');
        },
        message => {
          setImporting(false);
          showError(message);
        }
      )
    );
  };

  const handleDownload = () => {
    setDownloading(true);
    dispatch(downloadDmsConfigurationCsv(showError, () => setDownloading(false)));
  };

  const rowData: TableRowDataTypeResp<IDmsConfigurationServiceRequest>[] = [
    {
      header: (
        <Checkbox
          className={classes.checkbox}
          size="small"
          color="primary"
          checked={isAllSelected}
          indeterminate={selectedVisibleCount > 0 && !isAllSelected}
          disabled={!selectableCodes.length || isImporting}
          onChange={toggleAll}
          inputProps={{ 'aria-label': 'Select all not configured op codes' }}
        />
      ),
      width: 48,
      val: el => (
        <Checkbox
          className={classes.checkbox}
          size="small"
          color="primary"
          checked={!el.isConfigured && selectedCodes.includes(el.code)}
          disabled={el.isConfigured || isImporting}
          onChange={() => toggleCode(el.code)}
          inputProps={{ 'aria-label': `Select ${el.code}` }}
        />
      ),
    },
    { header: 'Op Code', val: el => renderCellText(el, el.code) },
    { header: 'Description', val: el => renderCellText(el, el.description) },
    { header: 'Type', val: el => renderCellText(el, el.type) },
    {
      header: 'Price',
      val: el => renderCellText(el, typeof el.price === 'number' ? `$${el.price.toFixed(2)}` : '-'),
      align: 'right',
    },
    {
      header: 'Status',
      val: el =>
        el.isConfigured ? (
          <span className={cx(classes.status, classes.disabledStatus)}>
            <CheckIcon />
            <span className={classes.configured}>Configured</span>
          </span>
        ) : (
          <span className={classes.status}>
            <RedCross />
            <span className={classes.notConfigured}>Not Configured</span>
          </span>
        ),
    },
  ];

  return (
    <>
      <div className={classes.toolbar}>
        <div className={classes.searchField}>
          <TextField
            fullWidth
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <Search fontSize="small" />
              </InputAdornment>
            }
          />
        </div>
        <Autocomplete
          className={classes.filterField}
          options={typeFilterOptions}
          value={typeFilterOptions.find(option => option.value === type) ?? typeFilterOptions[0]}
          disableClearable
          selectOnFocus={false}
          slotProps={{ paper: { className: classes.filterPaper } }}
          getOptionLabel={option => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(_, option) => setType(option.value)}
          renderInput={autocompleteRender({ label: '', placeholder: 'All types' })}
        />
        <Autocomplete
          className={classes.filterField}
          options={statusFilterOptions}
          value={
            statusFilterOptions.find(option => option.value === status) ?? statusFilterOptions[0]
          }
          disableClearable
          selectOnFocus={false}
          slotProps={{ paper: { className: classes.filterPaper } }}
          getOptionLabel={option => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(_, option) => setStatus(option.value)}
          renderInput={autocompleteRender({ label: '', placeholder: 'All Statuses' })}
        />
        <div className={classes.toolbarActions}>
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedCodes.length || isImporting}
            onClick={handleImport}
          >
            {isImporting ? 'Adding...' : `Add Op Codes (${selectedCodes.length})`}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            endIcon={<FileDownloadOutlined />}
            disabled={isDownloading}
            onClick={handleDownload}
          >
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
        </div>
      </div>
      <PaginatedResultsTable<IDmsConfigurationServiceRequest>
        data={filteredOpCodes}
        rowData={rowData}
        index="code"
        noDataTitle={opCodes.length ? 'No op codes match the filters' : 'No op codes found'}
      />
    </>
  );
};
