/* eslint-disable max-lines */

import React, { useEffect, useState } from 'react';
import { TitleContainerForDealerOperation } from '../../../../components/wrappers/TitleContainer/TitleContainer';
import { dealerOperationsCustomer, dealerOperationsRoot } from '../../../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { DashboardItemI } from '../../../../store/reducers/dealerOperations/types';
import { Button } from '@mui/material';
import { useStyles } from '../styles';
import { ReactComponent as ArrowLeft } from '../../../../assets/img/arrow-left.svg';
import {
  ComparisonOperatorE,
  EventRulesFilterTypeE,
  updateCustomerEventRulesC,
} from '../../../../store/reducers/dealerOperations/actions';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import AudienceForm from './Forms/AudienceForm';
import { CriteriaI, TriggerI } from './types';
import RulesForm from './Forms/RulesForm';
import Triggers from './Forms/Triggers';
import { useException } from '../../../../hooks/useException/useException';
import { validateGroup } from '../helper';
import { useModal } from '../../../../hooks/useModal/useModal';
import LeaveWithoutSaving from '../../../../components/modals/admin/LeaveWithoutSaving/LeaveWithoutSaving';

interface DealerCustomerSettingsI {
  eventId: number | null;
  setEventIdForRulesConfiguration: (eventIdForRulesConfiguration: number | null) => void;
}

const DealerCustomerSettings = ({
  eventId,
  setEventIdForRulesConfiguration,
}: DealerCustomerSettingsI) => {
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
            type: EventRulesFilterTypeE[rule.type],
            operator: ComparisonOperatorE[rule.operator],
          };
        });
        setCriteria(updatedFilterRules.filter(rule => rule.isCriteria));
        setRules(updatedFilterRules.filter(rule => !rule.isCriteria));
        setTriggers(event.triggers);
      }
    }
  }, []);

  const [eventForConfiguration, setEventForConfiguration] = useState<DashboardItemI | null>(null);
  const [isEditTable, setIsEditTable] = useState<boolean>(false);
  const [criterias, setCriteria] = useState<CriteriaI[]>([]);
  const [rules, setRules] = useState<CriteriaI[]>([]);
  const [triggers, setTriggers] = useState<TriggerI[]>([]);
  const showError = useException();
  const {
    onOpen: onOpenLeaveWithoutSavingModal,
    onClose: onCloseLeaveWithoutSavingModal,
    isOpen: isOpenLeaveWithoutSavingModal,
  } = useModal();

  const handleCancelChanges = () => {
    setIsEditTable(false);
    if (eventForConfiguration?.filterRules) {
      const updatedFilterRules = eventForConfiguration?.filterRules.map(rule => {
        return {
          ...rule,
          value: rule.value ? rule.value : '',
          type: EventRulesFilterTypeE[rule.type],
          operator: ComparisonOperatorE[rule.operator],
        };
      });
      setCriteria(updatedFilterRules.filter(rule => rule.isCriteria));
      setRules(updatedFilterRules.filter(rule => !rule.isCriteria));
      setTriggers(eventForConfiguration.triggers);
    }
  };

  const handleOnSuccess = () => {
    setIsEditTable(false);
  };

  const handleSaveChanges = () => {
    if (!selectedSC || !eventForConfiguration) {
      throw new Error('Selected SC is not defined');
    }

    if (
      validateGroup(criterias, c => Number.isInteger(Number(c.value))) &&
      validateGroup(rules, r => Number.isInteger(Number(r.value))) &&
      validateGroup(triggers, t => Number.isInteger(Number(t.daysFromListGeneration)))
    ) {
      if (triggers.length) {
        const isValid = triggers.every((t, i) => {
          if (i === 0) return true;

          const prev = triggers[i - 1];

          if (t.daysFromListGeneration > prev.daysFromListGeneration) {
            return true;
          }

          if (t.daysFromListGeneration === prev.daysFromListGeneration) {
            const [h1, m1] = prev.scheduledTime.split(':').map(Number);
            const [h2, m2] = t.scheduledTime.split(':').map(Number);

            const prevMinutes = h1 * 60 + m1;
            const currMinutes = h2 * 60 + m2;

            return currMinutes - prevMinutes >= 60;
          }

          return false;
        });

        if (!isValid) {
          showError(
            'Subsequent contact triggers must be at least one hour after the preceding configured contact.'
          );
          return;
        }
      }

      dispatch(
        updateCustomerEventRulesC(
          {
            serviceCenterId: selectedSC?.id,
            eventId: eventForConfiguration?.id,
            filterRules: [...criterias, ...rules].filter(rule => rule.operator && rule.type),
            triggers: triggers.filter(trigger => trigger.scheduledTime),
          },
          handleOnSuccess
        )
      );
    }
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
            onClick={() =>
              isEditTable ? onOpenLeaveWithoutSavingModal() : setEventIdForRulesConfiguration(null)
            }
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
              justifyContent: 'space-between',
              border: '1px solid #DADADA',
              padding: '24px',
              background: '#fff',
            }}
          >
            <div style={{ display: 'flex', width: '48%', flexDirection: 'column', gap: '10px' }}>
              <AudienceForm
                criterias={criterias}
                isEditTable={isEditTable}
                setCriteria={setCriteria}
              />
              <RulesForm rules={rules} isEditTable={isEditTable} setRules={setRules} />
            </div>

            <hr
              style={{
                color: '#EAEBEE',
                backgroundColor: '#EAEBEE',
                width: '1px',
                height: 'auto',
                border: 'none',
                margin: '0px',
              }}
            />

            <div style={{ display: 'flex', width: '48%', flexDirection: 'column', gap: '10px' }}>
              <Triggers triggers={triggers} setTriggers={setTriggers} isEditTable={isEditTable} />
            </div>
          </div>
        </div>
        <LeaveWithoutSaving
          open={isOpenLeaveWithoutSavingModal}
          onClose={onCloseLeaveWithoutSavingModal}
          handleLeave={() => setEventIdForRulesConfiguration(null)}
        />
      </div>
    );
  }

  return <></>;
};

export default DealerCustomerSettings;
