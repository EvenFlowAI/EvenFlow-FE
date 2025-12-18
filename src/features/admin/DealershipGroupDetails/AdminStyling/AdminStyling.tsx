import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import defaultLogo from '../../../../assets/img/logoSidebar.svg';
import {
  updateDealershipLogo,
  removeDealershipLogo,
  updateLeftPanelColor,
} from '../../../../store/reducers/dealershipGroups/actions';
import { useStyles } from './styles';
import { isValidFullHex } from './helpers';
import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import { useParams } from 'react-router-dom';
import { DEFAULT_SIDEBAR_HEX } from '../../../../utils/constants';
import { Loading } from '../../../../components/wrappers/Loading/Loading';
import UploadLogo from './UploadLogo';
import SetBackgroundColor from './SetBackgroundColor';

export const AdminStyling: React.FC = () => {
  const dispatch = useDispatch();
  const showMessage = useMessage();
  const showError = useException();
  const { sidebarColorHex, customLogoPath, saving } = useSelector(
    (s: RootState) => s.dealershipGroups
  );

  const [isEdit, setIsEdit] = useState(false);
  const [localHex, setLocalHex] = useState<string>(sidebarColorHex || DEFAULT_SIDEBAR_HEX);
  const [localLogo, setLocalLogo] = useState<string | undefined>(customLogoPath);
  const [hexTouched, setHexTouched] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const selectedFileRef = useRef<File | null>(null);
  const shouldRemoveLogoRef = useRef<boolean>(false);
  const originalHexRef = useRef<string>(sidebarColorHex || DEFAULT_SIDEBAR_HEX);
  const originalLogoRef = useRef<string | undefined>(customLogoPath);

  const isHexError = useMemo(() => {
    if (!hexTouched) return false;
    return !isValidFullHex(localHex);
  }, [localHex, hexTouched]);

  const { classes } = useStyles({
    isEditMode: isEdit,
    chosenColor: !isHexError ? localHex : undefined,
  });
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (isEdit) {
      setLocalHex(sidebarColorHex || DEFAULT_SIDEBAR_HEX);
      setLocalLogo(customLogoPath || defaultLogo);
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
    selectedFileRef.current = null;
    shouldRemoveLogoRef.current = false;
    setHexTouched(false);
    setShowPicker(false);
    setIsEdit(false);
  };

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
    // Update on save if there's a selected file OR the user requested a reset
    return !!dealershipId && (!!selectedFileRef.current || shouldRemoveLogoRef.current);
  };

  const buildLogoUpdateOperation = (dealershipId: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      // If a user requested removal (reset) and there's no selected file, call removal action
      if (shouldRemoveLogoRef.current && !selectedFileRef.current) {
        dispatch(
          removeDealershipLogo(
            dealershipId,
            err => {
              showError(`Logo removal failed: ${err}`);
              reject(err);
            },
            () => {
              setLocalLogo(defaultLogo);
              selectedFileRef.current = null;
              shouldRemoveLogoRef.current = false;
              resolve();
            }
          )
        );
        return;
      }

      dispatch(
        updateDealershipLogo(
          dealershipId,
          selectedFileRef.current!,
          err => {
            showError(`Logo update failed: ${err}`);
            reject(err);
          },
          async () => {
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
      // At least one failed; keep edit mode so the user can correct and retry
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

    executeSave(ops, attempted).then();
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
            <Button
              variant="text"
              color="primary"
              onClick={handleEdit}
              className={classes.actionButton}
            >
              Edit
            </Button>
          ) : saving ? (
            <Loading />
          ) : (
            <>
              <Button
                variant="text"
                color="error"
                onClick={handleCancel}
                className={classes.actionButton}
              >
                Cancel
              </Button>
              <Button
                variant="text"
                color="primary"
                onClick={handleSave}
                disabled={isHexError}
                className={classes.actionButton}
              >
                Save
              </Button>
            </>
          )}
        </div>
      </div>
      <div className={classes.grid}>
        <UploadLogo
          isEdit={isEdit}
          isHexError={isHexError}
          localLogo={localLogo}
          setLocalLogo={setLocalLogo}
          localHex={localHex}
          selectedFileRef={selectedFileRef}
          shouldRemoveLogoRef={shouldRemoveLogoRef}
        />
        <SetBackgroundColor
          isEdit={isEdit}
          isHexError={isHexError}
          localHex={localHex}
          setLocalHex={setLocalHex}
          setShowPicker={setShowPicker}
          setHexTouched={setHexTouched}
          showPicker={showPicker}
        />
      </div>
    </div>
  );
};
