import React, { SyntheticEvent } from 'react';
import { Autocomplete } from '@mui/material';
import { DialogContent } from '../../../../components/modals/BaseModal/BaseModal';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { FileInput } from '../../../../components/formControls/FileInput/FileInput';
import { IIconState } from '../../ServiceCategories/AddServiceCategoryModal/types';
import { TOption } from '../../../../types/types';
import { EServiceType } from '../../../../store/reducers/appointmentFrameReducer/types';
import { ITransportationOptionFull } from '../../../../store/reducers/transportationNeeds/types';
import { getTransportationOptionString } from '../../../../utils/utils';

type TProps = {
  classNames: {
    inputsWrapper: string;
    twoInputsWrapper: string;
  };
  editingIconPath?: string;
  fileState: IIconState;
  setFileState: React.Dispatch<React.SetStateAction<IIconState>>;
  formIsChecked: boolean;
  firstScreenOptionName: string;
  selectedServiceType: TOption | null;
  orderIndex: string;
  enabledTransportationOptions: ITransportationOptionFull[];
  defaultTransportation: ITransportationOptionFull | null;
  isPickUpDropOffType: boolean;
  isTransportationDisabled: boolean;
  externalLink: string;
  description: string;
  note: string;
  taglineText: string;
  taglineColor: string;
  serviceTypeOptions: TOption[];
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onServiceTypeChange: (e: SyntheticEvent, value: TOption | null) => void;
  onOrderIndexChange: (e: SyntheticEvent, value: string) => void;
  onTransportationChange: (e: SyntheticEvent, value: ITransportationOptionFull | null) => void;
  onLinkChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNoteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTaglineTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTaglineColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const AddFirstScreenOptionModalForm: React.FC<TProps> = ({
  classNames,
  editingIconPath,
  fileState,
  setFileState,
  formIsChecked,
  firstScreenOptionName,
  selectedServiceType,
  orderIndex,
  enabledTransportationOptions,
  defaultTransportation,
  isPickUpDropOffType,
  isTransportationDisabled,
  externalLink,
  description,
  note,
  taglineText,
  taglineColor,
  serviceTypeOptions,
  onNameChange,
  onServiceTypeChange,
  onOrderIndexChange,
  onTransportationChange,
  onLinkChange,
  onDescriptionChange,
  onNoteChange,
  onTaglineTextChange,
  onTaglineColorChange,
}) => {
  return (
    <DialogContent>
      <div className={classNames.inputsWrapper}>
        <div>
          <TextField
            fullWidth
            label="Option Name"
            placeholder="Type Option Name"
            error={formIsChecked && !firstScreenOptionName}
            onChange={onNameChange}
            value={firstScreenOptionName}
          />
        </div>
        <Autocomplete
          options={serviceTypeOptions}
          isOptionEqualToValue={option => option.value === selectedServiceType?.value}
          getOptionLabel={o => o.name}
          value={selectedServiceType}
          onChange={onServiceTypeChange}
          renderInput={autocompleteRender({
            label: 'Booking Flow Config',
            placeholder: 'Select Booking Flow Config',
          })}
        />
        <FileInput
          setState={setFileState}
          label={`${fileState.file || editingIconPath ? 'Update' : 'Upload'} Option Icon`}
        />
        <Autocomplete
          disableClearable
          options={['1', '2', '3', '4', '5', '6', '7', '8']}
          value={orderIndex}
          isOptionEqualToValue={(o, v) => o === v}
          onChange={onOrderIndexChange}
          renderInput={autocompleteRender({
            label: 'Order Index for Booking Flow',
            placeholder: 'Select Order Index',
            error: !orderIndex?.length && formIsChecked,
          })}
        />
        <Autocomplete
          disableClearable={isPickUpDropOffType}
          options={enabledTransportationOptions}
          isOptionEqualToValue={option => option.id === defaultTransportation?.id}
          getOptionLabel={o => getTransportationOptionString(o.type.toString())}
          value={defaultTransportation}
          onChange={onTransportationChange}
          disabled={isTransportationDisabled}
          renderInput={autocompleteRender({
            label: 'Default Transportation Option',
            placeholder: 'Select Transportation Option',
          })}
        />
        <div>
          <TextField
            fullWidth
            label="External Link"
            placeholder="Type External Link"
            disabled={selectedServiceType?.value !== EServiceType.General.toString()}
            onChange={onLinkChange}
            value={externalLink}
          />
        </div>
      </div>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={description}
        style={{ marginBottom: 20 }}
        label="Option Description"
        placeholder="Enter Description"
        onChange={onDescriptionChange}
      />
      <TextField
        fullWidth
        multiline
        rows={1}
        value={note}
        label="Option Note for Confirmation Screen"
        placeholder="Enter Note"
        onChange={onNoteChange}
      />
      <div className={classNames.twoInputsWrapper}>
        <div>
          <TextField
            fullWidth
            value={taglineText}
            label="Tagline Text"
            placeholder="Enter Tagline Text"
            onChange={onTaglineTextChange}
          />
        </div>
        <div>
          <TextField
            fullWidth
            value={taglineColor}
            inputProps={{ maxLength: 6 }}
            label="Tagline Font Color hex #"
            placeholder="Enter Tagline Font Color (6 symbols)"
            onChange={onTaglineColorChange}
          />
        </div>
      </div>
    </DialogContent>
  );
};
