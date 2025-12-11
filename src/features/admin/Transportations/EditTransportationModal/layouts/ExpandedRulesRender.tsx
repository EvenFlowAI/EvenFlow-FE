import React, { Dispatch, SetStateAction } from 'react';
import { DialogActions } from '../../../../../components/modals/BaseModal/BaseModal';
import { Button } from '@mui/material';
import { setFormIsChecked, setRules } from '../../../../../store/reducers/serviceRequests/actions';
import { useStyles } from '../styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import {
  buildTransportationRulePayload,
  buildTransportationRulePayloadById,
  getOriginalRuleState,
  TRuleState,
} from '../helper';
import {
  addTransportationOptionRule,
  editTransportationOptionRule,
} from '../../../../../store/reducers/transportationNeeds/actions';
import { useMessage } from '../../../../../hooks/useMessage/useMessage';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import { TOption } from '../../types';
import { ITransportationOptionFull } from '../../../../../store/reducers/transportationNeeds/types';

interface IExpandedRulesRender {
  rule: TRuleState;
  dayOFWeekOptions: TOption[];
  filterModeOptions: TOption[];
  editingElement: ITransportationOptionFull | null;
  index: number;
  setErrors: Dispatch<SetStateAction<string[]>>;
  onError: (error: string) => void;
}

const ExpandedRulesRender = ({
  rule,
  dayOFWeekOptions,
  filterModeOptions,
  editingElement,
  index,
  setErrors,
  onError,
}: IExpandedRulesRender) => {
  const { classes } = useStyles();
  const { selectedSC } = useSCs();
  const { rules } = useSelector((state: RootState) => state.serviceRequests);
  const dispatch = useDispatch();
  const showMessage = useMessage();

  const resetRulesToDefaultState = () => {
    dispatch(
      setRules(
        rules.map(r => ({
          ...r,
          dirty: false,
          expanded: false,
        }))
      )
    );
  };

  const resetRuleToOriginal = (ruleIndex: number) => {
    if (!editingElement || !editingElement.rules) return;

    const resetRule = getOriginalRuleState(
      editingElement,
      ruleIndex,
      dayOFWeekOptions,
      filterModeOptions
    );
    if (!resetRule) return;

    dispatch(setRules(rules.map((rule, idx) => (idx === ruleIndex ? resetRule : rule))));
  };

  const onEditRule = (id: number) => {
    dispatch(setFormIsChecked(true));
    if (selectedSC && editingElement) {
      const newRule = buildTransportationRulePayloadById(rules, id, editingElement);

      if (newRule) {
        dispatch(
          editTransportationOptionRule(
            selectedSC.id,
            newRule,
            id,
            () => {
              dispatch(setFormIsChecked(false));
              showMessage('Rule updated');
              resetRulesToDefaultState();
            },
            onError
          )
        );
      }
    }
  };

  const onAddRule = (ruleIndex: number) => {
    dispatch(setFormIsChecked(true));
    if (selectedSC && editingElement) {
      const newRule = buildTransportationRulePayload(rules, ruleIndex, editingElement);

      if (newRule) {
        dispatch(
          addTransportationOptionRule(
            selectedSC.id,
            newRule,
            () => {
              dispatch(setFormIsChecked(false));
              showMessage('Created new rule');
              resetRulesToDefaultState();
            },
            onError
          )
        );
      }
    }
  };

  return (
    <DialogActions>
      <div className={classes.actionsWrapper}>
        <div className={classes.buttonsWrapper}>
          <Button
            onClick={() => {
              if (rule.id) {
                resetRulesToDefaultState();
                resetRuleToOriginal(index);
              } else {
                dispatch(setRules(rules.filter((_, idx) => idx !== index)));
              }
              dispatch(setFormIsChecked(false));
              setErrors([]);
            }}
            className={classes.cancelButton}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (rule.id) {
                onEditRule(rule.id);
              } else {
                onAddRule(index);
              }
              setErrors([]);
            }}
            className={classes.saveButton}
            disabled={!rule.dirty}
          >
            Save
          </Button>
        </div>
      </div>
    </DialogActions>
  );
};

export default ExpandedRulesRender;
