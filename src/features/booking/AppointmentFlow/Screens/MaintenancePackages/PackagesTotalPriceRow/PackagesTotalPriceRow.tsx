import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { useTranslation } from 'react-i18next';
import { IPackageOptions } from '../../../../../../api/types';
import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import { EPackagePricingType } from '../../../../../../store/reducers/appointmentFrameReducer/types';
import { TPackage } from '../types';
import { PriceValue, useStyles, Wrapper } from './styles';

type TTotalPriceRowProps = {
  packages: TPackage[];
  handleClick: (p: IPackageOptions, pricing: EPackagePricingType) => () => void;
  isUpsells?: boolean;
  title: string;
  selectedPackage: IPackageOptions | null;
  packagePricingType: EPackagePricingType | null;
};

const PackagesTotalPriceRow: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TTotalPriceRowProps>>
> = ({ packages, handleClick, isUpsells, title, selectedPackage, packagePricingType }) => {
  const { scProfile } = useSelector((state: RootState) => state.appointment);
  const { t } = useTranslation();
  const { classes } = useStyles();
  const defaultString = `${t('Total')} (${t('excluding taxes & fees')})`;

  return (
    <Wrapper count={packages.length}>
      <div className={classes.priceText}>{title?.length && isUpsells ? title : defaultString}:</div>
      {packages.map(p => {
        const complimentaryPrice = p.marketPriceComplimentaryServices ?? 0;
        const servicesPrice = p.price ?? 0;
        const showDetails = Boolean(scProfile?.isShowPriceDetails && complimentaryPrice > 0);
        const selected =
          p.type === selectedPackage?.type && packagePricingType === EPackagePricingType.BasePrice;

        return (
          <PriceValue
            selected={selected}
            roundPrice={scProfile?.isRoundPrice}
            onClick={handleClick(p, EPackagePricingType.BasePrice)}
            showDetails={showDetails}
            key={p.id}
          >
            <div className={showDetails ? '' : 'positionedBtn'}>
              {selected ? <RadioButtonChecked /> : <RadioButtonUnchecked />}
            </div>
            <div className="prices" style={{ fontSize: 20 }}>
              {showDetails ? (
                <div className="previousPrice">
                  $
                  {scProfile?.isRoundPrice
                    ? complimentaryPrice + +p.totalMaintenanceValue
                    : (complimentaryPrice + +p.totalMaintenanceValue).toFixed(2)}
                </div>
              ) : null}
              <div className={showDetails ? 'currentPrice' : 'centeredPrice'}>
                ${scProfile?.isRoundPrice ? servicesPrice : servicesPrice.toFixed(2)}
              </div>
            </div>
          </PriceValue>
        );
      })}
    </Wrapper>
  );
};

export default PackagesTotalPriceRow;
