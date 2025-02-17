import React, { useState, useEffect } from 'react';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { Button, Divider, Checkbox } from '@mui/material';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { Autocomplete, AutocompleteRenderOptionState } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { useStyles } from './styles';
import { ReactComponent as AttentionIcon } from '../../../../assets/img/attention.svg';
import { useAutocompleteStyles } from '../../../../hooks/styling/useAutocompleteStyles';
import DragAndDrop from '../../../../components/DragAndDrop/DragAndDrop';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { createMake, loadGlobalModels } from '../../../../store/reducers/vehicleDetails/actions';
import { useDispatch } from 'react-redux';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { IData } from '../../../../components/DragAndDrop/types';

type TAddMakeModalProps = DialogProps & {
  isEditing?: boolean;
};

const style = {
  padding: 12,
  backgroundColor: '#F7F8FB',
  border: '1px solid #DADADA',
  width: '238px',
  height: '576px',
  gap: '8px',
};

export const AddMakeModelModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TAddMakeModalProps>>
> = ({ isEditing, onClose, ...props }) => {
  const dispatch = useDispatch();
  const { currentMake, globalMakes, globalModels, makes } = useSelector(
    (state: RootState) => state.vehicleDetails
  );
  const { selectedSC } = useSCs();
  const filteredMakes = makes
    .filter(el => !el.isReadOnly)
    .map(el => ({
      id: el.id,
      text: el.name,
    }));
  const [configuredMakes, setConfiguredMakes] = useState<IData[]>(filteredMakes);
  const [makesToAdd, setMakesToAdd] = useState<IData[]>([]);
  const { classes } = useStyles();
  const autocompleteClasses = useAutocompleteStyles();
  const filteredGlobalMakes = globalMakes
    .filter(el => !el.isReadOnly)
    .map(el => ({
      id: el.id,
      text: el.vinMake,
    }));
  const autocompleteOptionsRender =
    (label: (el: any) => string) =>
    (
      props: React.HTMLAttributes<HTMLLIElement>,
      option: any,
      state: AutocompleteRenderOptionState
    ) => {
      if (option.name === 'Select All') {
        return (
          <li
            style={{ display: 'flex', alignItems: 'center' }}
            key={option + new Date()}
            {...props}
          >
            <Checkbox
              size="small"
              style={{ marginRight: 8, padding: 0 }}
              checked={filteredGlobalMakes.length === makesToAdd.length}
            />
            {label(option)}
          </li>
        );
      }
      return (
        <li style={{ display: 'flex', alignItems: 'center' }} key={option + new Date()} {...props}>
          <Checkbox size="small" style={{ marginRight: 8, padding: 0 }} checked={state.selected} />
          {label(option)}
        </li>
      );
    };
  const selectAll = { text: 'Select All', id: 0 } as IData;

  const onChange = (value: IData[]) => {
    if (value.find(el => el.text === 'Select All')) {
      setMakesToAdd(filteredGlobalMakes);
    } else {
      setMakesToAdd(value);
    }
  };

  const addMakes = () => {
    const newMakes = makesToAdd.filter(el => !configuredMakes.includes(el));
    setConfiguredMakes(prev => [...prev, ...newMakes]);
    setMakesToAdd([]);
  };

  const onSave = () => {
    if (selectedSC?.id) {
      const globalIds = [
        ...configuredMakes.map(el => el.id),
        ...globalMakes.filter(el => el.isReadOnly).map(el => el.id),
      ];
      dispatch(
        createMake({
          serviceCenterId: selectedSC?.id,
          globalIds,
        })
      );
      onClose();
    }
  };

  useEffect(() => {
    if (currentMake) {
      dispatch(loadGlobalModels(currentMake.globalId));
    }
  }, [currentMake]);

  useEffect(() => {
    const filteredMakes = makes
      .filter(el => !el.isReadOnly)
      .map(el => ({
        id: el.globalId,
        text: el.name,
      }));
    setConfiguredMakes(filteredMakes);
  }, [makes]);

  return (
    <BaseModal {...props} width={810} onClose={onClose}>
      <DialogTitle onClose={onClose}>{isEditing ? 'Edit' : 'Make options'}</DialogTitle>
      <DialogContent>
        <div className={classes.wrapper}>
          <div className={classes.firstColumnLayout}>
            <div className={classes.inputWrapper}>
              <Autocomplete
                fullWidth
                multiple
                classes={{
                  tag: autocompleteClasses.classes.tag,
                  option: autocompleteClasses.classes.option,
                  inputRoot: autocompleteClasses.classes.inputRoot,
                }}
                ChipProps={{
                  color: 'primary',
                  style: { borderRadius: 4 },
                  size: 'small',
                }}
                options={[selectAll, ...filteredGlobalMakes]}
                getOptionLabel={option => option.text}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={autocompleteOptionsRender(e => e.text)}
                onChange={(_, value) => {
                  onChange(value);
                }}
                value={makesToAdd}
                disabled={false}
                renderInput={params =>
                  autocompleteRender({
                    ...params,
                    label: 'Add Makes',
                    fullWidth: true,
                    placeholder: 'Search Makes',
                  })(params)
                }
              />
              <Button
                disabled={!makesToAdd.length}
                onClick={() => addMakes()}
                className={classes.addmakesBtn}
              >
                Add makes
              </Button>
            </div>
            <div className={classes.attentionWrapper}>
              You can drag and drop the configured makes to rearrange the order
              <br />
              that is presented in the drop-down menu on the booking flow
              <AttentionIcon />
            </div>
          </div>

          <div>
            <div className={classes.fieldTitle}>configured makes</div>
            <DragAndDrop data={configuredMakes} setData={setConfiguredMakes} style={style} />
          </div>
        </div>
      </DialogContent>
      <Divider style={{ margin: 0 }} />
      <DialogActions>
        <div className={classes.buttonsWrapper}>
          <Button onClick={onClose} className={classes.cancelButton}>
            Cancel
          </Button>
          <Button onClick={() => onSave()} className={classes.saveButton}>
            Save
          </Button>
        </div>
      </DialogActions>
    </BaseModal>
  );
};
