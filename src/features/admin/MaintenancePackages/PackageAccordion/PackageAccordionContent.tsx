import React, { Dispatch, SetStateAction } from 'react';
import { Divider } from '@mui/material';
import { Loading } from '../../../../components/wrappers/Loading/Loading';
import { IPackageById, IPackageOptionDetailed } from '../../../../api/types';
import { ServiceRequestsWithOptions } from './ServiceRequestsAndOptions/ServiceRequestsAndOptions';
import SummaryRow from './SummaryRow/SummaryRow';
import Upsells from './Upsells/Upsells';
import Complimentary from './Complimentary/Complimentary';
import PricesBlock from './PricesRow/PricesRow';
import AccordionActions from './AccordionActions/AccordionActions';
import { TCellData, TRequestRow } from '../types';
import { IDetailsData } from './types';

type TClasses = {
  details: string;
  tablesWrapper: string;
};

type TProps = {
  classes: TClasses;
  isPackageLoading: boolean;
  packageData: IPackageById | null;
  optionsData: TRequestRow[];
  detailsData: IDetailsData | null;
  complimentaryData: TRequestRow[];
  upsellData: TRequestRow[];
  editingOption: IPackageOptionDetailed | null;
  setEditingOption: Dispatch<SetStateAction<IPackageOptionDetailed | null>>;
  onOptionNameChange: (option: IPackageOptionDetailed, name: string) => void;
  onCheckboxClick: (item: TCellData, requestId: number) => void;
  isEdit: boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  onInputChange: (value: string, fieldName: string, optionType: string | number) => void;
  isUpsellNameEdit: boolean;
  setUpsellNameEdit: Dispatch<SetStateAction<boolean>>;
  isComplimentaryNameEdit: boolean;
  setComplimentaryNameEdit: Dispatch<SetStateAction<boolean>>;
  setPackageData: Dispatch<SetStateAction<IPackageById | null>>;
  onUpsellClick: (item: TCellData, requestId: number) => void;
  onComplimentaryClick: (item: TCellData, requestId: number) => void;
  isShowSuggestedPrice?: boolean;
  onAddOpsCode: () => void;
  onCancel: () => void;
  onSave: () => void;
};

export const PackageAccordionContent: React.FC<TProps> = ({
  classes,
  isPackageLoading,
  packageData,
  optionsData,
  detailsData,
  complimentaryData,
  upsellData,
  editingOption,
  setEditingOption,
  onOptionNameChange,
  onCheckboxClick,
  isEdit,
  setIsEdit,
  onInputChange,
  isUpsellNameEdit,
  setUpsellNameEdit,
  isComplimentaryNameEdit,
  setComplimentaryNameEdit,
  setPackageData,
  onUpsellClick,
  onComplimentaryClick,
  isShowSuggestedPrice,
  onAddOpsCode,
  onCancel,
  onSave,
}) => {
  if (isPackageLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className={classes.tablesWrapper}>
        {packageData && (
          <ServiceRequestsWithOptions
            packageData={packageData}
            data={optionsData}
            editingOption={editingOption}
            setEditingOption={setEditingOption}
            onOptionNameChange={onOptionNameChange}
            onCheckboxClick={onCheckboxClick}
          />
        )}
      </div>

      {detailsData && (
        <>
          <SummaryRow
            summaryText="Suggested Labour Hours:"
            valuesArray={detailsData.suggestedRequestHours}
          />
          <SummaryRow
            summaryText="Suggested Price:"
            valuesArray={detailsData.suggestedRequestPrice}
            toggleField="showSuggestedPrice"
            toggleLabel="Show Suggested Price"
            checked={isShowSuggestedPrice}
          />

          <Divider />

          <SummaryRow
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            summaryText="Invoiced Labor Hours:"
            valuesArray={detailsData.invoicedRequestLaborHours}
            onInputChange={onInputChange}
          />
          <SummaryRow
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            summaryText="Market Price:"
            valuesArray={detailsData.requestsPrice}
            onInputChange={onInputChange}
          />

          <Upsells
            isUpsellNameEdit={isUpsellNameEdit}
            setPackageData={setPackageData}
            packageData={packageData}
            setUpsellNameEdit={setUpsellNameEdit}
            upsellData={upsellData}
            onUpsellClick={onUpsellClick}
          />

          <SummaryRow
            summaryText="Suggested Labour Hours:"
            valuesArray={detailsData.suggestedUpsellHours}
          />
          <SummaryRow
            summaryText="Suggested Price:"
            valuesArray={detailsData.suggestedUpsellPrice}
          />

          <Divider />

          <SummaryRow
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            isComplimentary
            packageHasComplimentary={Boolean(packageData?.intervalUpsells?.length)}
            summaryText="Invoiced Labor Hours:"
            valuesArray={detailsData.intervalUpsellLaborHours}
            onInputChange={onInputChange}
          />
          <SummaryRow
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            packageHasComplimentary={Boolean(packageData?.intervalUpsells?.length)}
            isComplimentary
            summaryText="Market Price:"
            valuesArray={detailsData.intervalUpsellPrice}
            onInputChange={onInputChange}
          />

          <Complimentary
            isComplimentaryNameEdit={isComplimentaryNameEdit}
            setPackageData={setPackageData}
            packageData={packageData}
            setComplimentaryNameEdit={setComplimentaryNameEdit}
            complimentaryData={complimentaryData}
            onComplimentaryClick={onComplimentaryClick}
          />

          <SummaryRow
            summaryText="Suggested Labour Hours:"
            valuesArray={detailsData.suggestedComplimentaryHours}
          />
          <SummaryRow
            summaryText="Suggested Price:"
            valuesArray={detailsData.suggestedComplimentaryPrice}
          />

          <Divider />

          <SummaryRow
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            isComplimentary
            packageHasComplimentary={Boolean(packageData?.complimentaryServices?.length)}
            summaryText="Invoiced Labor Hours:"
            valuesArray={detailsData.complimentaryLaborHours}
            onInputChange={onInputChange}
          />
          <SummaryRow
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            packageHasComplimentary={Boolean(packageData?.complimentaryServices?.length)}
            isComplimentary
            summaryText="Market Price:"
            valuesArray={detailsData.complimentaryPrice}
            onInputChange={onInputChange}
          />

          <PricesBlock
            packageData={packageData}
            suggestedPrices={detailsData.suggestedRequestPrice}
            setPackageData={setPackageData}
          />
        </>
      )}

      <AccordionActions onAddOpsCode={onAddOpsCode} onCancel={onCancel} onSave={onSave} />
    </div>
  );
};
