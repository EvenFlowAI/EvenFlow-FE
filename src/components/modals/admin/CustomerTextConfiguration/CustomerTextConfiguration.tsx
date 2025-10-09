import React, { useEffect, useRef } from 'react';
import { DialogProps } from '../../BaseModal/types';
import { DashboardItemI } from '../../../../store/reducers/dealerOperations/types';
import { BaseModal, DialogActions, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { Button } from '@mui/material';
import { Textarea } from '../../../../features/admin/RecallsParts/AddRecallModal/styles';
import { LoadingButton } from '../../../buttons/LoadingButton/LoadingButton';
import { ReactComponent as CopyIcon } from '../../../../assets/img/copy.svg';
import { customerTags } from '../../../../config/data';

import { ReactComponent as CheckIcon } from '../../../../assets/img/checkboxSmall.svg';
import { ReactComponent as RedCross } from '../../../../assets/img/redCross.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { Loading } from '../../../wrappers/Loading/Loading';
import { setTextMessage } from '../../../../store/reducers/dealerOperations/actions';
import { useStyles } from './styles';

type TCustomerTextConfigurationProps = DialogProps & {
  handleSaveText: () => void;
  isLoading: boolean;
};

const CustomerTextConfiguration = ({
  onClose,
  open,
  handleSaveText,
  isLoading,
}: TCustomerTextConfigurationProps) => {
  const { textIntegrationSettings, textMessage, eventForTextConfiguration } = useSelector(
    (state: RootState) => state.dealerOperations
  );

  const dispatch = useDispatch();
  const { classes } = useStyles();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      const textarea = textareaRef.current;

      if (textarea) {
        textarea.focus();
        const cursorPos = textMessage.length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      }
    }, 0);
  }, [open]);

  const handleInsertTag = (tag: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const value = textMessage || '';

    const start = textarea.selectionStart ?? value.length;
    const end = textarea.selectionEnd ?? value.length;

    const before = value.slice(0, start);
    const after = value.slice(end);

    const needSpaceBefore = before && !before.endsWith(' ') ? ' ' : '';
    const needSpaceAfter = after && !after.startsWith(' ') && after !== '' ? ' ' : '';

    const tagToInsert = `${needSpaceBefore}${tag}${needSpaceAfter}`;
    const newValue = before + tagToInsert + after;

    dispatch(setTextMessage(newValue));

    setTimeout(() => {
      textarea.focus();
      const cursorPos = before.length + tagToInsert.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const handleClose = () => {
    onClose();
  };

  const renderTagItem = (tag: string) => {
    const canRender = tag !== '{{Shortlink}}' || textIntegrationSettings?.schedulingPageShortLink;

    if (!canRender) return null;

    return (
      <li className={classes.tagItem}>
        <span className={classes.insertTag} onClick={() => handleInsertTag(tag)}>
          {tag}
        </span>
        <button
          type="button"
          className={classes.copyTag}
          onClick={e => {
            e.stopPropagation();
            navigator.clipboard.writeText(tag);
            const input = autocompleteRef.current?.querySelector('input');
            if (input) (input as HTMLElement).blur();
          }}
        >
          <CopyIcon />
        </button>
      </li>
    );
  };

  if (!eventForTextConfiguration) return <></>;

  return (
    <BaseModal open={open} width={602} onClose={handleClose}>
      <DialogTitle onClose={handleClose}>
        Text Configuration for {eventForTextConfiguration.name}
      </DialogTitle>
      {isLoading ? (
        <Loading />
      ) : (
        <DialogContent>
          <div className={classes.wrapper}>
            <div className={classes.integrationBlock}>
              <div className={classes.integrationWrapper}>
                <p className={classes.integrationText}>Integration</p>
                {textIntegrationSettings?.fromPhoneNumber ? (
                  <p className={classes.configuredComponent}>
                    <CheckIcon /> <span className={classes.configuredColor}>Configured</span>
                  </p>
                ) : (
                  <p className={classes.configuredComponent}>
                    <RedCross /> <span className={classes.notConfiguredColor}>Not Configured</span>
                  </p>
                )}
              </div>
              <div>
                <span className={classes.insertTagText}>Insert tag</span>
                {customerTags.map(tag => renderTagItem(tag))}
              </div>
            </div>

            <div className={classes.textMessageWrapper}>
              <div className={classes.messageTextArea}>
                <Textarea
                  inputRef={textareaRef}
                  fullWidth
                  multiline
                  style={{ marginBottom: 4 }}
                  placeholder="Enter text message"
                  label="Message"
                  onChange={e => {
                    if (e.target.value.length <= 1000) dispatch(setTextMessage(e.target.value));
                  }}
                  value={textMessage}
                  rows={20}
                />
              </div>

              <div className={classes.charactersCounter}>
                <span>Approximate Characters: {textMessage?.length || 0} / 1000</span>
              </div>
            </div>
          </div>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={handleClose} color="info">
          Cancel
        </Button>
        <LoadingButton
          onClick={handleSaveText}
          disabled={
            textMessage.trim().length < 3 ||
            textIntegrationSettings?.fromPhoneNumber === null ||
            isLoading
          }
          variant="contained"
          color="primary"
        >
          Save
        </LoadingButton>
      </DialogActions>
    </BaseModal>
  );
};

export default CustomerTextConfiguration;
