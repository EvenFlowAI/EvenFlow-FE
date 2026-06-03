import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { useSCs } from '../../../../../../hooks/useSCs/useSCs';
import { useException } from '../../../../../../hooks/useException/useException';
import { useMessage } from '../../../../../../hooks/useMessage/useMessage';
import { useStyles } from '../../../../../../components/modals/admin/CustomerTextConfiguration/styles';
import { LoadingButton } from '../../../../../../components/buttons/LoadingButton/LoadingButton';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../../../components/modals/BaseModal/BaseModal';
import { customerRecallTags } from '../../../../../../config/data';
import { Textarea } from '../../../../../../components/modals/admin/MapIframeLink/styles';
import { ReactComponent as CopyIcon } from '../../../../../../assets/img/copy.svg';
import { ReactComponent as CheckIcon } from '../../../../../../assets/img/checkboxSmall.svg';
import { ReactComponent as RedCross } from '../../../../../../assets/img/redCross.svg';
import { ReactComponent as Info } from '../../../../../../assets/img/info.svg';
import { IRecallAlert } from '../../../../../../store/reducers/recall/types';
import { TextField } from '../../../../../../components/formControls/TextFieldStyled/TextField';
import { DialogProps } from '../../../../../../components/modals/BaseModal/types';
import { sendTestSMSMessage } from '../../../../../../store/reducers/dealerOperations/actions';
import { updateRecallAlertText } from '../../../../../../store/reducers/recall/actions';
import { LightTooltip } from './LightTooltip';

type TextConfigurationRecallProps = DialogProps & {
  updatedRecallAlert: IRecallAlert | null;
  tableType: 'workflow' | 'stats';
};

const TextConfigurationRecall = ({
  onClose,
  open,
  updatedRecallAlert,
  tableType,
}: TextConfigurationRecallProps) => {
  const { selectedSC } = useSCs();
  const showError = useException();
  const showMessage = useMessage();
  const [textMessage, setTextMessage] = React.useState<string>('');
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const [phoneNumberForTest, setPhoneNumberForTest] = React.useState<string>('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (updatedRecallAlert?.communicationDetails?.textMessage?.length) {
      setTextMessage(updatedRecallAlert.communicationDetails?.textMessage);
    } else {
      setTextMessage('');
    }
  }, [updatedRecallAlert?.communicationDetails]);

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

    setTextMessage(newValue);

    setTimeout(() => {
      textarea.focus();
      const cursorPos = before.length + tagToInsert.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const handleClose = () => {
    onClose();
    setPhoneNumberForTest('');
  };

  const renderTagItem = (tag: string) => {
    const canRender = tag !== '{{Shortlink}}';

    if (!canRender) return null;

    return (
      <li className={classes.tagItem}>
        <span className={classes.insertTag} onClick={() => handleInsertTag(tag)}>
          {tag}
        </span>
        <LightTooltip width={110} title="Copy to clipboard" placement="top-start">
          <button
            type="button"
            className={classes.copyTag}
            onClick={e => {
              e.stopPropagation();
              navigator.clipboard.writeText(tag);
              const input = autocompleteRef.current?.querySelector('input');
              if (input) (input as HTMLElement).blur();
              showMessage('Tag copied to clipboard');
            }}
          >
            <p className={classes.copyWrapper}>
              <CopyIcon />
              <span className={classes.copyText}>Copy</span>
            </p>
          </button>
        </LightTooltip>
      </li>
    );
  };

  const sendTestMessage = () => {
    if (selectedSC?.id && textMessage.length && phoneNumberForTest.length) {
      dispatch(
        sendTestSMSMessage(
          selectedSC.id,
          phoneNumberForTest,
          textMessage,
          () => showMessage('Message sent successfully'),
          () => showError('Failed to send test message')
        )
      );
    }
  };

  const handleSaveText = () => {
    if (updatedRecallAlert && selectedSC)
      dispatch(
        updateRecallAlertText(
          {
            id: updatedRecallAlert?.id,
            serviceCenterId: selectedSC?.id,
            communicationDetails: {
              textMessage,
            },
          },
          tableType,
          () => {
            onClose();
          },
          () => {}
        )
      );
  };

  if (!updatedRecallAlert) return <></>;
  return (
    <BaseModal open={open} width={810} onClose={handleClose}>
      <DialogTitle onClose={handleClose}>
        Text Configuration for {updatedRecallAlert.name}
      </DialogTitle>
      <DialogContent>
        <div className={classes.wrapper}>
          <div className={classes.integrationBlock}>
            <div className={classes.integrationWrapper}>
              <p className={classes.integrationText}>Integration</p>
              {updatedRecallAlert.communicationDetails?.textMessage ? (
                <p className={classes.configuredComponent}>
                  <CheckIcon />{' '}
                  <span style={{ color: '#7898FF' }} className={classes.configuredColor}>
                    Configured
                  </span>
                </p>
              ) : (
                <p className={classes.configuredComponent}>
                  <RedCross /> <span className={classes.notConfiguredColor}>Not Configured</span>
                </p>
              )}
            </div>
            <div className={classes.tagsWrapper}>
              <span className={classes.insertTagText}>Insert tag</span>
              <div className={classes.scrollableTags}>
                {customerRecallTags.map(tag => renderTagItem(tag))}
              </div>
            </div>
          </div>

          <div className={classes.textMessageWrapper}>
            <div>
              <Textarea
                inputRef={textareaRef}
                fullWidth
                multiline
                style={{ marginBottom: 4 }}
                placeholder="Enter text message"
                label="Message"
                onChange={e => {
                  if (e.target.value.length <= 1000) setTextMessage(e.target.value);
                }}
                value={textMessage}
                rows={11}
              />
            </div>

            <div className={classes.charactersCounter}>
              <span>Approximate Characters: {textMessage?.length || 0} / 1000</span>
            </div>

            <div className={classes.testMessageWrapper}>
              <p className={classes.testMessageText}>
                <span>Send Test Message</span>
                <LightTooltip
                  title="Test messages will display the tag field name and not actual values"
                  placement="top-start"
                  slotProps={{
                    tooltip: {
                      sx: { maxWidth: 196 },
                    },
                  }}
                >
                  <span className={classes.infoIcon}>
                    <Info />
                  </span>
                </LightTooltip>
              </p>
              <div className={classes.numberForm}>
                <TextField
                  fullWidth
                  value={phoneNumberForTest}
                  placeholder="+1 (555) 123-4567"
                  onChange={e => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length > 11) val = val.slice(0, 11);
                    setPhoneNumberForTest(val);
                  }}
                  inputProps={{ maxLength: 11 }}
                />
                <div className={classes.sendButton}>
                  <Button
                    color="primary"
                    disabled={phoneNumberForTest.length !== 11 || textMessage.length < 3}
                    onClick={sendTestMessage}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <div className={classes.testMessage}>
          <div className={classes.buttonsWrapper}>
            <Button onClick={handleClose} color="primary" variant="outlined">
              Cancel
            </Button>
            <LoadingButton
              onClick={() => {
                setPhoneNumberForTest('');
                handleSaveText();
              }}
              disabled={textMessage?.trim().length < 3}
              variant="contained"
              color="primary"
            >
              Save
            </LoadingButton>
          </div>
        </div>
      </DialogActions>
    </BaseModal>
  );
};

export default TextConfigurationRecall;
