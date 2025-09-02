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
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';

type TCustomerTextConfigurationProps = DialogProps & {
  event: DashboardItemI | null;
  setTextMessage: (textMessage: string) => void;
  textMessage: string;
  handleSaveText: () => void;
};

const CustomerTextConfiguration = ({
  onClose,
  open,
  event,
  setTextMessage,
  textMessage,
  handleSaveText,
}: TCustomerTextConfigurationProps) => {
  if (!event) return <></>;

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const { textIntegrationSettings } = useSelector((state: RootState) => state.dealerOperations);

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
  };

  const renderTagItem = (tag: string) => {
    const canRender = tag !== '{{Shortlink}}' || textIntegrationSettings?.schedulingPageShortLink;

    if (!canRender) return null;

    return (
      <li
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <span style={{ cursor: 'pointer', fontSize: 16 }} onClick={() => handleInsertTag(tag)}>
          {tag}
        </span>
        <button
          type="button"
          style={{
            border: 'none',
            outline: 'none',
            background: 'none',
            cursor: 'pointer',
          }}
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

  return (
    <BaseModal open={open} width={602} onClose={handleClose}>
      <DialogTitle onClose={handleClose}>Text Configuration for {event.name}</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ width: '45%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 32 }}>
              <p
                style={{
                  textTransform: 'uppercase',
                  margin: 0,
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                Integration
              </p>
              {textIntegrationSettings?.fromPhoneNumber ? (
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckIcon /> <span style={{ color: '#7898FF' }}>Configured</span>
                </p>
              ) : (
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RedCross /> <span style={{ color: '#C71062' }}>Not Configured</span>
                </p>
              )}
            </div>
            <div>
              <span
                style={{
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontSize: 12,
                  display: 'block',
                  marginBottom: 8,
                }}
              >
                Insert tag
              </span>
              {customerTags.map(tag => renderTagItem(tag))}
            </div>
          </div>

          <div style={{ width: '51%' }}>
            <div style={{ marginTop: 24 }}>
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
                rows={20}
              />
            </div>

            <div
              style={{
                textAlign: 'right',
                color: '#858585',
                fontWeight: 300,
              }}
            >
              <span>Approximate Characters: {textMessage?.length || 0}/1000</span>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="info">
          Cancel
        </Button>
        <LoadingButton
          onClick={handleSaveText}
          disabled={textMessage.length < 3 || textIntegrationSettings?.fromPhoneNumber === null}
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
