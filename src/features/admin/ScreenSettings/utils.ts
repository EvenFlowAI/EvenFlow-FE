export const getPriceDisplayValue = (roundPrice: boolean) => {
  return roundPrice ? "Rounded" : "Fractional";
};

export const getWaitlistValue = (isEnabled: boolean) => {
  return isEnabled ? "On" : "Off";
};
