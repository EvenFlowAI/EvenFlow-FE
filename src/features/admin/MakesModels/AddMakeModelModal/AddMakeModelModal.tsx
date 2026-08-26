import React from 'react';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { Button, Divider } from '@mui/material';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { useStyles } from './styles';
import { ReactComponent as AttentionIcon } from '../../../../assets/img/attention.svg';
import DragAndDrop from '../../../../components/DragAndDrop/DragAndDrop';
import { MakeCodesConfiguration } from '../MakeCodesConfiguration/MakeCodesConfiguration';
import { SystemIntegrationType } from '../../../../store/reducers/serviceCenters/types';
import MakeModelInput from './MakeModelInput';
import ModelCodesConfiguration from '../ModelCodesConfiguration/ModelCodesConfiguration';
import { useAddMakeModelModal } from './useAddMakeModelModal';

type TAddMakeModalProps = DialogProps & {
  isEditing?: boolean;
};

export const AddMakeModelModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TAddMakeModalProps>>
> = ({ isEditing, onClose, ...props }) => {
  const { classes } = useStyles();
  const state = useAddMakeModelModal({ onClose });

  return (
    <BaseModal {...props} width={860} height={770} onClose={state.onCloseModal}>
      <DialogTitle onClose={state.onCloseModal}>
        {isEditing ? `${state.currentMake?.name} Model Options` : 'Make options'}
      </DialogTitle>
      <DialogContent>
        <div className={classes.wrapper}>
          <div className={classes.firstColumnLayout}>
            <MakeModelInput
              configuredModels={state.configuredModels}
              configuredMakes={state.configuredMakes}
              setConfiguredMakes={state.setConfiguredMakes}
              setConfiguredModels={state.setConfiguredModels}
              isEditing={isEditing}
              makesToAdd={state.makesToAdd}
              modelsToAdd={state.modelsToAdd}
              setMakesToAdd={state.setMakesToAdd}
              setModelsToAdd={state.setModelsToAdd}
            />
            <div className={classes.attentionWrapper}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ margin: 0 }}>
                  You can drag and drop the configured {isEditing ? 'models' : 'makes'} to rearrange
                  the
                  <br />
                  order that is presented in the drop-down menu on the booking flow
                </p>
                {state.selectedSC?.integration === SystemIntegrationType.Fortellis ? (
                  <p style={{ margin: 0 }}>
                    Click <span style={{ fontWeight: 'bold' }}>Next</span> to configure the
                    corresponding{' '}
                    <span style={{ fontWeight: 'bold' }}>
                      CDK {isEditing ? 'Model' : 'Make'} Codes.
                    </span>
                  </p>
                ) : null}
              </div>
              <AttentionIcon />
            </div>
          </div>

          <div>
            <div className={classes.fieldTitle}>
              {isEditing ? 'configured models' : 'configured makes'}
            </div>
            <DragAndDrop
              currentMake={state.currentMake}
              isEditing={isEditing}
              data={isEditing ? state.configuredModels : state.configuredMakes}
              setData={isEditing ? state.setConfiguredModels : state.setConfiguredMakes}
            />
          </div>
        </div>
      </DialogContent>
      <Divider style={{ margin: 0 }} />
      <DialogActions>
        <div className={classes.buttonsWrapper}>
          <Button onClick={state.onCloseModal} className={classes.cancelButton}>
            Cancel
          </Button>
          <Button
            onClick={() => (isEditing ? state.handleSaveModels() : state.handleSaveMakes())}
            className={classes.saveButton}
          >
            {state.selectedSC?.integration === SystemIntegrationType.Fortellis ? 'Next' : 'Save'}
          </Button>
        </div>
      </DialogActions>
      <MakeCodesConfiguration
        onClose={state.onCloseConfigurationModal}
        open={state.isOpenConfigurationModal}
        configuredMakes={state.configuredMakes}
        setConfiguredMakes={state.setConfiguredMakes}
        onSaveMakes={state.onSaveMakes}
      />
      <ModelCodesConfiguration
        onClose={state.onCloseModelConfigurationModal}
        open={state.isOpenModelConfigurationModal}
        configuredModels={state.configuredModels}
        setConfiguredModels={state.setConfiguredModels}
        onSaveModels={state.onSaveModels}
      />
    </BaseModal>
  );
};
