import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, TextField, Typography, InputAdornment } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import defaultLogo from '../../../../assets/img/logoSidebar.svg';
import {
  setCustomLogoPath,
  setSidebarColorHex,
  updateDealershipLogo,
  updateLeftPanelColor,
} from '../../../../store/reducers/dealershipGroups/actions';
import ColorPicker from '@rc-component/color-picker';
import '@rc-component/color-picker/assets/index.css';
import { useStyles } from './styles';
import {
  ACCEPTED_EXTENSIONS,
  DEFAULT_SIDEBAR_HEX,
  isValidFullHex,
  MAX_FILE_SIZE_MB,
  normalizeHex,
} from './helpers';
import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import useClickOutside from '../../../../hooks/useClickOutside/useClickOutside';
import { useParams } from 'react-router-dom';

export const AdminStyling: React.FC = () => {
  const dispatch = useDispatch();
  const showMessage = useMessage();
  const showError = useException();
  const { sidebarColorHex, customLogoPath } = useSelector((s: RootState) => s.dealershipGroups);

  const [isEdit, setIsEdit] = useState(false);
  const [localHex, setLocalHex] = useState<string>(sidebarColorHex || DEFAULT_SIDEBAR_HEX);
  const [localLogo, setLocalLogo] = useState<string | undefined>(customLogoPath);
  const [hexTouched, setHexTouched] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const selectedFileRef = useRef<File | null>(null);
  const originalHexRef = useRef<string>(sidebarColorHex || DEFAULT_SIDEBAR_HEX);
  const originalLogoRef = useRef<string | undefined>(customLogoPath);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const isHexError = useMemo(() => {
    if (!hexTouched) return false;
    if (!isValidFullHex(localHex)) {
      return true;
    }
    return false;
  }, [localHex, hexTouched]);

  const { classes } = useStyles({
    isEditMode: isEdit,
    choosenColor: !isHexError ? localHex : undefined,
  });
  const { id } = useParams<{ id: string }>();

  useClickOutside(pickerRef, () => {
    // ignore if click was on the preview swatch
    // const lastActive = document.activeElement as Node | null;
    setShowPicker(false);
  });

  useEffect(() => {
    if (isEdit) {
      setLocalHex(sidebarColorHex || DEFAULT_SIDEBAR_HEX);
      setLocalLogo(customLogoPath);
    }
  }, [isEdit, sidebarColorHex, customLogoPath]);

  const handleEdit = () => {
    originalHexRef.current = sidebarColorHex || DEFAULT_SIDEBAR_HEX;
    originalLogoRef.current = customLogoPath;
    setLocalHex(originalHexRef.current);
    setLocalLogo(originalLogoRef.current);
    setHexTouched(false);
    setShowPicker(false);
    setIsEdit(true);
  };

  const handleCancel = () => {
    setLocalHex(originalHexRef.current);
    setLocalLogo(originalLogoRef.current);
    setHexTouched(false);
    setShowPicker(false);
    setIsEdit(false);
  };

  const handleSave = () => {
    if (!isValidFullHex(localHex)) {
      showError('Hex color is invalid. Please correct it before saving.');
      return;
    }

    const dealershipId = id ? Number(id) : null;
    if (dealershipId && localHex !== (sidebarColorHex || DEFAULT_SIDEBAR_HEX)) {
      dispatch(updateLeftPanelColor(dealershipId, localHex));
    }
    if (dealershipId && selectedFileRef.current) {
      dispatch(
        updateDealershipLogo(dealershipId, selectedFileRef.current, _ =>
          showError('Logo upload failed')
        )
      );
    }

    dispatch(setSidebarColorHex(localHex === DEFAULT_SIDEBAR_HEX ? undefined : localHex));
    dispatch(setCustomLogoPath(localLogo));
    setIsEdit(false);
    setShowPicker(false);
    showMessage('Configuration updated successfully');
  };

  const handleResetHex = () => {
    setLocalHex(DEFAULT_SIDEBAR_HEX);
  };
  const handleResetLogo = () => {
    setLocalLogo(defaultLogo);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHexTouched(true);
    const raw = e.target.value.toUpperCase().replace(/#/g, '');
    const normalized = normalizeHex(raw);
    setLocalHex(normalized);
  };

  const pickerColor = useMemo(() => `#${localHex.padEnd(6, '0')}`, [localHex]);
  const onPickerChange = useCallback((c: any) => {
    const hexStr = (c as any)?.toHexString ? (c as any).toHexString() : String(c);
    const hex = hexStr.replace('#', '');
    const normalized = normalizeHex(hex);
    setLocalHex(normalized);
    setHexTouched(true);
  }, []);

  const handleLogoClick = () => {
    if (!isEdit) return;
    fileInputRef.current?.click();
  };

  const handlePreviewClick = () => {
    if (!isEdit) return;
    setShowPicker(prev => !prev);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (!ACCEPTED_EXTENSIONS.includes(file.type)) {
      showError('Only PNG or SVG formats allowed');
      return;
    }
    const maxSize = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxSize) {
      showError(`Max file size is ${MAX_FILE_SIZE_MB}MB`);
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      if (width <= height) {
        showError('Please upload a rectangular image (width must be greater than height)');
        URL.revokeObjectURL(url);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      selectedFileRef.current = file;
      setLocalLogo(url);
    };
    img.onerror = () => {
      showError('Unable to read image. Please try another file');
      URL.revokeObjectURL(url);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    img.src = url;
  };

  return (
    <div className={`${classes.root} ${classes.section}`}>
      <div className={classes.headerRow}>
        <Typography
          variant="h6"
          marginLeft={0}
          textTransform="uppercase"
          className={classes.titleText}
        >
          Admin Styling
        </Typography>
        <div className={classes.actionsRow}>
          {!isEdit ? (
            <Button variant="text" color="primary" onClick={handleEdit}>
              Edit
            </Button>
          ) : (
            <>
              <Button variant="text" color="error" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="text" color="primary" onClick={handleSave} disabled={isHexError}>
                Save
              </Button>
            </>
          )}
        </div>
      </div>
      <div className={classes.grid}>
        <div>
          <Typography variant="subtitle1" marginBottom={2} className={classes.titleText}>
            Admin Panel Logo
          </Typography>
          <div className={classes.row}>
            <div className={classes.logoWrapper} onClick={handleLogoClick} role="button">
              {localLogo ? (
                <img src={localLogo} alt="Logo Preview" className={classes.logoImg} />
              ) : (
                <div className={classes.logoPlaceholderWrapper}>
                  <Typography className={classes.logoPlaceholderText}>DEFAULT</Typography>
                  <Typography className={classes.logoPlaceholderText}>IMAGE</Typography>
                </div>
              )}
            </div>
            <div className={classes.uploadLogoWrapper}>
              <Button
                disabled={!isEdit}
                variant="contained"
                onClick={handleLogoClick}
                color="primary"
                style={{ maxWidth: 132 }}
              >
                Upload Logo
              </Button>
              <Typography variant="body2" color="textSecondary" className={classes.helperTextWrap}>
                Upload a rectangular SVG or PNG file, and make sure its size does not <br /> exceed
                2 MB
              </Typography>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {isEdit && (
              <Button
                variant="text"
                color={localLogo !== defaultLogo ? 'primary' : 'inherit'}
                onClick={handleResetLogo}
                fullWidth
                className={`${classes.resetButtonBase} ${localLogo !== defaultLogo ? classes.resetButtonPrimary : classes.resetButtonGrey}`}
              >
                Reset to Default
              </Button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.svg"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div>
          <Typography variant="subtitle1" marginBottom={2} className={classes.titleText}>
            Left Panel Background
          </Typography>
          <div className={classes.row}>
            <div className={classes.hexColorSectionWrapper}>
              <div className={classes.leftColorColumn}>
                <div
                  className={classes.previewColorBox}
                  ref={previewRef}
                  style={{ backgroundColor: isValidFullHex(localHex) ? `#${localHex}` : '#fff' }}
                  onClick={handlePreviewClick}
                  role="button"
                  aria-label="Toggle color picker"
                />
                {showPicker && (
                  <div className={classes.pickerWrap} ref={pickerRef}>
                    <ColorPicker
                      disabled={!isEdit}
                      disabledAlpha
                      value={pickerColor}
                      onChange={onPickerChange}
                    />
                  </div>
                )}
              </div>
              <div className={classes.colorInputsContainer}>
                <Typography
                  variant="caption"
                  textTransform="uppercase"
                  className={classes.titleText}
                >
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
              >
                Reset to Default
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
