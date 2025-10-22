import React from 'react';
import { Button } from '@mui/material';
import { useStyles } from '../styles';
import { DialogActions } from '../../../../../components/modals/BaseModal/BaseModal';
import { patchUpdateTransportationRule } from '../../../../../store/reducers/transportationNeeds/actions';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import { useDispatch, useSelector } from 'react-redux';
import { useMessage } from '../../../../../hooks/useMessage/useMessage';
import { RootState } from '../../../../../store/rootReducer';
import { ITransportationOptionFull } from '../../../../../store/reducers/transportationNeeds/types';

interface IModalButtons {
  onCancel: () => void;
  editingElement: ITransportationOptionFull | null;
  onError: (error: string) => void;
}

const ModalButtons = ({ onCancel, editingElement, onError }: IModalButtons) => {
  const { classes } = useStyles();
  const { selectedSC } = useSCs();
  const { rules } = useSelector((state: RootState) => state.serviceRequests);
  const dispatch = useDispatch();
  const showMessage = useMessage();

  const patchUpdateRule = () => {
    if (selectedSC && editingElement && rules.length) {
      const rulesWithId = rules.filter(rule => rule.id);
      if (rulesWithId.length) {
        dispatch(
          patchUpdateTransportationRule(
            selectedSC.id,
            rulesWithId.map(rule => {
              return {
                transportationOptionRuleId: rule.id || 0,
                state: rule.state,
                orderIndex: rule.orderIndex,
              };
            }),
            () => {
              showMessage('Rules updated');
              onCancel();
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
          <Button onClick={onCancel} className={classes.cancelButton}>
            Cancel
          </Button>
          <Button onClick={patchUpdateRule} className={classes.saveButton}>
            Save
          </Button>
        </div>
      </div>
    </DialogActions>
  );
};

export default ModalButtons;
