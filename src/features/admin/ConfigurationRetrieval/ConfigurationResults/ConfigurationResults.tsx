import React, { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  IDmsConfiguration,
  IDmsConfigurationEmployee,
  IDmsConfigurationTransportation,
} from '../../../../store/reducers/dmsConfiguration/types';
import { TableRowDataTypeResp } from '../../../../types/types';
import { EConfigurationResultsTab } from '../types';
import { useStyles } from '../styles';
import { OpCodesResults } from './OpCodesResults';
import { PaginatedResultsTable } from './PaginatedResultsTable';

// Converts backend role keys like "serviceAdvisor" or "service_advisor" into "Service Advisor".
const formatRole = (role?: string | null): string =>
  (role ?? '')
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, char => char.toUpperCase());

type TConfigurationResultsProps = {
  configuration: IDmsConfiguration;
};

const advisorsRowData: TableRowDataTypeResp<IDmsConfigurationEmployee>[] = [
  { header: 'Advisor Name', val: el => el.fullName },
  { header: 'DMS Employee ID', val: el => el.dmsId },
  { header: 'Role', val: el => formatRole(el.role) },
];

const transportationRowData: TableRowDataTypeResp<IDmsConfigurationTransportation>[] = [
  { header: 'Transportation ID', val: el => el.id },
  { header: 'Description', val: el => el.description },
];

export const ConfigurationResults: React.FC<TConfigurationResultsProps> = ({ configuration }) => {
  const { classes } = useStyles();
  const [tab, setTab] = useState<EConfigurationResultsTab>(EConfigurationResultsTab.OpCodes);

  const handleTabChange = (_: React.MouseEvent<HTMLElement>, value: EConfigurationResultsTab) => {
    if (value) setTab(value);
  };

  return (
    <div className={classes.resultsContent}>
      <ToggleButtonGroup
        className={classes.resultTabs}
        exclusive
        size="small"
        value={tab}
        onChange={handleTabChange}
      >
        <ToggleButton value={EConfigurationResultsTab.OpCodes}>Op Codes</ToggleButton>
        <ToggleButton value={EConfigurationResultsTab.Advisors}>Advisors</ToggleButton>
        <ToggleButton value={EConfigurationResultsTab.Transportation}>Transportation</ToggleButton>
      </ToggleButtonGroup>
      {tab === EConfigurationResultsTab.OpCodes && (
        <OpCodesResults opCodes={configuration.serviceRequests} />
      )}
      {tab === EConfigurationResultsTab.Advisors && (
        <PaginatedResultsTable<IDmsConfigurationEmployee>
          data={configuration.employees}
          rowData={advisorsRowData}
          index="dmsId"
          noDataTitle="No advisors found"
        />
      )}
      {tab === EConfigurationResultsTab.Transportation && (
        <PaginatedResultsTable<IDmsConfigurationTransportation>
          data={configuration.transportations}
          rowData={transportationRowData}
          index="id"
          noDataTitle="No transportation options found"
        />
      )}
    </div>
  );
};
