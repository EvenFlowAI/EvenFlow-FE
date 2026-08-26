import React from 'react';
import { AddCircleOutline } from '@mui/icons-material';
import { Autocomplete, Button, DialogContent, IconButton } from '@mui/material';
import Checkbox from '../../../../components/formControls/Checkbox/Checkbox';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { ECustomerCriteria, IPackageByQuery } from '../../../../api/types';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import {
  IAssignedServiceRequest,
  IServiceRequest,
} from '../../../../store/reducers/serviceRequests/types';
import { IEngineType } from '../../../../store/reducers/vehicleDetails/types';
import { TAssignedRequest } from '../../../../store/reducers/packages/types';
import EngineTypes from './parts/EngineTypes/EngineTypes';
import Mileage from './parts/Mileage/Mileage';
import MakeAndModel from './parts/MakeAndModel/MakeAndModel';
import OpsCode from './parts/OpsCodeLabel/OpsCodeLabel';
import PackageLabel from './parts/PackageLabel/PackageLabel';
import AssignedOpsCodes from './parts/AssignedOpsCodes/AssignedOpsCodes';
import { criteriaOptions, yearOptions } from './constants';
import { IVehiclesData } from './types';

type TClassNames = {
  contentWrapper: string;
  fullWidth: string;
  addExisting: string;
  iconPlus: string;
  label: string;
  opsCodesWrapper: string;
  errorOpsCodes: string;
  emptyOpsCodes: string;
  wideButton: string;
  btnsWrapper: string;
  applyRulesWrapper: string;
  checkbox: string;
  applyText: string;
  twoFieldsWrapper: string;
};

type TProps = {
  classes: TClassNames;
  autoCompleteClasses: Record<string, string>;
  packageName: string;
  formIsChecked: boolean;
  selectedPackages: number[];
  packages: IPackageByQuery[];
  assignedOpsCodes: TAssignedRequest[];
  opsCodes: IAssignedServiceRequest[];
  isApplyBusinessRules: boolean;
  selectedMakes: number[];
  selectedModels: number[];
  selectedMileages: string[];
  vehiclesData: IVehiclesData;
  selectedEngineTypes: IEngineType[];
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPackageDelete: (pack: IPackageByQuery) => void;
  onExistingOpen: () => void;
  onAssignOpsCodeOpen: () => void;
  onDelete: (serviceRequest: IServiceRequest) => void;
  onAddOpsCodeOpen: () => void;
  onUpsellOpen: () => void;
  onComplimentaryOpen: () => void;
  onApplyBusinessRulesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedMakes: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectedModels: React.Dispatch<React.SetStateAction<number[]>>;
  setFormIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMileages: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedEngineTypes: React.Dispatch<React.SetStateAction<IEngineType[]>>;
  onFormFieldChange: (
    fieldName: keyof IVehiclesData
  ) => (_e: React.SyntheticEvent, value: string[] | string | null) => void;
};

