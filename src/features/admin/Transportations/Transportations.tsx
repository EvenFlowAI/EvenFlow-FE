import React, { useEffect, useState } from 'react';
import { NoItemsLoading } from '../../../components/wrappers/NoItemsLoading/NoItemsLoading';
import { IconButton, Menu, MenuItem, Switch, TableBody, TableCell, TableHead } from '@mui/material';
import { getTransportationOptionString } from '../../../utils/utils';
import {
  ETransportationType,
  ITransportationOptionFull,
} from '../../../store/reducers/transportationNeeds/types';
import { MoreHoriz } from '@mui/icons-material';
import {
  loadTransportationOptions,
  updateTransportationOption,
} from '../../../store/reducers/transportationNeeds/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { HeaderCell, TableWrapper, OpCodeValue } from './styles';
import { EditTransportationModal } from './EditTransportationModal/EditTransportationModal';
import { EditTransportationDescriptionModal } from './EditTransportationDescriptionModal/EditTransportationDescriptionModal';
import { DemandTable } from '../../../components/styled/DemandTable';
import { TableRow } from '../../../components/styled/TableRow';
import { useModal } from '../../../hooks/useModal/useModal';
import { useException } from '../../../hooks/useException/useException';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { servicesRoot } from '../../../utils/constants';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { loadFirstScreenOptionsList } from '../../../store/reducers/serviceTypes/actions';
import { loadBookingFlowConfig } from '../../../store/reducers/bookingFlowConfig/actions';
import { EServiceType } from '../../../store/reducers/appointmentFrameReducer/types';
import { useHistory } from 'react-router-dom';
import { Routes } from '../../../routes/constants';
import { QueryTypes, ServiceValetRoutes } from '../../../routes/types';

export const Transportations = () => {
  const { push } = useHistory();
  const { options, isLoading } = useSelector((state: RootState) => state.transportation);
  const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
  const { config } = useSelector((state: RootState) => state.bookingFlowConfig);
  const [editingElement, setEditingElement] = useState<ITransportationOptionFull | null>(null);
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null);
  const { selectedSC } = useSCs();
  const showError = useException();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useModal();
  const { isOpen: isOptionOpen, onOpen: onOptionOpen, onClose: onOptionClose } = useModal();

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadTransportationOptions(selectedSC.id));
      dispatch(loadFirstScreenOptionsList(selectedSC.id));
      dispatch(loadBookingFlowConfig(selectedSC.id));
    }
  }, [selectedSC]);

  const closeMenu = () => {
    setEditingElement(null);
    setAnchorEl(null);
  };

  const handleSwitch = (id: number) => async (e: any, value: boolean) => {
    const option = options.find(item => item.id === id);
    if (selectedSC && option) {
      const pickUpConfig = config.find(el => el.serviceType === EServiceType.PickUpDropOff);
      const pickUpOption = firstScreenOptions.find(el => el.type === EServiceType.PickUpDropOff);
      const isValid =
        value && option?.type === ETransportationType.PickUpDelivery
          ? pickUpConfig?.available && pickUpOption
          : true;
      if (isValid) {
        try {
          dispatch(
            updateTransportationOption({
              ...option,
              state: value ? 1 : 0,
              serviceCenterId: selectedSC.id,
            })
          );
        } catch (e) {
          showError(e);
        }
      } else {
        if (!pickUpConfig?.available)
          showError('Pick Up / Drop Off booking flow configuration must be "ON"');
        if (!pickUpOption) showError('"Service Valet" First Screen Option should be added');
      }
    }
  };

  const openMenu =
    (el: ITransportationOptionFull) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setEditingElement(el);
      setAnchorEl(e.currentTarget);
    };

  useEffect(() => {
    if (editingElement?.id) {
      const foundEditingElement = options?.find(option => option.id === editingElement.id);
      if (foundEditingElement) {
        setEditingElement(foundEditingElement);
      }
    }
  }, [options]);

  const onManageRules = () => {
    setAnchorEl(null);
    onOpen();
  };

  const onManageOption = () => {
    setAnchorEl(null);
    onOptionOpen();
  };

  const handleServiceValetRedirection = (redirect: boolean) => {
    if (redirect) {
      push(
        `${Routes.Services.ServiceValet}?${QueryTypes.selectedTab}=${ServiceValetRoutes.CenterSettings}`
      );
    }
  };

  const renderOpCodeCol = (type: number, opCode?: string) => {
    if (type === ETransportationType.PickUpDelivery) {
      return 'Service valet';
    }
    return opCode ?? '';
  };

  return (
    <>
      <TitleContainer title="Other Transportation" pad parent={servicesRoot} />
      <div style={{ padding: 16, width: '100%' }}>
        <NoItemsLoading items={options} loading={isLoading} />
        {options.length ? (
          <TableWrapper>
            <DemandTable>
              <TableHead>
                <TableRow>
                  <HeaderCell
                    key="1"
                    style={{ textTransform: 'capitalize' }}
                    align="left"
                    width={200}
                  >
                    Transportation Option
                  </HeaderCell>
                  <HeaderCell
                    width={200}
                    key="3"
                    align="left"
                    style={{ textTransform: 'capitalize' }}
                  >
                    Description
                  </HeaderCell>
                  <HeaderCell
                    width={150}
                    key="2"
                    align="left"
                    style={{ textTransform: 'capitalize' }}
                  >
                    Order Index
                  </HeaderCell>
                  <HeaderCell
                    width={150}
                    key="6"
                    align="left"
                    style={{ textTransform: 'capitalize' }}
                  >
                    OP Code
                  </HeaderCell>
                  <HeaderCell
                    width={150}
                    key="4"
                    align="left"
                    style={{ textTransform: 'capitalize' }}
                  >
                    Manage
                  </HeaderCell>
                  <HeaderCell
                    key="5"
                    align="left"
                    width={150}
                    style={{ textTransform: 'capitalize' }}
                  >
                    Status (Off/ON)
                  </HeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {options.map(el => {
                  return (
                    <TableRow key={el.type}>
                      <TableCell key="1" align="left">
                        {getTransportationOptionString(el.type.toString())}
                      </TableCell>
                      <TableCell key="3" align="left">
                        {el.description}
                      </TableCell>
                      <TableCell key="2" align="left">
                        {el.orderIndex}
                      </TableCell>
                      <TableCell
                        onClick={() =>
                          handleServiceValetRedirection(
                            el.type === ETransportationType.PickUpDelivery
                          )
                        }
                        key="6"
                        align="left"
                      >
                        <OpCodeValue serviceValet={el.type === ETransportationType.PickUpDelivery}>
                          {renderOpCodeCol(el.type, el.opCode)}
                        </OpCodeValue>
                      </TableCell>
                      <TableCell key="4" align="left">
                        <IconButton size="small" onClick={openMenu(el)}>
                          <MoreHoriz />
                        </IconButton>
                      </TableCell>

                      <TableCell key="5" align="left">
                        <Switch
                          disabled={isLoading}
                          onChange={handleSwitch(el.id)}
                          checked={Boolean(el.state)}
                          color="primary"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </DemandTable>
          </TableWrapper>
        ) : null}
      </div>
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu}>
        <MenuItem onClick={() => onManageRules()}>Manage Rules</MenuItem>
        <MenuItem onClick={() => onManageOption()}>Manage Option</MenuItem>
      </Menu>
      <EditTransportationModal open={isOpen} onClose={onClose} editingElement={editingElement} />
      <EditTransportationDescriptionModal
        open={isOptionOpen}
        editingElement={editingElement}
        onClose={onOptionClose}
      />
    </>
  );
};
