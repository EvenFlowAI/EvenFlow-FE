import React from 'react';
import {
  BaseModal,
  DialogActions,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { Button, Divider } from '@mui/material';
import AssignOpsCode from './parts/AssignOpsCodeModal/AssignOpsCodeModal';
import AddOpsCode from '../../../../components/modals/admin/AddOpsCode/AddOpsCode';
import ExistingPackagesModal from './parts/ExistingPackagesModal/ExistingPackagesModal';
import AddComplimentary from './parts/AddComplimentaryModal/AddComplimentaryModal';
import AddUpsellToPackageModal from './parts/AddUpsellToPackageModal/AddUpsellToPackageModal';
import { useAutocompleteStyles, useStyles } from './styles';
import { TModalProps } from './types';
import { Loading } from '../../../../components/wrappers/Loading/Loading';
import { AddPackageModalContent } from './AddPackageModalContent';
import { useAddPackageModal } from './useAddPackageModal';

const AddPackageModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<TModalProps>>> = ({
  isEditing,
  ...props
}) => {
  const { classes } = useStyles();
  const { classes: autoCompleteStyles } = useAutocompleteStyles();
  const modalData = useAddPackageModal({
    isEditing,
    onClose: props.onClose,
  });

  const {
    data: {
      packages,
      isPackageLoading,
      packageName,
      selectedPackages,
      opsCodes,
      upsellCodes,
      assignedOpsCodes,
      complimentary,
      vehiclesData,
      formIsChecked,
      isApplyBusinessRules,
      selectedMakes,
      selectedModels,
      selectedMileages,
      optionError,
      selectedEngineTypes,
      isSaving,
    },
    modals: {
      isAssignOpsCodeOpen,
      onAssignOpsCodeOpen,
      onAssignOpsCodeClose,
      isAddOpsCodeOpen,
      onAddOpsCodeOpen,
      onAddOpsCodeClose,
      isUpsellOpen,
      onUpsellOpen,
      onUpsellClose,
      isComplimentaryOpen,
      onComplimentaryOpen,
      onComplimentaryClose,
      isExistingOpen,
      onExistingOpen,
      onExistingClose,
    },
    setters: {
      setSelectedPackages,
      setAssignedOpsCodes,
      setComplimentary,
      setSelectedMakes,
      setSelectedModels,
      setFormIsChecked,
      setSelectedMileages,
      setOptionError,
      setSelectedEngineTypes,
    },
    handlers: {
      onCancel,
      onSave,
      onNameChange,
      onFormFieldChange,
      onDelete,
      onPackageDelete,
      onApplyBusinessRulesChange,
      handleOpsCodeSelect,
      handleUpsellCodeSelect,
    },
  } = modalData;

  return (
    <BaseModal {...props} width={540} onClose={onCancel}>
      <DialogTitle onClose={onCancel}>{isEditing ? 'Edit' : 'Add'} Maintenance Package</DialogTitle>
      {!isSaving ? (
        <>
          <AddPackageModalContent
            classes={classes}
            autoCompleteClasses={autoCompleteStyles}
            packageName={packageName}
            formIsChecked={formIsChecked}
            selectedPackages={selectedPackages}
            packages={packages}
            assignedOpsCodes={assignedOpsCodes}
            opsCodes={opsCodes}
            isApplyBusinessRules={isApplyBusinessRules}
            selectedMakes={selectedMakes}
            selectedModels={selectedModels}
            selectedMileages={selectedMileages}
            vehiclesData={vehiclesData}
            selectedEngineTypes={selectedEngineTypes}
            onNameChange={onNameChange}
            onPackageDelete={onPackageDelete}
            onExistingOpen={onExistingOpen}
            onAssignOpsCodeOpen={onAssignOpsCodeOpen}
            onDelete={onDelete}
            onAddOpsCodeOpen={onAddOpsCodeOpen}
            onUpsellOpen={onUpsellOpen}
            onComplimentaryOpen={onComplimentaryOpen}
            onApplyBusinessRulesChange={onApplyBusinessRulesChange}
            setSelectedMakes={setSelectedMakes}
            setSelectedModels={setSelectedModels}
            setFormIsChecked={setFormIsChecked}
            setSelectedMileages={setSelectedMileages}
            setSelectedEngineTypes={setSelectedEngineTypes}
            onFormFieldChange={onFormFieldChange}
          />
          <Divider style={{ margin: 0 }} />
        </>
      ) : (
        <Loading />
      )}
      <DialogActions>
        <div className={classes.wrapper}>
          <div className={classes.buttonsWrapper}>
            <Button onClick={onCancel} className={classes.cancelButton}>
              Cancel
            </Button>
            <Button onClick={onSave} disabled={isPackageLoading} className={classes.saveButton}>
              Save
            </Button>
          </div>
        </div>
      </DialogActions>

      <AssignOpsCode
        title="ASSIGN OP CODES TO MAINTENANCE PACKAGE OPTIONS"
        open={isAssignOpsCodeOpen}
        optionError={optionError}
        setOptionError={setOptionError}
        onClose={onAssignOpsCodeClose}
        selectedCodes={assignedOpsCodes}
        isEditing={isEditing}
        setSelectedCodes={setAssignedOpsCodes}
      />
      <AddComplimentary
        title="Add Complimentary"
        open={isComplimentaryOpen}
        onClose={onComplimentaryClose}
        selectedCodes={complimentary}
        setSelectedCodes={setComplimentary}
      />
      <AddUpsellToPackageModal
        handleSelect={handleUpsellCodeSelect}
        open={isUpsellOpen}
        onClose={onUpsellClose}
        selectedCodes={upsellCodes}
      />
      <AddOpsCode
        handleSelect={handleOpsCodeSelect}
        open={isAddOpsCodeOpen}
        onClose={onAddOpsCodeClose}
        selectedCodes={opsCodes}
      />
      <ExistingPackagesModal
        open={isExistingOpen}
        onClose={onExistingClose}
        selectedPackages={selectedPackages}
        setSelectedPackages={setSelectedPackages}
      />
    </BaseModal>
  );
};

export default AddPackageModal;
