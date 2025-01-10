import React, { useEffect, useState } from "react";
import { Loading } from "../../../../components/wrappers/Loading/Loading";
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "../../../../components/modals/BaseModal/BaseModal";
import { Button, IconButton, Menu, MenuItem, Switch } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/rootReducer";
import { DialogProps } from "../../../../components/modals/BaseModal/types";
import { MoreHoriz } from "@mui/icons-material";
import { ICustomerConsent } from "../../../../store/reducers/screenSettings/types";
import { useStyles } from "../styles";
import { useSCs } from "../../../../hooks/useSCs/useSCs";
import { TableRowDataType } from "../../../../types/types";
import { Table } from "../../../../components/tables/Table/Table";
import { useConfirm } from "../../../../hooks/useConfirm/useConfirm";
import { useModal } from "../../../../hooks/useModal/useModal";
import { loadSCAdvisors } from "../../../../store/reducers/employees/actions";
import { loadSCRequestsShort } from "../../../../store/reducers/serviceRequests/actions";
import { loadMakesForPods } from "../../../../store/reducers/vehicleDetails/actions";
import {
  loadZonesByServiceType,
  removeCustomerConsent,
  toggleCustomerConsent,
} from "../../../../store/reducers/screenSettings/actions";
import { EServiceType } from "../../../../store/reducers/appointmentFrameReducer/types";
import { loadTransportationOptionsShort } from "../../../../store/reducers/transportationNeeds/actions";
import { useSelectedPod } from "../../../../hooks/useSelectedPod/useSelectedPod";
import EditCustomerConsentModal from "../EditCustomerConsentModal/EditCustomerConsentModal";
import { useException } from "../../../../hooks/useException/useException";

export const CustomerConsentsModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<DialogProps>>
> = ({ onClose, ...props }) => {
  const { consentsList, isConsentLoading } = useSelector(
    (state: RootState) => state.screenSettingsBooking,
  );
  const [data, setData] = useState<ICustomerConsent[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [currentConsent, setCurrentConsent] = useState<ICustomerConsent | null>(
    null,
  );
  const { selectedSC } = useSCs();
  const { classes } = useStyles();
  const { askConfirm } = useConfirm();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useModal();
  const { selectedPod } = useSelectedPod();
  const dispatch = useDispatch();
  const showError = useException();

  useEffect(() => {
    setData([...consentsList].sort((a, b) => a.name.localeCompare(b.name)));
  }, [consentsList]);

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadSCAdvisors(selectedSC.id));
      dispatch(loadSCRequestsShort(selectedSC.id));
      dispatch(loadMakesForPods(selectedSC.id));
    }
  }, [selectedSC]);

  useEffect(() => {
    if (selectedSC) {
      dispatch(
        loadZonesByServiceType(
          selectedSC.id,
          EServiceType.MobileService,
          selectedPod?.id,
        ),
      );
      dispatch(
        loadZonesByServiceType(
          selectedSC.id,
          EServiceType.PickUpDropOff,
          selectedPod?.id,
        ),
      );
      dispatch(loadTransportationOptionsShort(selectedSC.id, selectedPod?.id));
    }
  }, [selectedSC, selectedPod]);

  const onCancel = () => {
    onClose();
  };

  const handleSwitch = (el: ICustomerConsent) => (e: any, value: boolean) => {
    if (selectedSC) {
      dispatch(
        toggleCustomerConsent(
          selectedSC.id,
          el.id,
          value,
          showError,
          selectedPod?.id,
        ),
      );
    }
  };

  const handleRemove = async () => {
    if (selectedSC && currentConsent) {
      dispatch(
        removeCustomerConsent(
          currentConsent.id,
          selectedSC.id,
          showError,
          selectedPod?.id,
        ),
      );
    }
  };

  const openMenu =
    (el: ICustomerConsent) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setCurrentConsent(el);
      setAnchorEl(e.currentTarget);
    };

  const tableActions = (el: ICustomerConsent) => {
    return (
      <IconButton
        onClick={openMenu(el)}
        size="large"
        style={{ padding: "0px 9px" }}
      >
        <MoreHoriz />
      </IconButton>
    );
  };

  const rowData: TableRowDataType<ICustomerConsent>[] = [
    {
      header: "Name",
      val: (el) => el.name,
      width: 430,
    },
    {
      header: "Status OFF/ON",
      val: (el) => (
        <Switch
          onChange={handleSwitch(el)}
          checked={el.isEnabled}
          color="primary"
        />
      ),
      align: "center",
    },
  ];

  const askRemove = () => {
    setAnchorEl(null);
    if (currentConsent) {
      askConfirm({
        isRemove: true,
        title: `Please confirm you want to remove Customer Consent ${currentConsent?.name}?`,
        onConfirm: handleRemove,
      });
    }
  };

  const onEdit = () => {
    setAnchorEl(null);
    onEditOpen();
  };

  const onAddConsent = () => {
    setCurrentConsent(null);
    onEditOpen();
  };

  return (
    <BaseModal {...props} width={700} onClose={onCancel}>
      <DialogTitle onClose={onCancel}>Customer Consent</DialogTitle>
      <DialogContent>
        <div className={classes.topBtnWrapper}>
          <Button variant="contained" onClick={onAddConsent}>
            Add Consent
          </Button>
        </div>
        {isConsentLoading ? (
          <Loading />
        ) : (
          <Table
            withBorders
            borderHeader
            data={data}
            index={"id"}
            actionsAlign="center"
            rowData={rowData}
            actions={tableActions}
            hidePagination
          />
        )}
        <Menu
          open={Boolean(anchorEl)}
          onClose={() => {
            setAnchorEl(null);
          }}
          anchorEl={anchorEl}
        >
          <MenuItem onClick={onEdit}>Edit</MenuItem>
          <MenuItem onClick={askRemove}>Remove</MenuItem>
        </Menu>
      </DialogContent>
      <DialogActions>
        <div className={classes.actionsWrapper}>
          <div className={classes.buttonsWrapper}>
            <Button disabled={isConsentLoading} color="info" onClick={onCancel}>
              Close
            </Button>
          </div>
        </div>
      </DialogActions>
      <EditCustomerConsentModal
        open={isEditOpen}
        onClose={onEditClose}
        consentId={currentConsent?.id}
      />
    </BaseModal>
  );
};
