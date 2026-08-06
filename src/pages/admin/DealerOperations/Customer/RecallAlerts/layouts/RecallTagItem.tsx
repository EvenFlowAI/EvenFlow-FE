import React from 'react';
import { ReactComponent as CopyIcon } from '../../../../../../assets/img/copy.svg';
import { handleInsertTag } from '../../../../../../components/modals/admin/CustomerTextConfiguration/helper';
import { ITag } from '../../../../../../store/reducers/dealerOperations/types';
import { LightTooltip } from './LightTooltip';

type RecallTagItemClasses = {
  tagItem: string;
  insertTag: string;
  copyTag: string;
  copyWrapper: string;
  copyText: string;
};

type RecallTagItemProps = {
  tag: ITag;
  textMessage: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  disabled: boolean;
  showShortlink: boolean;
  classes: RecallTagItemClasses;
  onTextMessageChange: (message: string) => void;
  onCopy: (tag: string) => void;
};

export const RecallTagItem: React.FC<RecallTagItemProps> = ({
  tag,
  textMessage,
  textareaRef,
  disabled,
  showShortlink,
  classes,
  onTextMessageChange,
  onCopy,
}) => {
  if (tag.tag === '{{Shortlink}}' && !showShortlink) {
    return null;
  }

  return (
    <li className={classes.tagItem}>
      <span
        className={classes.insertTag}
        onClick={() => {
          if (disabled) return;

          handleInsertTag(tag.tag, textareaRef, textMessage, onTextMessageChange);
        }}
      >
        {tag.tag}
      </span>
      <LightTooltip width={110} title="Copy to clipboard" placement="top-start">
        <button
          type="button"
          className={classes.copyTag}
          onClick={e => {
            e.stopPropagation();
            onCopy(tag.tag);
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
