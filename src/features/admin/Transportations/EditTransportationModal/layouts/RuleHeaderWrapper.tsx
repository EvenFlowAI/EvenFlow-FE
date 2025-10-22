import React from 'react';
import { Button, IconButton, Switch, Tooltip } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useStyles } from '../styles';
import { ReactComponent as DotsIcon } from '../../../../../assets/img/dots.svg';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import { setRules } from '../../../../../store/reducers/serviceRequests/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { useException } from '../../../../../hooks/useException/useException';
import { TRuleState } from '../helper';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

interface IRuleHeaderWrapper {
  dragHandleProps: DraggableProvidedDragHandleProps | null;
  rule: TRuleState;
  updateLocalRule: (index: number, rule: Partial<TRuleState>) => void;
  index: number;
  onOpen: () => void;
  setRuleForDeleting: (rule: TRuleState | null) => void;
}

const RuleHeaderWrapper = ({
  dragHandleProps,
  rule,
  updateLocalRule,
  index,
  onOpen,
  setRuleForDeleting,
}: IRuleHeaderWrapper) => {
  const { classes } = useStyles();
  const { selectedSC } = useSCs();
  const { rules } = useSelector((state: RootState) => state.serviceRequests);
  const dispatch = useDispatch();
  const showError = useException();

  const removeRule = (id: string) => {
    if (selectedSC?.id) {
      setRuleForDeleting(rules.find(rule => rule?.id === +id) || null);
      onOpen();
    }
  };

  const removeLocalRule = (index: number) => {
    dispatch(setRules(rules.filter((_, i) => i !== index)));
  };

  const toggleExpand = (index: number) => {
    const expandedIndex = rules.findIndex(rule => rule.expanded);
    if (rules[expandedIndex]?.dirty) {
      showError('Please save or cancel changes before expanding another rule');
      return;
    }
    dispatch(
      setRules(
        rules.map((r, i) => ({
          ...r,
          expanded: i === index ? !r.expanded : false,
        }))
      )
    );
  };

  return (
    <div {...dragHandleProps} className={classes.ruleHeaderWrapper}>
      <div className={classes.leftSideHeaderWrapper}>
        <Tooltip
          placement="top-start"
          title="Drag to Reorder"
          slotProps={{
            tooltip: {
              sx: {
                background: 'white',
                color: 'black',
                fontSize: '19px',
                boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
              },
            },
          }}
        >
          <DotsIcon />
        </Tooltip>
        <Switch
          checked={rule.state === 1}
          disabled={!rule.id || rule.expanded}
          onChange={e => updateLocalRule(index, { state: e.target.checked ? 1 : 0 })}
          size="small"
          onClick={e => e.stopPropagation()}
        />

        <span className={classes.ruleName}>
          {rule.name?.toUpperCase() || `RULE NAME #${index + 1}`}
        </span>
      </div>

      <div className={classes.rightSideHeaderWrapper}>
        {rule.id && (
          <Button
            variant="outlined"
            color="error"
            size="medium"
            onClick={e => {
              e.stopPropagation();
              rule.id ? removeRule(String(rule.id)) : removeLocalRule(index);
            }}
            className={classes.deleteButton}
          >
            Delete Rule
          </Button>
        )}
        <IconButton
          disabled={rule.expanded}
          onClick={e => {
            e.stopPropagation();
            toggleExpand(index);
          }}
          size="small"
        >
          {rule.expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </div>
    </div>
  );
};

export default RuleHeaderWrapper;
