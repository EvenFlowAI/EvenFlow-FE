import React, { useRef } from 'react';
import { Button, Typography } from '@mui/material';
import defaultLogo from '../../../../assets/img/logoSidebar.svg';
import { useStyles } from './styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { ACCEPTED_EXTENSIONS, MAX_FILE_SIZE_MB } from './helpers';
import { useException } from '../../../../hooks/useException/useException';

interface UploadLogoProps {
  isEdit: boolean;
  isHexError: boolean;
  localHex: string;
  localLogo: string | undefined;
  setLocalLogo: (logo: string) => void;
  selectedFileRef: React.MutableRefObject<File | null>;
  shouldRemoveLogoRef: React.MutableRefObject<boolean>;
}

const UploadLogo = ({
  isEdit,
  isHexError,
  localHex,
  localLogo,
  setLocalLogo,
  selectedFileRef,
  shouldRemoveLogoRef,
}: UploadLogoProps) => {
  const { classes } = useStyles({
    isEditMode: isEdit,
    chosenColor: !isHexError ? localHex : undefined,
  });
  const showError = useException();
  const { customLogoPath } = useSelector((s: RootState) => s.dealershipGroups);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isUsingDefaultLogo =
    !selectedFileRef.current &&
    (!customLogoPath || localLogo === '' || localLogo === defaultLogo || !localLogo);

  const handleResetLogo = async () => {
    // Show default locally and clear a selected file
    setLocalLogo(defaultLogo);
    selectedFileRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
    shouldRemoveLogoRef.current = true;
  };

  const handleLogoClick = () => {
    if (!isEdit) return;
    fileInputRef.current?.click();
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
            className={classes.uploadLogoButton}
          >
            Upload Logo
          </Button>
          <Typography variant="body2" color="textSecondary" className={classes.helperTextWrapper}>
            Upload an SVG or PNG file, and make sure its size does not exceed 2 MB
          </Typography>
        </div>
      </div>
      <div className={classes.fileInputWrapper}>
        {isEdit && (
          <Button
            variant="text"
            color={isUsingDefaultLogo ? 'inherit' : 'primary'}
            onClick={handleResetLogo}
            fullWidth
            className={`${classes.resetButtonBase} ${isUsingDefaultLogo ? classes.resetButtonGrey : classes.resetButtonPrimary}`}
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
  );
};

export default UploadLogo;
