import React from 'react';
import { RecallListType } from '../../../../../../../store/reducers/recall/types';
import { formatFileSize } from './recallForm.utils';

interface IRecallFileInfoProps {
  listType: RecallListType;
  file: File | null;
  vinsFileLink?: string;
}

const RecallFileInfo: React.FC<IRecallFileInfoProps> = ({ listType, file, vinsFileLink }) => {
  if (listType !== RecallListType.CSV_UPLOADED) return null;

  if (file) {
    return (
      <span>
        Uploaded: {file.name} ({formatFileSize(file.size)})
      </span>
    );
  }

  if (!file && vinsFileLink) {
    return <span>Uploaded: {vinsFileLink}</span>;
  }

  return null;
};

export default RecallFileInfo;
