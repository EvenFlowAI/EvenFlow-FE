import React, { useEffect, useRef } from 'react';
import { DialogProps } from '../../BaseModal/types';
import { BaseModal, DialogActions, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { Button, styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import { Textarea } from '../../../../features/admin/RecallsParts/AddRecallModal/styles';
import { LoadingButton } from '../../../buttons/LoadingButton/LoadingButton';
import { ReactComponent as CopyIcon } from '../../../../assets/img/copy.svg';
import { customerTags } from '../../../../config/data';
import { ReactComponent as Info } from '../../../../assets/img/info.svg';
import { ReactComponent as CheckIcon } from '../../../../assets/img/checkboxSmall.svg';
import { ReactComponent as RedCross } from '../../../../assets/img/redCross.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { Loading } from '../../../wrappers/Loading/Loading';
import {
  sendTestSMSMessage,
  setTextMessage,
} from '../../../../store/reducers/dealerOperations/actions';
import { useStyles } from './styles';
import { TextField } from '../../../formControls/TextFieldStyled/TextField';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useException } from '../../../../hooks/useException/useException';
import { useMessage } from '../../../../hooks/useMessage/useMessage';

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
  const { textIntegrationSettings, textMessage, eventForTextConfiguration } = useSelector(
    (state: RootState) => state.dealerOperations
  );
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
    setPhoneNumberForTest('');
  };

  const renderTagItem = (tag: string) => {
    const canRender = tag !== '{{Shortlink}}' || textIntegrationSettings?.schedulingPageShortLink;

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
            <CopyIcon />
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
              <div className={classes.tagsWrapper}>
                <span className={classes.insertTagText}>Insert tag</span>
                <div className={classes.scrollableTags}>
                  {customerTags.map(tag => renderTagItem(tag))}
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
                    if (e.target.value.length <= 1000) dispatch(setTextMessage(e.target.value));
                  }}
                  value={textMessage}
                  rows={22}
                />
              </div>

              <div className={classes.charactersCounter}>
                <span>Approximate Characters: {textMessage?.length || 0} / 1000</span>
              </div>
            </div>
          </div>
          <div className={classes.testMessageWrapper}>
            <p className={classes.testMessageText}>
              <span>Send Test Message</span>
              <LightTooltip
                width={185}
                title="Test messages will display the tag field name and not actual values"
                placement="top-start"
              >
                <Info />
              </LightTooltip>
            </p>
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
          </div>
        </DialogContent>
      )}
      <DialogActions>
        <div className={classes.testMessage}>
          <Button
            color="primary"
            disabled={
              phoneNumberForTest.length !== 11 ||
              !textIntegrationSettings?.fromPhoneNumber?.length ||
              textMessage.length < 3
            }
            className={classes.testMessageButton}
            onClick={sendTestMessage}
          >
            Send
          </Button>
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
