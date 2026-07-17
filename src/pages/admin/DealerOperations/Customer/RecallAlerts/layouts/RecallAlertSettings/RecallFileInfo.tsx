import React from 'react';
import { RecallListType } from '../../../../../../../store/reducers/recall/types';
import { formatFileSize } from './recallForm.utils';

interface IRecallFileInfoProps {
  listType: RecallListType;
  file: File | null;
  vinsFileLink?: string;
}

const RecallFileInfo: React.FC<IRecallFileInfoProps> = ({ listType, file, vinsFileLink }) => {
  if (listType !== RecallListType.UPLOAD_CSV) return null;

  if (file) {
    return (
      <span>
        {file.name} ({formatFileSize(file.size)})
      </span>
    );
  }

  if (!file && vinsFileLink) {
    return <span>{vinsFileLink}</span>;
  }

  return null;
};

export default RecallFileInfo;
