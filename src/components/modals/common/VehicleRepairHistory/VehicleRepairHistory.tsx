import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { loadRepairHistory } from '../../../../store/reducers/enhancedCustomerSearch/actions';
import { BaseModal, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { DialogProps } from '../../BaseModal/types';
import { Button, Divider, Table, TableBody, TableHead, TableRow } from '@mui/material';
import { Loading } from '../../../wrappers/Loading/Loading';
import classnames from 'classnames';
import { NoData } from '../../../wrappers/NoData/NoData';
import { HCell, TCell, useStyles } from './styles';
import dayjs from 'dayjs';

const VehicleRepairHistory: React.FC<
  React.PropsWithChildren<
    React.PropsWithChildren<
      DialogProps & { vehicleId: string | number; customerId: number | string }
    >
  >
> = ({ customerId, vehicleId, open, onClose }) => {
  const { repairHistoryLoading, repairHistory } = useSelector(
    (state: RootState) => state.customers
  );
  const [pageIndex, setPageIndex] = useState<number>(0);
  const dispatch = useDispatch();
  const { classes } = useStyles();

  useEffect(() => {
    if (customerId && vehicleId && open) {
      dispatch(loadRepairHistory(customerId, vehicleId, 0, 0));
    }
  }, [customerId, vehicleId, open]);

  const onCancel = () => {
    onClose();
  };

  const onLoadMore = () => {
    setPageIndex(pageIndex + 1);
  };

  return (
    <BaseModal open={open} width={1300} onClose={onCancel}>
      <DialogTitle onClose={onCancel}>Repair Order History</DialogTitle>
      <DialogContent>
        {repairHistoryLoading ? (
          <Loading />
        ) : !repairHistory ? (
          <NoData />
        ) : (
          <div className={classes.wrapper}>
            <div className={classes.rightHeaderPart}>
              <div className={classes.textBig} style={{ paddingBottom: 12 }}>
                Customer & Vehicle Information:
              </div>
              <div className={classes.nameLineGrid}>
                <div className={classes.name}>
                  {repairHistory?.firstName} {repairHistory?.lastName}
                </div>
                <div>
                  <span className={classes.titleSmall}>Cell: </span>
                  {repairHistory?.cellPhone}
                </div>
                <div>
                  <span className={classes.titleSmall}>Home: </span>
                  {repairHistory?.homePhone}
                </div>
              </div>
              <Divider style={{ marginTop: 18, marginBottom: 24, padding: 0 }} />
              <div className={classnames(classes.carDataGrid)}>
                <div>
                  <div className={classes.titleSmall}>Year:</div>
                  <div className={classes.textSmall}>{repairHistory?.year}</div>
                </div>
                <div>
                  <div className={classes.titleSmall}>Make:</div>
                  <div className={classes.textSmall}>{repairHistory?.make}</div>
                </div>
                <div>
                  <div className={classes.titleSmall}>Model:</div>
                  <div className={classes.textSmall}>{repairHistory?.model}</div>
                </div>
                <div>
                  <div className={classes.titleSmall}>Vin:</div>
                  <div className={classes.textSmall}>{repairHistory?.vin}</div>
                </div>
              </div>
            </div>
            <div className={classes.textBig} style={{ paddingBottom: 16 }}>
              Prior Repair Orders:
            </div>
            {repairHistory?.repairOrders.slice(0, (pageIndex + 1) * 2).map(item => (
              <div className={classes.orderWrapper} key={item.date}>
                <div className={classes.orderMainData}>
                  <div className={classnames(classes.gridTableHead)}>
                    <div className={classnames(classes.titleNonUpperCase, classes.padding)}>
                      {item.number ? `#${item.number}` : ''}
                    </div>
                    <div className={classnames(classes.titleNonUpperCase, classes.padding)}>
                      {dayjs(item.date.split('T')[0]).format('dddd, MMMM DD, YYYY')}
                    </div>
                  </div>
                  <div className={classes.padding}>
                    <span className={classes.titleNonUpperCase}>Repair Order:</span>
                    <span className={classnames(classes.uppercase, classes.textSmaller)}>
                      {' '}
                      total/tax{' '}
                    </span>
                    <div>{item.totalPrice ? `$${item.totalPrice.toFixed(2)} / $0.00` : ''} </div>
                  </div>
                </div>
                <div className={classes.greyRow}></div>
                <div className={classes.orderMainData}>
                  <div className={classes.orderMainDataLeft}>
                    <div className={classes.orderMainDataLeftTop}>
                      <div className={classes.smallPadding}>
                        <div className={classes.titleNonUpperCase}>RO Status:</div>
                        <div>{item.status}</div>
                      </div>
                      <div className={classes.smallPadding}>
                        <div className={classes.titleNonUpperCase}>Mileage:</div>
                        <div>{item.mileage}</div>
                      </div>
                      <div className={classes.smallPadding}>
                        <div className={classes.titleNonUpperCase}>Advisor:</div>
                        <div>{item.advisor}</div>
                      </div>
                      <div className={classes.smallPadding}>
                        <div className={classes.titleNonUpperCase}>Tech Labor Time:</div>
                        <div>{item.technicianLaborTime}</div>
                      </div>
                    </div>
                  </div>
                  <div className={classes.orderMainDataRightTop}>
                    <div className={classes.smallPadding}>
                      <span className={classes.titleNonUpperCase}>Warranty: </span>
                      <span className={classnames(classes.uppercase, classes.textSmaller)}>
                        {' '}
                        total/tax
                      </span>
                      <div>
                        {item.warrantyPrice ? `$${item.warrantyPrice.toFixed(2)} / $0.00` : ''}{' '}
                      </div>
                    </div>
                    <div className={classes.smallPadding}>
                      <span className={classes.titleNonUpperCase}>Customer Pay: </span>
                      <span className={classnames(classes.uppercase, classes.textSmaller)}>
                        {' '}
                        total/tax
                      </span>
                      <div>
                        {item.customerPayPrice
                          ? `$${item.customerPayPrice.toFixed(2)} / $0.00`
                          : ''}{' '}
                      </div>
                    </div>
                    <div className={classes.smallPadding}>
                      <span className={classes.titleNonUpperCase}>Misc: </span>
                      <span className={classnames(classes.uppercase, classes.textSmaller)}>
                        {' '}
                        total/tax
                      </span>
                      <div>{item.miscPrice ? `$${item.miscPrice.toFixed(2)} / $0.00` : ''} </div>
                    </div>
                  </div>
                </div>
                <div className={classes.orderMainData}>
                  <div className={classnames(classes.borderRight, classes.padding)}>
                    <div className={classes.titleNonUpperCase}>Services Performed:</div>
                    <ol>
                      {item.services.map(service => {
                        return (
                          <li key={service.correction} className={classes.serviceItem}>
                            <div>
                              <span className={classes.italic}>Complaint: </span>
                              {service.complaint}
                            </div>
                            <div>
                              <span className={classes.italic}>Correction: </span>
                              {service.correction}
                            </div>
                            <div>
                              <span className={classes.italic}>Cause: </span>
                              {service.cause}
                            </div>
                            <div className={classes.titleNonUpperCase}>Labors:</div>
                            <ul>
                              {service.labors.map(item => {
                                return (
                                  <li key={item.title}>
                                    <div>
                                      <span>
                                        [Tech {item.technicianDmsId} {item.technicianName}]
                                      </span>{' '}
                                      <span className={classes.titleNonUpperCase}>
                                        {item.title}
                                      </span>
                                    </div>
                                    <div>
                                      <span className={classes.italic}>Description: </span>{' '}
                                      {item.description}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                  <div className={classes.padding}>
                    <div className={classes.titleNonUpperCase}>Parts Used:</div>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <HCell align="center" key="Part number">
                            Part number
                          </HCell>
                          <HCell key="description">Description</HCell>
                          <HCell key="Quantity">Quantity</HCell>
                          <HCell key="Part price">Part price, $</HCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {item.parts.map((part, index) => {
                          return (
                            <TableRow key={index}>
                              <TCell>
                                <span className={classes.titleNonUpperCase}>{index + 1}.</span>{' '}
                                {part.id}
                              </TCell>
                              <TCell>{part.description}</TCell>
                              <TCell>{part.qantity}</TCell>
                              <TCell>{part.price}</TCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className={classnames(classes.smallPadding, classes.borderTop)}>
                  <div className={classes.titleNonUpperCase}>Comments:</div>
                  {item.comments && item.comments.map(comment => <div>{comment}</div>)}
                </div>
              </div>
            ))}
            {repairHistory?.repairOrders.length > (pageIndex + 1) * 2 ? (
              <div className={classes.centered}>
                <Button
                  variant="text"
                  onClick={onLoadMore}
                  style={{ textTransform: 'none', color: 'blue', marginTop: 8 }}
                >
                  Load More
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </DialogContent>
    </BaseModal>
  );
};

export default VehicleRepairHistory;
