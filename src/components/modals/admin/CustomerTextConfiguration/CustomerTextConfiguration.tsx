import React, { useEffect, useRef } from 'react';
import { DialogProps } from '../../BaseModal/types';
import { BaseModal, DialogActions, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { Button, styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import { Textarea } from '../../../../features/admin/RecallsParts/AddRecallModal/styles';
import { LoadingButton } from '../../../buttons/LoadingButton/LoadingButton';
import { ReactComponent as CopyIcon } from '../../../../assets/img/copy.svg';
import { ReactComponent as Info } from '../../../../assets/img/info.svg';
import { ReactComponent as CheckIcon } from '../../../../assets/img/checkboxSmallGreen.svg';
import { ReactComponent as RedCross } from '../../../../assets/img/redCross.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { Loading } from '../../../wrappers/Loading/Loading';
import {
  loadExistingTags,
  sendTestSMSMessage,
  setTextMessage,
} from '../../../../store/reducers/dealerOperations/actions';
import { useStyles } from './styles';
import { TextField } from '../../../formControls/TextFieldStyled/TextField';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useException } from '../../../../hooks/useException/useException';
import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { ITag } from '../../../../store/reducers/dealerOperations/types';
import { handleInsertTag } from './helper';

type TCustomerTextConfigurationProps = DialogProps & {
  handleSaveText: () => void;
  isLoading: boolean;
};

interface LightTooltipProps extends TooltipProps {
  width?: string | number;
}

const CustomerTextConfiguration = ({
  onClose,
  open,
  handleSaveText,
  isLoading,
}: TCustomerTextConfigurationProps) => {
  const {
    textIntegrationSettings,
    textMessage,
    eventForTextConfiguration,
    availableTagsForOutboundEvents,
  } = useSelector((state: RootState) => state.dealerOperations);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { selectedSC } = useSCs();
  const showError = useException();
  const showMessage = useMessage();

  const dispatch = useDispatch();
  const { classes } = useStyles();

  const [phoneNumberForTest, setPhoneNumberForTest] = React.useState<string>('');

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
    if (open) {
      setLoading(true);
      dispatch(
        loadExistingTags('OutboundEvent', () => {
          setLoading(false);
        })
      );
    }
  }, [open]);

  useEffect(() => {
    return () => {
      dispatch(setTextMessage(''));
    };
  }, []);

  const handleClose = () => {
    onClose();
    setPhoneNumberForTest('');
  };

  const renderTagItem = (element: ITag) => {
    const canRender =
      element.tag !== '{{Shortlink}}' || textIntegrationSettings?.schedulingPageShortLink;

    if (!canRender) return null;

    return (
      <li key={element.tag} className={classes.tagItem}>
        <span
          className={classes.insertTag}
          onClick={() =>
            handleInsertTag(element.tag, textareaRef, textMessage, (newTextMessage: string) => {
              dispatch(setTextMessage(newTextMessage));
            })
          }
        >
          {element.tag}
        </span>
        <LightTooltip width={110} title="Copy to clipboard" placement="top-start">
          <button
            type="button"
            className={classes.copyTag}
            onClick={e => {
              e.stopPropagation();
              navigator.clipboard.writeText(element.tag);
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

  const LightTooltip = styled(({ className, ...props }: LightTooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))<LightTooltipProps>(({ theme, width }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      width: typeof width === 'number' ? `${width}px` : width || '195px',
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 12,
    },
  }));

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

  if (!eventForTextConfiguration) return <></>;

  return (
    <BaseModal open={open} width={810} onClose={handleClose}>
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
              {loading ? (
                <Loading />
              ) : (
                <div className={classes.tagsWrapper}>
                  <span className={classes.insertTagText}>Insert tag</span>
                  <div className={classes.scrollableTags}>
                    {availableTagsForOutboundEvents?.map(tag => renderTagItem(tag))}
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
                  style={{ marginBottom: 4 }}
                  placeholder="Enter text message"
                  label="Message"
                  onChange={e => {
                    if (e.target.value.length <= 1000) dispatch(setTextMessage(e.target.value));
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
                    placeholder="1xxxxxxxxxx"
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
                      disabled={
                        phoneNumberForTest.length !== 11 ||
                        !textIntegrationSettings?.fromPhoneNumber?.length ||
                        textMessage.length < 3
                      }
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
      )}
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
                textMessage.trim().length < 3 ||
                textIntegrationSettings?.fromPhoneNumber === null ||
                isLoading
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

export default CustomerTextConfiguration;
