import React, { Dispatch, SetStateAction, useCallback, useMemo, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button, InputAdornment, TextField, Typography } from '@mui/material';
import { useStyles } from './styles';
import { sanitizeHex } from './helpers';
import useClickOutside from '../../../../hooks/useClickOutside/useClickOutside';
import { DEFAULT_SIDEBAR_HEX } from '../../../../utils/constants';

interface SetBackgroundColorProps {
  isEdit: boolean;
  isHexError: boolean;
  localHex: string;
  setLocalHex: (hex: string) => void;
  setShowPicker: Dispatch<SetStateAction<boolean>>;
  setHexTouched: (touched: boolean) => void;
  showPicker: boolean;
}

const SetBackgroundColor = ({
  isEdit,
  isHexError,
  localHex,
  setLocalHex,
  setShowPicker,
  setHexTouched,
  showPicker,
}: SetBackgroundColorProps) => {
  const { classes } = useStyles({
    isEditMode: isEdit,
    chosenColor: !isHexError ? localHex : undefined,
  });
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const previewClickFlagRef = useRef<boolean>(false);

  useClickOutside(pickerRef, () => {
    // If the most recent interaction started on the preview box, do not close.
    if (previewClickFlagRef.current) {
      previewClickFlagRef.current = false;
      return;
    }
    setShowPicker(false);
  });

  const handlePreviewClick = () => {
    if (!isEdit) return;
    setShowPicker(prev => !prev);
    previewClickFlagRef.current = false;
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHexTouched(true);
    const raw = e.target.value.toUpperCase().replace(/#/g, '');
    const normalized = sanitizeHex(raw);
    setLocalHex(normalized);
  };

  const pickerColor = useMemo(() => {
    return `#${localHex.padEnd(6, '0')}`;
  }, [localHex]);

  const onPickerChange = useCallback((c: string) => {
    const hex = c.replace('#', '');
    const normalized = sanitizeHex(hex);
    setLocalHex(normalized);
    setHexTouched(true);
  }, []);

  const handleResetHex = () => {
    setLocalHex(DEFAULT_SIDEBAR_HEX);
  };

  return (
    <div>
      <Typography variant="subtitle1" marginBottom={2} className={classes.titleText}>
        Left Panel Background
      </Typography>
      <div className={classes.row}>
        <div className={classes.hexColorSectionWrapper}>
          <div className={classes.leftColorColumn}>
            <div className={classes.previewWrapper}>
              <div
                className={classes.previewColorBox}
                style={{ backgroundColor: `#${localHex}` }}
                onMouseDown={() => {
                  previewClickFlagRef.current = true;
                }}
                onClick={handlePreviewClick}
                role="button"
                aria-label="Toggle color picker"
              />
              {showPicker && (
                <div className={classes.pickerPopover} ref={pickerRef}>
                  <HexColorPicker color={pickerColor} onChange={e => onPickerChange(e)} />
                </div>
              )}
            </div>
          </div>
          <div className={classes.colorInputsContainer}>
            <Typography variant="caption" textTransform="uppercase" className={classes.titleText}>
              HEX Color
            </Typography>
            <TextField
              size="small"
              value={localHex}
              onChange={handleHexInputChange}
              disabled={!isEdit}
              placeholder="252525"
              InputProps={{
                startAdornment: <InputAdornment position="start">#</InputAdornment>,
              }}
              inputProps={{ maxLength: 6, style: { textTransform: 'uppercase' } }}
              error={isHexError}
            />
          </div>
        </div>
      </div>
      <div className={classes.colorResetContainer}>
        <Typography variant="body2" color="textSecondary">
          Set the background color for the left-hand nav panel
        </Typography>
        {isEdit && (
          <Button
            variant="text"
            onClick={handleResetHex}
            fullWidth
            className={`${classes.resetButtonBase} ${localHex !== DEFAULT_SIDEBAR_HEX ? classes.resetButtonPrimary : classes.resetButtonGrey}`}
            style={{ marginTop: 8 }}
          >
            Reset to Default
          </Button>
        )}
      </div>
    </div>
  );
};

export default SetBackgroundColor;
