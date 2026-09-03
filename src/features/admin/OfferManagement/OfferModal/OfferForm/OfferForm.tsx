import React, { useMemo } from 'react';
import { DialogContent } from '../../../../../components/modals/BaseModal/BaseModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { IAssignedServiceRequestShort } from '../../../../../store/reducers/serviceRequests/types';
import { selectAllSR } from '../../types';
import { OfferBasicInfoSection } from './OfferBasicInfoSection';
import { OfferAutocompleteSection } from './OfferAutocompleteSection';
import { OfferAudienceSection } from './OfferAudienceSection';
import { OfferScheduleSection } from './OfferScheduleSection';
import { OfferProductPageSection } from './OfferProductPageSection';
import { TOfferFormProps } from './types';

export const OfferForm: React.FC<React.PropsWithChildren<TOfferFormProps>> = ({
  form,
  onSelect,
  onChange,
  onRadio,
  onChangeDateTime,
  onDOWSelect,
  onValueChange,
  onSegmentSelect,
  onCategoryChange,
  onSRChange,
  formIsChecked,
}) => {
  const serviceRequests = useSelector((state: RootState) => state.serviceRequests.scRequestsShort);
  const { allCategories } = useSelector((state: RootState) => state.categories);

  const srWithAll: IAssignedServiceRequestShort[] = useMemo(
    () => [selectAllSR, ...serviceRequests],
    [serviceRequests]
  );

  return (
    <DialogContent>
      <OfferBasicInfoSection
        form={form}
        onChange={onChange}
        onRadio={onRadio}
        formIsChecked={formIsChecked}
      />
      <OfferAutocompleteSection
        form={form}
        formIsChecked={formIsChecked}
        srWithAll={srWithAll}
        allCategories={allCategories}
        onSegmentSelect={onSegmentSelect}
        onSRChange={onSRChange}
        onCategoryChange={onCategoryChange}
      />
      <OfferAudienceSection
        form={form}
        formIsChecked={formIsChecked}
        onSelect={onSelect}
        onDOWSelect={onDOWSelect}
      />
      <OfferScheduleSection
        form={form}
        formIsChecked={formIsChecked}
        onChangeDateTime={onChangeDateTime}
      />
      <OfferProductPageSection
        isProductPageOn={Boolean(form.isProductPageOn)}
        onValueChange={onValueChange}
      />
    </DialogContent>
  );
};
