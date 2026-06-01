import React, { useState } from 'react';
import {
  dealerOperationsCustomer,
  dealerOperationsRoot,
} from '../../../../../../../utils/constants';
import { TitleContainerForDealerOperation } from '../../../../../../../components/wrappers/TitleContainer/TitleContainer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store/rootReducer';
import {
  setSelectedRecallAlert,
  updateRecallAlert,
} from '../../../../../../../store/reducers/recall/actions';
import { useStyles } from '../../../../styles';
import { Button } from '@mui/material';
import { ReactComponent as ArrowLeft } from '../../../../../../../assets/img/arrow-left.svg';
import { useModal } from '../../../../../../../hooks/useModal/useModal';
import LeaveWithoutSaving from '../../../../../../../components/modals/admin/LeaveWithoutSaving/LeaveWithoutSaving';
import { Loading } from '../../../../../../../components/wrappers/Loading/Loading';
import RecallAlertAudience from './RecallAlertAudience';
import { IRecallAlert } from '../../../../../../../store/reducers/recall/types';
import { useSCs } from '../../../../../../../hooks/useSCs/useSCs';

const RecallAlertSettings: React.FC = () => {
  const { selectedRecallAlert } = useSelector((state: RootState) => state.recalls);
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const [isEditTable, setIsEditTable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updatedRecallAlert, setUpdatedRecallAlert] = React.useState<IRecallAlert | null>(null);
  const { selectedSC } = useSCs();

  const {
    onOpen: onOpenLeaveWithoutSavingModal,
    onClose: onCloseLeaveWithoutSavingModal,
    isOpen: isOpenLeaveWithoutSavingModal,
  } = useModal();

  const handleCancelChanges = () => {
    setIsLoading(false);
    setIsEditTable(false);
    setUpdatedRecallAlert(selectedRecallAlert);
  };

  const validateChangesBeforeSave = () => {
    if (updatedRecallAlert && selectedSC) {
      dispatch(
        updateRecallAlert(
          {
            serviceCenterId: selectedSC.id,
            recallCampaignId: updatedRecallAlert.recallCampaignId,
            id: updatedRecallAlert.id,
            listType: updatedRecallAlert.listType,
          },
          () => {
            setIsEditTable(false);
          },
          () => {}
        )
      );
    }
  };

  if (!selectedRecallAlert) return null;

  return (
    <div className={classes.settingsContainer}>
      <TitleContainerForDealerOperation
        title={`${selectedRecallAlert.name}`}
        pad
        parent={dealerOperationsCustomer}
        secondParent={dealerOperationsRoot}
        actions={() => dispatch(setSelectedRecallAlert(null))}
      />

      <div className={classes.backButton}>
        <Button
          variant="text"
          className={classes.backWrapper}
          onClick={() =>
            isEditTable ? onOpenLeaveWithoutSavingModal() : dispatch(setSelectedRecallAlert(null))
          }
        >
          <ArrowLeft />
          <span>Back to Recall Alerts</span>
        </Button>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className={classes.editButtonsWrapper}>
          <div className={classes.tableWrapper}>
            {isEditTable ? (
              <>
                <Button variant="text" onClick={handleCancelChanges} color="secondary">
                  Cancel
                </Button>
                <Button variant="text" onClick={validateChangesBeforeSave}>
                  Save
                </Button>
              </>
            ) : (
              <Button variant="text" onClick={() => setIsEditTable(true)}>
                Edit
              </Button>
            )}
          </div>

          <div className={classes.settingsBlock}>
            <div className={classes.audienceWrapper}>
              <RecallAlertAudience
                isEditTable={isEditTable}
                updatedRecallAlert={updatedRecallAlert}
                setUpdatedRecallAlert={setUpdatedRecallAlert}
              />
            </div>
          </div>
        </div>
      )}

      <LeaveWithoutSaving
        open={isOpenLeaveWithoutSavingModal}
        onClose={onCloseLeaveWithoutSavingModal}
        handleLeave={() => dispatch(setSelectedRecallAlert(null))}
      />
    </div>
  );
};

export default RecallAlertSettings;
