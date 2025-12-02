import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, TextField, Typography, InputAdornment } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import defaultLogo from '../../../../assets/img/logoSidebar.svg';
import {
  updateDealershipLogo,
  updateLeftPanelColor,
} from '../../../../store/reducers/dealershipGroups/actions';
import ColorPicker from '@rc-component/color-picker';
import '@rc-component/color-picker/assets/index.css';
import { useStyles } from './styles';
import {
  ACCEPTED_EXTENSIONS,
  isValidFullHex,
  MAX_FILE_SIZE_MB,
  sanitizeHex,
  urlToFile,
} from './helpers';
import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import useClickOutside from '../../../../hooks/useClickOutside/useClickOutside';
import { useParams } from 'react-router-dom';
import { DEFAULT_SIDEBAR_HEX } from '../../../../utils/constants';

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
  const previewClickFlagRef = useRef<boolean>(false);

  const isHexError = useMemo(() => {
    if (!hexTouched) return false;
    if (!isValidFullHex(localHex)) {
      return true;
    }
    return false;
  }, [localHex, hexTouched]);

  const { classes } = useStyles({
    isEditMode: isEdit,
    chosenColor: !isHexError ? localHex : undefined,
  });
  const { id } = useParams<{ id: string }>();

  useClickOutside(pickerRef, () => {
    // If the most recent interaction started on the preview box, do not close.
    if (previewClickFlagRef.current) {
      previewClickFlagRef.current = false;
      return;
    }
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

  const handleCancel = async () => {
    setLocalHex(originalHexRef.current);
    setLocalLogo(originalLogoRef.current);
    const file = await urlToFile(defaultLogo);
    selectedFileRef.current = file;
    setHexTouched(false);
    setShowPicker(false);
    setIsEdit(false);
  };

  // Helpers: validation and building async ops
  const validateHexOrShowError = (): boolean => {
    if (!isValidFullHex(localHex)) {
      showError('Hex color is invalid. Please correct it before saving.');
      return false;
    }
    return true;
  };

  const shouldUpdateColor = (dealershipId: number | null): boolean => {
    return !!dealershipId && localHex !== (sidebarColorHex || DEFAULT_SIDEBAR_HEX);
  };

  const buildColorUpdateOperation = (dealershipId: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      dispatch(
        updateLeftPanelColor(
          dealershipId,
          localHex,
          err => {
            showError(`Color update failed: ${err}`);
            reject(err);
          },
          () => {
            setLocalHex(localHex);
            resolve();
          }
        )
      );
    });
  };

  const shouldUpdateLogo = (dealershipId: number | null): boolean => {
    return !!dealershipId && !!selectedFileRef.current;
  };

  const buildLogoUpdateOperation = (dealershipId: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      dispatch(
        updateDealershipLogo(
          dealershipId,
          selectedFileRef.current!,
          err => {
            showError(`Logo update failed: ${err}`);
            reject(err);
          },
          () => {
            setLocalLogo(localLogo);
            resolve();
          }
        )
      );
    });
  };

  const executeSave = async (ops: Promise<void>[], attempted: number) => {
    if (attempted === 0) {
      setIsEdit(false);
      setShowPicker(false);
      showMessage('No changes to save');
      return;
    }
    try {
      await Promise.all(ops);
      setIsEdit(false);
      setShowPicker(false);
      showMessage('Admin styling updated successfully');
    } catch {
      // At least one failed; keep edit mode so user can correct and retry
    }
  };

  const handleSave = () => {
    if (!validateHexOrShowError()) return;

    const dealershipId = id ? Number(id) : null;
    const ops: Promise<void>[] = [];
    let attempted = 0;

    if (shouldUpdateColor(dealershipId)) {
      attempted++;
      ops.push(buildColorUpdateOperation(dealershipId!));
    }

    if (shouldUpdateLogo(dealershipId)) {
      attempted++;
      ops.push(buildLogoUpdateOperation(dealershipId!));
    }

    executeSave(ops, attempted);
  };

  const handleResetHex = () => {
    setLocalHex(DEFAULT_SIDEBAR_HEX);
  };

  const handleResetLogo = async () => {
    setLocalLogo(defaultLogo);
    const file = await urlToFile(defaultLogo);
    selectedFileRef.current = file;
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHexTouched(true);
    const raw = e.target.value.toUpperCase().replace(/#/g, '');
    const normalized = sanitizeHex(raw);
    setLocalHex(normalized);
  };

  const pickerColor = useMemo(() => `#${localHex.padEnd(6, '0')}`, [localHex]);
  const onPickerChange = useCallback((c: any) => {
    const hexStr = (c as any)?.toHexString ? (c as any).toHexString() : String(c);
    const hex = hexStr.replace('#', '');
    const normalized = sanitizeHex(hex);
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
      showError('Only PNG or SVG formats are allowed');
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
              <img src={localLogo || defaultLogo} alt="Logo Preview" className={classes.logoImg} />
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
              <Typography
                variant="body2"
                color="textSecondary"
                className={classes.helperTextWrapper}
              >
                Upload a SVG or PNG file, and make sure its size does not exceed 2 MB
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
                <div className={classes.previewWrapper}>
                  <div
                    className={classes.previewColorBox}
                    style={{ backgroundColor: isValidFullHex(localHex) ? `#${localHex}` : '#fff' }}
                    onMouseDown={() => {
                      previewClickFlagRef.current = true;
                    }}
                    onClick={handlePreviewClick}
                    role="button"
                    aria-label="Toggle color picker"
                  />
                  {showPicker && (
                    <div className={classes.pickerPopover} ref={pickerRef}>
                      <ColorPicker
                        disabled={!isEdit}
                        disabledAlpha
                        value={pickerColor}
                        onChange={onPickerChange}
                      />
                    </div>
                  )}
                </div>
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
