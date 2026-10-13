import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { loadMakes } from '../../../store/reducers/packages/actions';
import {
  loadDmsConfiguration,
  resetDmsConfiguration,
} from '../../../store/reducers/dmsConfiguration/actions';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { useException } from '../../../hooks/useException/useException';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import { ConfigurationQuery } from './ConfigurationQuery';
import { ConfigurationResults } from './ConfigurationResults';
import { defaultConfigurationQueryForm, TConfigurationQueryForm } from './types';
import { useStyles } from './styles';

export const ConfigurationRetrieval: React.FC = () => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch();
  const showError = useException();
  const { selectedSC } = useSCs();
  const { makes } = useSelector((state: RootState) => state.packages);
  const { configuration, isLoading } = useSelector((state: RootState) => state.dmsConfiguration);
  const [form, setForm] = useState<TConfigurationQueryForm>(defaultConfigurationQueryForm);

  useEffect(() => {
    setForm(defaultConfigurationQueryForm);
    dispatch(resetDmsConfiguration());
    if (selectedSC) dispatch(loadMakes(selectedSC.id));
  }, [dispatch, selectedSC]);

  useEffect(() => {
    return () => {
      dispatch(resetDmsConfiguration());
    };
  }, [dispatch]);

  const handleGetConfiguration = () => {
    if (!selectedSC || !form.make || !form.model || !form.year) return;
    dispatch(
      loadDmsConfiguration(
        {
          serviceCenterId: selectedSC.id,
          makeId: form.make.id,
          modelId: form.model.id,
          year: Number(form.year),
        },
        showError
      )
    );
  };

  const hasResults = Boolean(
    configuration &&
    (configuration.serviceRequests?.length ||
      configuration.employees?.length ||
      configuration.transportations?.length)
  );

  const renderResults = () => {
    if (isLoading) {
      return (
        <div className={classes.loadingWrapper}>
          <Loading />
        </div>
      );
    }
    if (configuration && hasResults) {
      return <ConfigurationResults configuration={configuration} />;
    }
    return (
      <div className={classes.emptyResults}>Run a query to retrieve DMS configuration data.</div>
    );
  };

  return (
    <div className={cx(classes.wrapper, !hasResults && classes.wrapperEmpty)}>
      <ConfigurationQuery
        form={form}
        makes={makes}
        loading={isLoading}
        onChange={setForm}
        onSubmit={handleGetConfiguration}
      />
      <div className={cx(classes.panel, classes.results)}>
        <p className={cx(classes.headerText, classes.resultsHeader)}>Configuration Results</p>
        {renderResults()}
      </div>
    </div>
  );
};
