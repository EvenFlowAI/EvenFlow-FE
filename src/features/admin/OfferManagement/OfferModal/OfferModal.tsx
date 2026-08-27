import React, { useEffect, useState } from 'react';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import {
  BaseModal,
  DialogActions,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { Button, SelectChangeEvent } from '@mui/material';
import {
  ECustomerPresence,
  ECustomerSegment,
  EDayOfWeek,
  EOfferType,
  IOffer,
} from '../../../../store/reducers/offers/types';
import { useDispatch } from 'react-redux';
import {
  createOffer,
  removeOffer,
  setArchiveOffer,
  updateOffer,
} from '../../../../store/reducers/offers/actions';
import { SC_UNDEFINED, SOMETHING_WRONG } from '../../../../utils/constants';
import { IAssignedServiceRequestShort } from '../../../../store/reducers/serviceRequests/types';
import { loadSCRequestsShort } from '../../../../store/reducers/serviceRequests/actions';
import { ViewOffer } from './ViewOffer/ViewOffer';
import { OfferForm } from './OfferForm/OfferForm';
import { TOfferForm } from '../types';
import { EPricingDisplayType } from '../../../../store/reducers/pricingSettings/types';
import { ICategory } from '../../../../store/reducers/categories/types';
import { loadCategoriesByQuery } from '../../../../store/reducers/categories/actions';
import { LoadingButton } from '../../../../components/buttons/LoadingButton/LoadingButton';
import { useConfirm } from '../../../../hooks/useConfirm/useConfirm';

import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { TEnumMap } from '../../../../store/reducers/types';
import { TParsableDate } from '../../../../types/types';
import {
  buildOfferPayload,
  initialOfferForm,
  mapOfferToForm,
  normalizeDaysOfWeek,
  normalizeSegments,
  normalizeServiceRequests,
  validateOfferForm,
} from './offerForm.helpers';

export const OfferModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<DialogProps<IOffer> & { archive?: boolean }>>
> = ({ archive, payload, ...props }) => {
  const [form, setForm] = useState<TOfferForm>(initialOfferForm);
  const [archiving, setArchiving] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);
  const [formIsChecked, setFormIsChecked] = useState<boolean>(false);

  const showMessage = useMessage();
  const showError = useException();
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const { askConfirm } = useConfirm();

  useEffect(() => {
    if (props.open) {
      setViewMode(Boolean(payload));
    }
  }, [payload, props.open]);

  useEffect(() => {
    if (props.open) {
      setForm(payload ? mapOfferToForm(payload) : initialOfferForm);
    }
  }, [props.open, payload]);

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadSCRequestsShort(selectedSC.id, EPricingDisplayType.Dynamic));
      dispatch(loadCategoriesByQuery(selectedSC.id));
    }
  }, [dispatch, selectedSC]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { name, value },
  }) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setFormIsChecked(false);
    setForm(prev => {
      const offerType = Number(value) as EOfferType;
      return {
        ...prev,
        offerType,
        offerValue: offerType === EOfferType.FreeService ? undefined : prev.offerValue,
        serviceType: offerType === EOfferType.FreeService ? prev.serviceType : undefined,
      };
    });
  };

  const handleArchive = async () => {
    if (!payload) {
      showError(SOMETHING_WRONG);
      return;
    }

    setArchiving(true);
    try {
      await dispatch(setArchiveOffer(payload, archive));
    } catch (e) {
      showError(e);
    } finally {
      setArchiving(false);
    }
  };

  const handleSegmentsSelect = (e: React.SyntheticEvent, value: TEnumMap<ECustomerSegment>[]) => {
    setFormIsChecked(false);
    setForm(prev => ({
      ...prev,
      customerSegments: normalizeSegments(prev.customerSegments, value),
    }));
  };

  const handleDOWSelect = (e: React.SyntheticEvent, value: TEnumMap<EDayOfWeek>[]) => {
    setFormIsChecked(false);
    setForm(prev => ({
      ...prev,
      dayOfWeek: normalizeDaysOfWeek(prev.dayOfWeek, value),
    }));
  };

  const handleChangeDateTime = (name: keyof TOfferForm) => (date: TParsableDate) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, [name]: date }));
  };

  const setEditMode = () => {
    setViewMode(false);
  };

  const handleRemove = async () => {
    if (!payload) {
      showError(SOMETHING_WRONG);
      return;
    }

    try {
      await dispatch(removeOffer(payload, archive));
      showMessage('Offer removed');
      props.onClose();
    } catch (e) {
      showError(e);
    }
  };

  const askRemove = () =>
    askConfirm({
      title: `Please confirm you want to remove Offer ${payload?.title}?`,
      isRemove: true,
      onConfirm: async () => {
        await handleRemove();
      },
    });

  const handleSRChange = (e: React.SyntheticEvent, value: IAssignedServiceRequestShort[]) => {
    setFormIsChecked(false);
    setForm(prev => ({
      ...prev,
      serviceRequests: normalizeServiceRequests(prev.serviceRequests, value),
    }));
  };

  const onCategoryChange = (e: React.SyntheticEvent, value: ICategory[]) => {
    setForm(prev => ({ ...prev, serviceCategories: value }));
  };

  const handleSelect = (e: SelectChangeEvent<ECustomerPresence>) => {
    const { name, value } = e.target;
    setFormIsChecked(false);
    if (name) {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleValueChange = (name: keyof TOfferForm, value: unknown) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onCancel = () => {
    setFormIsChecked(false);
    props.onClose();
  };

  const handleSave = async () => {
    if (!selectedSC) {
      showError(SC_UNDEFINED);
      return;
    }

    setFormIsChecked(true);
    if (!validateOfferForm(form, showError)) {
      return;
    }

    setSaving(true);
    try {
      const data = buildOfferPayload(form, selectedSC.id, payload?.id);
      if (payload) {
        await dispatch(updateOffer(data, archive));
      } else {
        await dispatch(createOffer(data));
      }
      showMessage(`Offer ${payload ? 'updated' : 'created'}`);
      onCancel();
    } catch (e) {
      showError(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <BaseModal {...props} width={600} onClose={onCancel}>
      <DialogTitle onClose={onCancel}>{viewMode ? '' : payload ? 'Edit' : 'Add'} Offer</DialogTitle>
      {viewMode && payload ? (
        <ViewOffer offer={payload} archiving={archiving} onArchive={handleArchive} />
      ) : (
        <OfferForm
          formIsChecked={formIsChecked}
          form={form}
          onValueChange={handleValueChange}
          onChange={handleChange}
          onRadio={handleRadio}
          onSelect={handleSelect}
          onChangeDateTime={handleChangeDateTime}
          onDOWSelect={handleDOWSelect}
          onSegmentSelect={handleSegmentsSelect}
          onSRChange={handleSRChange}
          onCategoryChange={onCategoryChange}
        />
      )}
      <DialogActions>
        <Button onClick={onCancel} color="info">
          Cancel
        </Button>
        {viewMode ? (
          <>
            <Button onClick={askRemove} color="secondary" variant="outlined">
              Delete
            </Button>
            <Button onClick={setEditMode} color="primary" variant="contained">
              Edit
            </Button>
          </>
        ) : (
          <LoadingButton
            onClick={handleSave}
            loading={isSaving}
            variant="contained"
            color="primary"
          >
            Save
          </LoadingButton>
        )}
      </DialogActions>
    </BaseModal>
  );
};
