import React from 'react';
import { useDispatch } from 'react-redux';
import { DragDropContext } from '@hello-pangea/dnd';
import { Button } from '@mui/material';
import {
  BaseModal,
  DialogActions,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { updateRecallGrouping } from '../../../../store/reducers/recall/actions';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useRecallGroupingStyles } from './styles';
import { EGroupingPanel, TRecallGroupingModalProps } from './types';
import { useRecallGrouping } from './useRecallGrouping';
import { buildGroupingPayload } from './helpers';
import { SplitPanel } from './SplitPanel';
import { RegroupPanel } from './RegroupPanel';
import { GroupBlock } from './GroupBlock';
import { ReactComponent as Split } from '../../../../assets/img/Split.svg';
import { ReactComponent as Reset } from '../../../../assets/img/reset.svg';
import { ReactComponent as PlusCircle } from '../../../../assets/img/plus_circle.svg';
import { ReactComponent as ResetBlue } from '../../../../assets/img/resetBlue.svg';

const RecallGroupingModal: React.FC<React.PropsWithChildren<TRecallGroupingModalProps>> = ({
  recall,
  open,
  onClose,
}) => {
  const { classes, cx } = useRecallGroupingStyles();
  const dispatch = useDispatch();
  const showError = useException();
  const { selectedSC } = useSCs();
  const {
    groups,
    selectedIds,
    panel,
    togglePanel,
    closePanel,
    addGroup,
    deleteGroup,
    toggleItem,
    split,
    merge,
    onDragEnd,
  } = useRecallGrouping(recall, open);

  const campaign = recall?.recallCampaignNumber || recall?.oemProgram || '';
  const hasItems = groups.some(group => group.items.length);

  const onSave = () => {
    if (!recall || !selectedSC) return;
    if (!hasItems) {
      showError('Recall must contain at least one record');
      return;
    }
    dispatch(
      updateRecallGrouping(
        recall.id,
        buildGroupingPayload(groups, selectedSC.id),
        showError,
        onClose
      )
    );
  };

  return (
    <BaseModal open={open} onClose={onClose} width={780}>
      <div>
        <DialogTitle onClose={onClose}>Recall Groupings for Campaign {campaign}</DialogTitle>
        <div className={classes.content}>
          <div className={classes.toolbar}>
            <Button
              color="primary"
              size="small"
              className={classes.toolbarButton}
              startIcon={<PlusCircle />}
              onClick={addGroup}
            >
              Add Group
            </Button>
            <Button
              color="primary"
              size="small"
              className={cx(
                classes.toolbarButton,
                panel === EGroupingPanel.Split && classes.toolbarButtonActive
              )}
              startIcon={<Split fontSize="small" />}
              disabled={!hasItems}
              onClick={() => togglePanel(EGroupingPanel.Split)}
            >
              Split
            </Button>
            <Button
              color="primary"
              size="small"
              className={cx(
                classes.toolbarButton,
                panel === EGroupingPanel.Regroup && classes.toolbarButtonActive
              )}
              startIcon={groups.length < 2 ? <Reset /> : <ResetBlue />}
              disabled={groups.length < 2}
              onClick={() => togglePanel(EGroupingPanel.Regroup)}
            >
              Regroup
            </Button>
          </div>

          {panel === EGroupingPanel.Split && <SplitPanel onClose={closePanel} onSplit={split} />}
          {panel === EGroupingPanel.Regroup && (
            <RegroupPanel onClose={closePanel} onRegroup={merge} />
          )}

          <div className={classes.header}>
            <div className={classes.headerGroupCell}>Drag records to group</div>
            <div className={classes.headerRow}>
              <span />
              <span />
              <span>Make</span>
              <span>Model</span>
              <span>Year</span>
              <span>Op Code</span>
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            {groups.map((group, index) => (
              <GroupBlock
                key={group.key}
                group={group}
                index={index}
                selectedIds={selectedIds}
                canDelete={groups.length > 1}
                onToggleItem={toggleItem}
                onDelete={deleteGroup}
              />
            ))}
          </DragDropContext>
        </div>
        <DialogActions>
          <div className={classes.actionsWrapper}>
            <Button onClick={onClose} color="info">
              Close
            </Button>
            <Button onClick={onSave} className={classes.saveButton}>
              Save
            </Button>
          </div>
        </DialogActions>
      </div>
    </BaseModal>
  );
};

export default RecallGroupingModal;
