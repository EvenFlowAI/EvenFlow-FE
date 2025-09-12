import React from 'react';
import { Tab } from '@mui/material';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { TabContext, TabPanel } from '@mui/lab';
import { TabList } from '../../../components/styled/Tabs';
import GeographicZones from '../../../features/admin/PricingServiceValet/GeographicZones/GeographicZones';
import GeographicZonesMap from '../../../features/admin/PricingServiceValet/GeographicZonesMap/GeographicZonesMap';
import AddEditGeographicZone from '../../../components/modals/admin/EditGeographicZone/AddEditGeographicZone';
import AncillaryPrice from '../../../features/admin/PricingServiceValet/AncillaryPrice/AncillaryPrice';
import { servicesRoot } from '../../../utils/constants';
import { useModal } from '../../../hooks/useModal/useModal';
import CenterSettings from '../../../features/admin/CenterSettings/CenterSettings';
import ZoneRouting from '../../../features/admin/ZoneRouting/ZoneRouting';
import TimeRangesAndCapacity from '../../../features/admin/TimeRangesAndCapacity/TimeRangesAndCapacity';
import { ServiceValetRoutes } from '../../../routes/types';

type TTab = {
  route: ServiceValetRoutes;
  label: string;
  component: JSX.Element;
};

const ServiceValet = () => {
  const [currentTab, setCurrentTab] = React.useState<string>('geographiczones');
  const { onOpen: onAddZoneOpen, onClose: onAddZoneClose, isOpen: isAddZoneOpen } = useModal();

  const tabs: TTab[] = [
    {
      route: ServiceValetRoutes.GeographicZones,
      label: 'Geographic Zones',
      component: <GeographicZones onAddZoneOpen={onAddZoneOpen} />,
    },
    {
      route: ServiceValetRoutes.GeographicZonesMap,
      label: 'Geographic Zones Map',
      component: <GeographicZonesMap />,
    },
    {
      route: ServiceValetRoutes.CenterSettings,
      label: 'Center Settings',
      component: <CenterSettings serviceType="PickUpDropOff" />,
    },
    {
      route: ServiceValetRoutes.ZoneRouting,
      label: 'Zone Routing',
      component: <ZoneRouting serviceType="PickUpDropOff" />,
    },
    {
      route: ServiceValetRoutes.TimeRangesCapacity,
      label: 'Time Ranges & Capacity',
      component: <TimeRangesAndCapacity />,
    },
    {
      route: ServiceValetRoutes.ConvinienceFees,
      label: 'Convenience Fees',
      component: <AncillaryPrice />,
    },
  ];

  const handleTabChange = (e: React.SyntheticEvent, value: string) => {
    setCurrentTab(value);
  };

  return (
    <TabContext value={currentTab}>
      <TitleContainer title="Service Valet" pad parent={servicesRoot} />
      <TabList
        variant="scrollable"
        scrollButtons="auto"
        onChange={handleTabChange}
        indicatorColor="primary"
      >
        {tabs.map(t => {
          return <Tab label={t.label} value={t.route} key={t.route} />;
        })}
      </TabList>
      {tabs.map(t => {
        return (
          <TabPanel style={{ width: '100%' }} key={t.route} value={t.route}>
            {t.component}
          </TabPanel>
        );
      })}
      <AddEditGeographicZone
        open={isAddZoneOpen}
        onClose={onAddZoneClose}
        isEdit={false}
        serviceType="serviceValet"
      />
    </TabContext>
  );
};

export default ServiceValet;
