import type { RefObject } from 'react';

export const handleInsertTag = (
  tag: string,
  textareaRef: RefObject<HTMLTextAreaElement>,
  textMessage: string,
  setTextMessage: (value: string) => void
) => {
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