export const AddPackageModalContent: React.FC<TProps> = ({
  classes,
  autoCompleteClasses,
  packageName,
  formIsChecked,
  selectedPackages,
  packages,
  assignedOpsCodes,
  opsCodes,
  isApplyBusinessRules,
  selectedMakes,
  selectedModels,
  selectedMileages,
  vehiclesData,
  selectedEngineTypes,
  onNameChange,
  onPackageDelete,
  onExistingOpen,
  onAssignOpsCodeOpen,
  onDelete,
  onAddOpsCodeOpen,
  onUpsellOpen,
  onComplimentaryOpen,
  onApplyBusinessRulesChange,
  setSelectedMakes,
  setSelectedModels,
  setFormIsChecked,
  setSelectedMileages,
  setSelectedEngineTypes,
  onFormFieldChange,
}) => {
  const opsCodeListClass = (itemsCount: number) =>
    itemsCount
      ? classes.opsCodesWrapper
      : formIsChecked
        ? classes.errorOpsCodes
        : classes.emptyOpsCodes;

  return (
    <DialogContent>
      <div className={classes.contentWrapper}>
        <div className={classes.fullWidth}>
          <TextField
            label="Maintenance Package Name"
            placeholder="Type Package Name"
            error={!packageName && formIsChecked}
            onChange={onNameChange}
            value={packageName}
          />
        </div>

        {selectedPackages.map(item => {
          const pack = packages.find(el => el.id === item);
          return pack ? (
            <PackageLabel pack={pack} onDelete={onPackageDelete} key={pack.name} />
          ) : null;
        })}

        <div className={classes.addExisting}>
          <IconButton onClick={onExistingOpen} className={classes.iconPlus} size="large">
            <AddCircleOutline />
          </IconButton>
          <span> Add Existing Maintenance Package</span>
        </div>

        <div className={classes.label}>Assigned Op Codes</div>
        <div className={opsCodeListClass(assignedOpsCodes?.length)}>
          {assignedOpsCodes?.length ? (
            <AssignedOpsCodes codes={assignedOpsCodes} />
          ) : (
            <p>There are no Op Codes in this list yet</p>
          )}
        </div>

        <Button
          className={classes.wideButton}
          color="primary"
          style={{ width: '100%' }}
          onClick={onAssignOpsCodeOpen}
        >
          Assign Op Code To Package
        </Button>

        <div className={classes.label}>Op Codes</div>
        <div className={opsCodeListClass(opsCodes?.length)}>
          {opsCodes?.length ? (
            opsCodes.map((item, index) => (
              <OpsCode
                serviceRequest={item.serviceRequest}
                onDelete={onDelete}
                key={`${item.serviceRequest.id}+${index}`}
              />
            ))
          ) : (
            <p>There are no Op Codes in this list yet</p>
          )}
        </div>

        <div className={classes.btnsWrapper}>
          <Button color="primary" className={classes.wideButton} onClick={onAddOpsCodeOpen}>
            Add Op Codes
          </Button>
          <Button color="primary" className={classes.wideButton} onClick={onUpsellOpen}>
            Add Interval Upsell
          </Button>
          <Button color="primary" className={classes.wideButton} onClick={onComplimentaryOpen}>
            Add Complimentary
          </Button>
        </div>

        <div className={classes.applyRulesWrapper}>
          <Checkbox
            className={classes.checkbox}
            color="primary"
            checked={isApplyBusinessRules}
            onChange={onApplyBusinessRulesChange}
          />
          <span className={classes.applyText}>Apply Business Rules To Package</span>
        </div>

        <MakeAndModel
          selectedMakes={selectedMakes}
          selectedModels={selectedModels}
          setSelectedMakes={setSelectedMakes}
          setSelectedModels={setSelectedModels}
          setFormIsChecked={setFormIsChecked}
          disabled={!isApplyBusinessRules}
        />
        <Mileage
          disabled={!isApplyBusinessRules}
          selectedMileages={selectedMileages}
          setFormIsChecked={setFormIsChecked}
          setSelectedMileages={setSelectedMileages}
        />
        <div style={{ marginBottom: 16 }}>
          <div className={classes.label}>Vehicle Year</div>
          <div className={classes.twoFieldsWrapper}>
            <Autocomplete
              disabled={!isApplyBusinessRules}
              classes={autoCompleteClasses}
              options={yearOptions}
              disableCloseOnSelect
              isOptionEqualToValue={(option, value) => option.toLowerCase() === value.toLowerCase()}
              value={vehiclesData?.yearFrom}
              onChange={onFormFieldChange('yearFrom')}
              renderInput={autocompleteRender({ label: '', placeholder: 'From' })}
            />
            <Autocomplete
              disabled={!isApplyBusinessRules}
              classes={autoCompleteClasses}
              options={yearOptions}
              disableCloseOnSelect
              isOptionEqualToValue={(option, value) => option.toLowerCase() === value.toLowerCase()}
              value={vehiclesData?.yearTo}
              onChange={onFormFieldChange('yearTo')}
              renderInput={autocompleteRender({ label: '', placeholder: 'To' })}
            />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Autocomplete
            classes={autoCompleteClasses}
            disableClearable
            options={criteriaOptions}
            isOptionEqualToValue={(option, value) => option === value}
            disabled={!isApplyBusinessRules}
            value={
              vehiclesData?.customerCriteria
                ? ECustomerCriteria[vehiclesData.customerCriteria].toString()
                : ECustomerCriteria[ECustomerCriteria.Any]
            }
            onChange={onFormFieldChange('customerCriteria')}
            renderInput={autocompleteRender({
              label: 'Customer Criteria',
              placeholder: 'Select Customer Criteria',
            })}
          />
        </div>
        <EngineTypes
          setSelectedEngineTypes={setSelectedEngineTypes}
          selectedEngineTypes={selectedEngineTypes}
          setFormIsChecked={setFormIsChecked}
          isApplyBusinessRules={isApplyBusinessRules}
        />
      </div>
    </DialogContent>
  );
};
