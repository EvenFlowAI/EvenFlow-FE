import React, { useEffect, useState } from 'react';
import { IEndUserConfig } from '../../../features/admin/Reporting/types';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { ReportingRoutes } from '../../../routes/ReportingRoutes/ReportingRoutes';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';
import { useLocation } from 'react-router-dom';
import { useStyles } from './styles';

const ReportingPage: React.FC = () => {
  const [config, setConfig] = useState<IEndUserConfig>({
    domain: 'https://pcuxl.qrveyapp.com',
  });
  const { selectedSC } = useSCs();
  const { classes } = useStyles();
  const location = useLocation();
  const lastSegment = location.pathname.split('/').pop();

  const getReportName = () => {
    switch (lastSegment) {
      case 'bdc-reports':
        return 'BDC Reports';
      case 'shop-loading':
        return 'Shop Loading';
      case 'help-support':
        return 'Help & Support';
      case 'today-appointments':
        return "Today's Appointments";
      case 'customer-behavior':
        return 'Customer Behavior';
      case 'repair-orders':
        return 'Repair Orders';
      case 'service-retention':
        return 'Service Retention';
      default:
        return '';
    }
  };

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
    <div className={classes.wrapper}>
      <div className={classes.nav}>
        <p className={classes.reporting}>Reporting</p>
        <span className={classes.navSeparator}> / </span>
        <span className={classes.navReportName}>{getReportName()}</span>
      </div>
      <ReportingRoutes config={config} />
    </div>
  );
};

export default ReportingPage;
