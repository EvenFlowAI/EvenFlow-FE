import React, { SyntheticEvent } from 'react';
import { Autocomplete, Button, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import { autocompleteRender } from '../../../utils/autocompleteRenders';
import { MaintenanceOptionTypes, PackageSourceTypes } from './constants';
import { TOption, TPackageSource } from './types';

type TTopBarClasses = {
  topLineWrapper: string;
  selectWrapper: string;
  controlsRow: string;
  controlColumn: string;
  optionsLabel: string;
  select: string;
  actionsWrapper: string;
  actionsButtons: string;
};

type TProps = {
  classes: TTopBarClasses;
  loading: boolean;
  packagesOptionsLoading: boolean;
  packageSourceType: TPackageSource;
  presentedOptions: TOption[];
  autocompleteClasses: Record<string, string>;
  onPackageSourceSelect: (e: SelectChangeEvent<number | string>) => void;
  onPresentedOptionsChange: (e: SyntheticEvent, value: TOption[]) => void;
  onAddDisclaimer: () => void;
  isDisclaimerOpen: boolean;
  onAddPackage: () => void;
};

export const MaintenancePackagesTopBar: React.FC<TProps> = ({
  classes,
  loading,
  packagesOptionsLoading,
  packageSourceType,
  presentedOptions,
  autocompleteClasses,
  onPackageSourceSelect,
  onPresentedOptionsChange,
  onAddDisclaimer,
  isDisclaimerOpen,
  onAddPackage,
}) => {
  return (
    <div className={classes.topLineWrapper}>
      <div className={classes.selectWrapper}>
        {loading ? (
          <Loading />
        ) : (
          <div className={classes.controlsRow}>
            <div className={classes.controlColumn}>
              <p className={classes.optionsLabel}>Package Source</p>
              <Select
                id="package-source"
                className={classes.select}
                value={packageSourceType.value}
                onChange={onPackageSourceSelect}
                disableUnderline
                displayEmpty
                variant="standard"
                size="small"
              >
                {PackageSourceTypes.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className={classes.controlColumn}>
              <p className={classes.optionsLabel}>Available Package Options</p>
              {packagesOptionsLoading ? (
                <Loading />
              ) : (
                <Autocomplete
                  fullWidth
                  multiple
                  disableClearable
                  classes={autocompleteClasses}
                  options={MaintenanceOptionTypes}
                  disableCloseOnSelect
                  getOptionLabel={o => o.name}
                  isOptionEqualToValue={(o, v) => o.value === v.value}
                  value={presentedOptions}
                  onChange={onPresentedOptionsChange}
                  renderInput={autocompleteRender({
                    label: '',
                    placeholder: '',
                  })}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <div className={classes.actionsWrapper}>
        <div className={classes.actionsButtons}>
          <Button color="primary" variant="contained" onClick={onAddDisclaimer}>
            {isDisclaimerOpen ? 'Close' : 'Open'} Disclaimer
          </Button>
          <Button color="primary" variant="contained" onClick={onAddPackage}>
            Add Package
          </Button>
        </div>
      </div>
    </div>
  );
};
