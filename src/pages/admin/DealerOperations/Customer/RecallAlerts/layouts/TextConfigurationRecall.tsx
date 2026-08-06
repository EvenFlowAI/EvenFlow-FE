import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { Textarea } from '../../../../../../components/modals/admin/MapIframeLink/styles';
import { ReactComponent as CheckIcon } from '../../../../../../assets/img/checkboxSmallGreen.svg';
import { ReactComponent as RedCross } from '../../../../../../assets/img/redCross.svg';
import { ReactComponent as Info } from '../../../../../../assets/img/info.svg';
import { IRecallAlert } from '../../../../../../store/reducers/recall/types';
import { TextField } from '../../../../../../components/formControls/TextFieldStyled/TextField';
import { DialogProps } from '../../../../../../components/modals/BaseModal/types';
import {
  loadExistingTags,
  sendTestSMSMessage,
} from '../../../../../../store/reducers/dealerOperations/actions';
import { updateRecallAlertText } from '../../../../../../store/reducers/recall/actions';
import { LightTooltip } from './LightTooltip';
import { RecallTagItem } from './RecallTagItem';
import { RootState } from '../../../../../../store/rootReducer';
import { Loading } from '../../../../../../components/wrappers/Loading/Loading';
import { RecallEventStatus } from '../../types';

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
  const [loading, setLoading] = React.useState<boolean>(false);
  const { textIntegrationSettings, availableTagsForRecallAlerts } = useSelector(
    (state: RootState) => state.dealerOperations
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (updatedRecallAlert?.communicationDetails?.textMessage?.length) {
      setTextMessage(updatedRecallAlert.communicationDetails?.textMessage);
    } else {
      setTextMessage('');
    }
  }, [updatedRecallAlert?.communicationDetails, open]);

  useEffect(() => {
    setTimeout(() => {
      const textarea = textareaRef.current;

      if (textarea) {
        textarea.focus();
        const cursorPos = textMessage.length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      }
    }, 0);

    if (open) {
      setLoading(true);
      dispatch(
        loadExistingTags('RecallAlert', () => {
          setLoading(false);
        })
      );
    }
  }, [open]);

  useEffect(() => {
    return () => {
      setTextMessage('');
    };
  }, []);

  const handleClose = () => {
    onClose();
    setPhoneNumberForTest('');
    setTextMessage('');
  };

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    const input = autocompleteRef.current?.querySelector('input');
    if (input) (input as HTMLElement).blur();
    showMessage('Tag copied to clipboard');
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
            recallCampaignId: updatedRecallAlert?.recallCampaignId,
            listType: updatedRecallAlert?.listType,
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
              {textIntegrationSettings?.fromPhoneNumber ? (
                <p className={classes.configuredComponent}>
                  <CheckIcon />{' '}
                  <span style={{ color: '#5FA077' }} className={classes.configuredColor}>
                    Configured
                  </span>
                </p>
              ) : (
                <p className={classes.configuredComponent}>
                  <RedCross /> <span className={classes.notConfiguredColor}>Not Configured</span>
                </p>
              )}
            </div>
            {loading ? (
              <Loading />
            ) : (
              <div className={classes.tagsWrapper}>
                <span className={classes.insertTagText}>Insert tag</span>
                <div className={classes.scrollableTags}>
                  {availableTagsForRecallAlerts?.map(tag => (
                    <RecallTagItem
                      key={tag.tag}
                      tag={tag}
                      textMessage={textMessage}
                      textareaRef={textareaRef}
                      disabled={updatedRecallAlert?.status === RecallEventStatus.Completed}
                      showShortlink={Boolean(textIntegrationSettings?.schedulingPageShortLink)}
                      onTextMessageChange={setTextMessage}
                      onCopy={handleCopyTag}
                      classes={{
                        tagItem: classes.tagItem,
                        insertTag: classes.insertTag,
                        copyTag: classes.copyTag,
                        copyWrapper: classes.copyWrapper,
                        copyText: classes.copyText,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={classes.textMessageWrapper}>
            <div>
              <Textarea
                inputRef={textareaRef}
                fullWidth
                multiline
                disabled={
                  updatedRecallAlert && updatedRecallAlert?.status === RecallEventStatus.Completed
                }
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
              disabled={
                textMessage?.trim().length < 3 ||
                updatedRecallAlert?.status === RecallEventStatus.Completed
              }
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
