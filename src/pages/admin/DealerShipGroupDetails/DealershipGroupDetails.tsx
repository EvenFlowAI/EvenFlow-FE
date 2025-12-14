import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { IDealershipGroupExtended } from '../../../store/reducers/dealershipGroups/types';
import { concatAddress } from '../../../utils/utils';
import { Tab } from '@mui/material';
import { TabList } from '../../../components/styled/Tabs';
import { TabContext, TabPanel } from '@mui/lab';
import { DetailsServiceCenters } from '../../../features/admin/DealershipGroupDetails/DetailsServiceCenters/DetailsServiceCenters';
import { DetailsEmployees } from '../../../features/admin/DealershipGroupDetails/DetailsEmployees/DetailsEmployees';
import { AdminStyling } from '../../../features/admin/DealershipGroupDetails/AdminStyling/AdminStyling';
import { useDispatch } from 'react-redux';
import { loadDealershipEmployees } from '../../../store/reducers/employees/actions';
import { loadDealershipSCs } from '../../../store/reducers/serviceCenters/actions';
import { TTab } from './types';
import { useStatePagination } from '../../../hooks/usePaginations/usePaginations';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';
import {
  setCustomLogoPath,
  setSidebarColorHex,
} from '../../../store/reducers/dealershipGroups/actions';

const tabs: TTab[] = [
  { id: '1', label: 'Service Centers', component: DetailsServiceCenters },
  { id: '2', label: 'Employees', component: DetailsEmployees },
  { id: '3', label: 'Admin Styling', component: AdminStyling },
];

export const DealershipGroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [dealership, setDealership] = useState<IDealershipGroupExtended | undefined>();
  const [selectedTab, setTab] = useState<string>('1');
  const dispatch = useDispatch();

  const {
    pageData: pageEData,
    onChangeRowsPerPage: onChangeERowsPerPage,
    onChangePage: onChangeEPage,
  } = useStatePagination();
  const {
    pageData: pageDData,
    onChangeRowsPerPage: onChangeDRowsPerPage,
    onChangePage: onChangeDPage,
  } = useStatePagination();

  useEffect(() => {
    Api.call<IDealershipGroupExtended>(Api.endpoints.Dealerships.Retrieve, {
      urlParams: { id },
    }).then(r => {
      const dealershipData = r.data;
      setDealership(dealershipData);
      dispatch(
        setCustomLogoPath({
          value: dealershipData.logoPath,
          isDefault: dealershipData.isDefaultLogo,
        })
      );
      dispatch(setSidebarColorHex(dealershipData.leftPanelColor));
    });
  }, [setDealership, id, dispatch]);

  useEffect(() => {
    dispatch(loadDealershipEmployees(id, pageEData));
  }, [id, dispatch, pageEData]);

  useEffect(() => {
    dispatch(loadDealershipSCs(id, pageDData));
  }, [id, dispatch, pageDData]);

  const handleChangeTab = (e: React.SyntheticEvent, tab: string) => {
    setTab(tab);
  };

  return (
    <TabContext value={selectedTab}>
      <TitleContainer
        title={dealership?.name || ''}
        subtitle={concatAddress(dealership?.address)}
        pad
      />
      <TabList
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="primary"
        onChange={handleChangeTab}
      >
        {tabs.map(t => {
          return <Tab label={t.label} key={t.id} value={t.id} />;
        })}
      </TabList>
      {tabs.map(t => {
        return (
          <TabPanel style={{ width: '100%' }} value={t.id} key={t.id}>
            <t.component
              onChangePage={t.id === '2' ? onChangeEPage : onChangeDPage}
              onChangeRowsPerPage={t.id === '2' ? onChangeERowsPerPage : onChangeDRowsPerPage}
              page={t.id === '2' ? pageEData.pageIndex : pageDData.pageIndex}
              rowsPerPage={t.id === '2' ? pageEData.pageSize : pageDData.pageSize}
            />
          </TabPanel>
        );
      })}
    </TabContext>
  );
};
