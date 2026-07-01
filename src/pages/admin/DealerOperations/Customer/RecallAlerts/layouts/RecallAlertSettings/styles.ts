import { makeStyles } from 'tss-react/mui';

export const useRecallAlertSettingsStyles = makeStyles()(() => ({
  divider: {
    color: '#EAEBEE',
    height: '1px',
    width: '100%',
    opacity: '0.3',
    margin: 0,
  },
  audienceForm: {
    marginRight: '25px',
  },
  triggers: {
    width: '100%',
    marginLeft: '25px',
  },
  affectedModelsContainer: {
    marginRight: '25px',
    border: '1px solid #DADADA',
    borderRadius: '4px',
    marginBottom: 0,
    maxHeight: '320px',
    overflow: 'hidden',
  },
  affectedModelsWrapper: {
    marginBottom: '24px',
  },
  uploadCsvHintText: {
    marginTop: '4px',
    fontSize: '14px',
    fontWeight: 300,
    color: '#000000',
  },
  affectedModelsHeader: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    color: '#252733',
    justifyContent: 'space-between',
    borderBottom: '1px solid #DADADA',
  },
  affectedModelsTitle: {
    fontSize: '16px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  affectedModelsSelected: {
    fontSize: '16px',
  },
  affectedModelsBody: {
    maxHeight: 'calc(320px - 65px)',
    overflowY: 'auto',
  },
  emptyAffectedModels: {
    padding: '12px 16px',
    color: '#252733',
  },
  makeRow: {
    padding: '9px 16px',
    fontSize: '14px',
    color: '#252733',
    background: '#F3F5FA',
    borderBottom: '1px solid #DADADA',
  },
  modelRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 120px 120px',
    borderBottom: '1px solid #DADADA',
    color: '#52586B',
    minHeight: '40px',
  },
  modelNameCell: {
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#252733',
    fontWeight: 600,
  },
  modelYearCell: {
    padding: '10px 12px',
    borderLeft: '1px solid #DADADA',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
  },
  modelVehicleCountCell: {
    padding: '10px 12px',
    borderLeft: '1px solid #DADADA',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
  },
  modelCheckbox: {
    color: '#252733',
    padding: 0,
    marginRight: '2px',
  },
}));
