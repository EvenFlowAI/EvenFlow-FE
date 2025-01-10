import {
  IPackageOptions,
  TExtendedComplimentary,
  TExtendedService,
  TUpsellOfOption,
} from "../../../../../api/types";

export type TWithPackages = {
  packages: number[];
};
export type TService = TWithPackages & TExtendedService;
export type TComplimentary = TWithPackages & TExtendedComplimentary;
export type TUpsell = TWithPackages & TUpsellOfOption;
export type TPackage = {
  lastIdx?: number;
  moreIdx?: number[];
} & IPackageOptions;
