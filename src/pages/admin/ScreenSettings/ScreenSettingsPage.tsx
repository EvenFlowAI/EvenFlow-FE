import React from 'react';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { bookingFlowRoot } from '../../../utils/constants';
import { ScreenSettings } from '../../../features/admin/ScreenSettings/ScreenSettings';

const ScreenSettingsPage = () => {
  return (
    <>
      <TitleContainer title="Screen Settings" pad parent={bookingFlowRoot} />
      <ScreenSettings />
    </>
  );
};

export default ScreenSettingsPage;
