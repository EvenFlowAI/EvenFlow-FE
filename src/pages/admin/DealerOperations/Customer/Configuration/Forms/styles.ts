import { makeStyles } from 'tss-react/mui';

export const useFormStyles = makeStyles()(() => ({
  audienceFiltersTitle: {
    display: 'block',
    marginBottom: '24px',
    marginTop: '14px',
  },
  audienceFiltersTitleEmpty: {
    marginBottom: '4px',
  },
  criteriaTypeAutocomplete: {
    width: '52%',
  },
  criteriaOperatorAutocomplete: {
    width: '25%',
  },
  removeCriteriaIconCompact: {
    marginTop: 0,
  },
  disabledAddButtonText: {
    color: 'grey',
  },
  triggersTitleWithItems: {
    display: 'block',
    marginBottom: '24px',
  },
  emptyTriggersState: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  emptyTriggersStateText: {
    fontSize: '16px',
    color: '#252733',
  },
  listGeneratedInfo: {
    padding: '8px 16px',
    border: '1px solid #DADADA',
    marginBottom: '16px',
    marginTop: '12px',
    display: 'flex',
    gap: '12px',
    flexDirection: 'column',
  },
  listGeneratedLabel: {
    margin: 0,
    color: '#5E5F66',
    textTransform: 'uppercase',
    fontWeight: 700,
  },
  listGeneratedValue: {
    margin: 0,
    textTransform: 'uppercase',
    color: '#252733',
    fontWeight: 700,
  },
  triggerItemWrapperWithPadding: {
    padding: '16px',
  },
  removeTriggerButton: {
    cursor: 'pointer',
  },
  triggerControlsRow: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  triggerDaysFieldRecall: {
    width: '214px',
  },
  triggerClockFieldRecall: {
    width: '150px',
  },
  scheduledTimeInput: {
    width: '140px',
  },
  recallTriggerStats: {
    width: '100%',
    color: '#252733',
  },
  recallTriggerStatsDate: {
    display: 'block',
    marginBottom: '12px',
  },
  recallTriggerStatsCounters: {
    display: 'flex',
    gap: '35px',
    alignItems: 'center',
  },
  recallTriggerStatsCounter: {
    fontWeight: 700,
  },
}));
