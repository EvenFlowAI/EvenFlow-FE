import React from 'react';
import { capacityManagementRoot } from '../../../utils/constants';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import PartsAvailability from '../../../features/admin/PartsAvailability/PartsAvailability';

const PartsAvailabilityPage = () => {
  return (
    <>
      <TitleContainer title="Parts Availability" pad parent={capacityManagementRoot} />
      <PartsAvailability />
    </>
  );
};

export default PartsAvailabilityPage;
