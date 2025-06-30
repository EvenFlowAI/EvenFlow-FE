import React, { useEffect, useState } from 'react';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { IEndUserConfig } from '../../../features/admin/Reporting/types';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { Titles } from '../../../types/types';
import { ReportingRoutes } from '../../../routes/ReportingRoutes/ReportingRoutes';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';

const ReportingPage: React.FC = () => {
  const [config, setConfig] = useState<IEndUserConfig>({
    domain: 'https://pcuxl.qrveyapp.com',
  });
  const { selectedSC } = useSCs();

  useEffect(() => {
    if (selectedSC) {
      Api.call(Api.endpoints.Qrvey.GetToken, { data: { serviceCenterId: selectedSC.id } }).then(
        result => {
          if (result?.data?.token) setConfig(prev => ({ ...prev, qv_token: result.data.token }));
        }
      );
    }
  }, [selectedSC]);

  return (
    <div style={{ display: 'block', width: '100%' }}>
      <TitleContainer title={Titles.Reporting} pad />
      <ReportingRoutes config={config} />
    </div>
  );
};

export default ReportingPage;
