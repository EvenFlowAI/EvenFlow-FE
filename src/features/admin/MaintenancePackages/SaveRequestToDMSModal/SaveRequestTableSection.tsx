import React from 'react';
import { IconButton, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { CheckBoxOutlineBlank, CheckBoxOutlined, Close } from '@mui/icons-material';
import { IPackageOptionDetailed } from '../../../../api/types';

type TRequestItem = {
  id: number;
  orderIndex: number;
  code: string;
  description: string;
};

type TClasses = {
  headerCell: string;
  headerCellBlack: string;
  emptyRow: string;
  row: string;
  rowGrey: string;
  requestCell: string;
};

type TProps = {
  title: string;
  requests: TRequestItem[];
  options: IPackageOptionDetailed[];
  classes: TClasses;
  getCellClass: (cellIndex: number, rowIndex: number) => string | undefined;
  onToggle: (option: IPackageOptionDetailed, requestId: number) => void;
  getRequestState: (
    option: IPackageOptionDetailed,
    requestId: number
  ) => { isSendToDMS: boolean } | undefined;
};

export const SaveRequestTableSection: React.FC<TProps> = ({
  title,
  requests,
  options,
  classes,
  getCellClass,
  onToggle,
  getRequestState,
}) => {
  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell className={classes.headerCell} key={`${title}-header`}>
            {title}
          </TableCell>
          {options.map(option => (
            <TableCell
              className={classes.headerCellBlack}
              align="center"
              key={`${title}-${option.type}`}
            >
              {option.name}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow className={classes.emptyRow} key={`${title}-empty`} />
        {requests
          .slice()
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((request, rowIndex) => {
            return (
              <TableRow
                className={rowIndex % 2 === 0 ? classes.row : classes.rowGrey}
                key={request.code}
              >
                <TableCell className={classes.requestCell} key={request.description}>
                  {request.description}
                </TableCell>
                {options.map((option, cellIndex) => {
                  const requestInOption = getRequestState(option, request.id);

                  return (
                    <TableCell
                      className={getCellClass(cellIndex, rowIndex)}
                      key={`${option.type}-${request.id}`}
                      align="center"
                    >
                      <IconButton onClick={() => onToggle(option, request.id)} size="large">
                        {requestInOption ? (
                          requestInOption.isSendToDMS ? (
                            <CheckBoxOutlined htmlColor="#3855FE" />
                          ) : (
                            <CheckBoxOutlineBlank htmlColor="#DADADA" />
                          )
                        ) : (
                          <Close htmlColor="#DADADA" />
                        )}
                      </IconButton>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
      </TableBody>
    </>
  );
};
