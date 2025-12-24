import React from 'react';
import { ReactComponent as NoIconDesktop } from '../../../../../../../assets/img/noIcon.svg';
import { ReactComponent as NoIconMobile } from '../../../../../../../assets/img/icon_Bus_80px_adaptive.svg';
import { ReactComponent as Shuttle } from '../../../../../../../assets/img/default-transportations/Shuttle.svg';
import { ReactComponent as Loaner } from '../../../../../../../assets/img/default-transportations/Loaner.svg';
import { ReactComponent as Rental } from '../../../../../../../assets/img/default-transportations/Rental.svg';
import { ReactComponent as Ride } from '../../../../../../../assets/img/default-transportations/Rideshare.svg';
import { ReactComponent as WaitAtDealership } from '../../../../../../../assets/img/default-transportations/Wait at Dealership.svg';
import { ReactComponent as DropOffVehicle } from '../../../../../../../assets/img/default-transportations/Drop Off.svg';
import { ReactComponent as NightTimeDropOff } from '../../../../../../../assets/img/default-transportations/Night Time Drop Off.svg';
import { ReactComponent as PickUpDelivery } from '../../../../../../../assets/img/default-transportations/Pick Up & Delivery.svg';

type TProps = {
  transportationName?: string;
  iconPath?: string;
  isSM?: boolean;
  active?: boolean;
};

const fallbackIcons: Record<string, React.ReactNode> = {
  Shuttle: <Shuttle />,
  Loaner: <Loaner />,
  Rental: <Rental />,
  Ride: <Ride />,
  WaitAtDealership: <WaitAtDealership />,
  DropOffVehicle: <DropOffVehicle />,
  NightTimeDropOff: <NightTimeDropOff />,
  PickUpDelivery: <PickUpDelivery />,
};

const CardIcon: React.FC<TProps> = ({ iconPath, isSM, active, transportationName }) => {
  if (iconPath) {
    return (
      <span className="cardIcon" style={{ filter: active ? 'invert(100%)' : 'unset' }}>
        {' '}
        <img
          src={iconPath}
          style={{ width: isSM ? 78 : 110, height: isSM ? 78 : 110 }}
          alt="service_category_logo"
        />{' '}
      </span>
    );
  }

  if (transportationName) {
    const FallbackIcon = fallbackIcons[transportationName];
    if (FallbackIcon) {
      return <span className="cardIcon">{FallbackIcon}</span>;
    }
  }

  return isSM ? (
    <NoIconMobile />
  ) : (
    <div className="cardIcon">
      <NoIconDesktop />
    </div>
  );
};

export default CardIcon;
