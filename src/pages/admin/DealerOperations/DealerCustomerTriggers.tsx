import React, { useEffect, useState } from 'react';
import { TitleContainerForDealerOperation } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { dealerOperationsCustomer, dealerOperationsRoot } from '../../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { DashboardItemI } from '../../../store/reducers/dealerOperations/types';
import { Autocomplete, Button, IconButton } from '@mui/material';
import { useStyles } from './styles';
import { ReactComponent as ArrowLeft } from '../../../assets/img/arrow-left.svg';
import { AddCircleOutline } from '@mui/icons-material';
import { autocompleteRender } from '../../../utils/autocompleteRenders';
import { ReactComponent as CloseNew } from '../../../assets/img/close-new.svg';
import {
  ComparisonOperatorE,
  EventFilterTypeE,
  updateCustomerEventRulesC,
} from '../../../store/reducers/dealerOperations/actions';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { TextField } from '../../../components/formControls/TextFieldStyled/TextField';

interface DealerCustomerTriggersI {
  eventId: number | null;
  setEventIdForRulesConfiguration: (eventIdForRulesConfiguration: number | null) => void;
}

interface CriteriaI {
  type: string;
  operator: string;
  value: string;
  isCriteria?: boolean;
}

const DealerCustomerTriggers = ({
  eventId,
  setEventIdForRulesConfiguration,
}: DealerCustomerTriggersI) => {
  const { dashboardItems } = useSelector((state: RootState) => state.dealerOperations);
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();

  useEffect(() => {
    if (dashboardItems.length) {
      const event = dashboardItems.find(item => item.id === eventId);
      if (event) {
        setEventForConfiguration(event);
        const updatedFilterRules = event?.filterRules.map(rule => {
          return {
            ...rule,
            value: rule.value ? rule.value : '',
            type: EventFilterTypeE[rule.type],
            operator: ComparisonOperatorE[rule.operator],
          };
        });
        setCriteria(updatedFilterRules);
      }
    }
  }, []);

  const [eventForConfiguration, setEventForConfiguration] = useState<DashboardItemI | null>(null);
  const [isEditTable, setIsEditTable] = useState<boolean>(false);
  const [criterias, setCriteria] = useState<CriteriaI[]>([]);

  const handleAddCriteria = () => {
    setCriteria(prev => [...prev, { type: '', operator: '', value: '', isCriteria: true }]);
  };

  const handleRemoveCriteria = (index: number) => {
    if (criterias.length > 1) {
      setCriteria(prev => prev.filter((criteria, i) => i !== index));
    }
  };

  const handleCriteriaChange = (index: number, field: keyof CriteriaI, newValue: string) => {
    const updated = [...criterias];
    if (field === 'type' || field === 'operator' || field === 'value') {
      updated[index][field] = newValue;
      setCriteria(updated);
    }
  };

  const handleCancelChanges = () => {
    setIsEditTable(false);
    if (eventForConfiguration?.filterRules) {
      const updatedFilterRules = eventForConfiguration?.filterRules.map(rule => {
        return {
          ...rule,
          value: rule.value,
          type: EventFilterTypeE[rule.type],
          operator: ComparisonOperatorE[rule.operator],
        };
      });
      setCriteria(updatedFilterRules);
    }
  };

  const handleOnSuccess = () => {
    setIsEditTable(false);
  };

  const handleSaveChanges = () => {
    if (!selectedSC || !eventForConfiguration) {
      throw new Error('Selected SC is not defined');
    }

    dispatch(
      updateCustomerEventRulesC(
        {
          serviceCenterId: selectedSC?.id,
          eventId: eventForConfiguration?.id,
          filterRules: criterias,
        },
        handleOnSuccess
      )
    );
  };

  const { classes } = useStyles();

  if (eventForConfiguration) {
    return (
      <div style={{ width: '100%' }}>
        <TitleContainerForDealerOperation
          title={`${eventForConfiguration.name}`}
          pad
          parent={dealerOperationsCustomer}
          secondParent={dealerOperationsRoot}
          actions={() => setEventIdForRulesConfiguration(null)}
        />

        <div style={{ display: 'flex', marginBottom: '30px' }}>
          <Button
            variant="text"
            className={classes.backWrapper}
            onClick={() => setEventIdForRulesConfiguration(null)}
          >
            <ArrowLeft />
            <span>Back to Customer Communication Dashboard</span>
          </Button>
        </div>

        <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
            {isEditTable ? (
              <>
                <Button variant="text" onClick={handleCancelChanges} color="secondary">
                  Cancel
                </Button>
                <Button variant="text" onClick={handleSaveChanges}>
                  Save
                </Button>
              </>
            ) : (
              <Button variant="text" onClick={() => setIsEditTable(true)}>
                Edit
              </Button>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '70vh',
              justifyContent: 'space-between',
              border: '1px solid #DADADA',
              padding: '24px',
              background: '#fff',
            }}
          >
            <div style={{ display: 'flex', width: '48%', flexDirection: 'column', gap: '10px' }}>
              <span style={{ textTransform: 'uppercase', fontSize: '18px', fontWeight: 700 }}>
                Audience
              </span>

              {criterias.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {criterias.map((criteria, index) => {
                    return (
                      <div
                        key={index}
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '20px',
                        }}
                      >
                        <Autocomplete
                          disabled={!isEditTable}
                          style={{ width: '56%' }}
                          value={criteria.type}
                          options={['DaysToFutureAppointment']}
                          isOptionEqualToValue={(o, v) => String(o) === String(v)}
                          getOptionLabel={o => o}
                          onChange={(e, v) => handleCriteriaChange(index, 'type', v || '')}
                          renderInput={autocompleteRender({
                            label: 'Days from list generation',
                            placeholder: 'Not selected',
                          })}
                        />
                        <Autocomplete
                          style={{ width: '25%' }}
                          disabled={!isEditTable}
                          // value={criteria.operator}
                          value={'Equal'}
                          options={['Equal']}
                          isOptionEqualToValue={(o, v) => String(o) === String(v)}
                          getOptionLabel={o => o}
                          onChange={(e, v) => handleCriteriaChange(index, 'operator', v || '')}
                          renderInput={autocompleteRender({
                            label: 'Operator',
                            placeholder: '',
                          })}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', width: '15%' }}>
                          <TextField
                            fullWidth
                            disabled={!isEditTable}
                            type="number"
                            inputProps={{ min: 0 }}
                            label="Value"
                            placeholder=""
                            onChange={e =>
                              handleCriteriaChange(index, 'value', e.target.value || '')
                            }
                            value={+criteria.value}
                          />
                        </div>
                        {isEditTable ? (
                          <div
                            style={{ marginTop: '30px', cursor: 'pointer' }}
                            onClick={() => handleRemoveCriteria(index)}
                          >
                            <CloseNew />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {isEditTable ? (
                <IconButton
                  onClick={handleAddCriteria}
                  disabled={!!criterias.length}
                  className={classes.iconPlus}
                  size="large"
                >
                  <AddCircleOutline className={criterias.length ? 'isDisabled' : ''} />
                  <span
                    className={criterias.length ? 'isDisabled' : ''}
                    style={{ fontWeight: 700, color: '#7898FF' }}
                  >
                    Audience Criteria
                  </span>
                </IconButton>
              ) : null}
            </div>

            <hr
              style={{
                color: '#EAEBEE',
                backgroundColor: '#EAEBEE',
                width: '1px',
                height: '100%',
                border: 'none',
                margin: '0px',
              }}
            />

            <div style={{ display: 'flex', width: '48%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};

export default DealerCustomerTriggers;
