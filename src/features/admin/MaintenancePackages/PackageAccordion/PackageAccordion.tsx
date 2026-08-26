import React, { Dispatch, SetStateAction, SyntheticEvent } from 'react';
import {
  Accordion as MuiAccordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { ExpandMore, MoreHoriz } from '@mui/icons-material';
import AssignOpsCodeModal from '../AssignOpsCodeModal/AssignOpsCodeModal';
import SaveRequestToDms from '../SaveRequestToDMSModal/SaveRequestToDMSModal';
import DescriptionModal from '../DescriptionModal/DescriptionModal';
import OrderIndexModal from './OrderIndexModal/OrderIndexModal';
import { usePackageAccordionStyles } from '../styles';
import { useAccordionStyles, useIconStyles } from './styles';
import { usePackageAccordionState } from './usePackageAccordionState';
import { PackageAccordionContent } from './PackageAccordionContent';

type TAccordionProps = {
  defaultExpanded?: boolean;
  disabled?: boolean;
  expanded?: boolean;
  onChange?: (event: SyntheticEvent, expanded: boolean) => void;
  onExpandIconClick?: (event: SyntheticEvent | boolean) => void;
  title: string;
  id?: number;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  onOpenEdit: () => void;
};

export const PackageAccordion: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TAccordionProps>>
> = ({ id, title, defaultExpanded, expanded, disabled, onChange, onExpandIconClick, ...props }) => {
  const accordClasses = useAccordionStyles();
  const { classes } = usePackageAccordionStyles();
  const iconStyles = useIconStyles();
  const state = usePackageAccordionState({
    id,
    expanded,
    onExpandIconClick,
    onOpenEdit: props.onOpenEdit,
    setIsEditing: props.setIsEditing,
  });

  return (
    <MuiAccordion
      classes={accordClasses}
      defaultExpanded={defaultExpanded}
      disabled={disabled}
      expanded={expanded}
      onChange={onChange}
      square
    >
      <AccordionSummary id={title}>
        <div className={classes.titleWrapper}>
          <div>
            <Typography className={classes.title}>{title}</Typography>
            <div style={{ fontSize: 16 }}>Package ID: {id}</div>
          </div>
          <div className={classes.iconsWrapper}>
            {expanded ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.addOrderButton}
                  onClick={state.onOrderOpen}
                >
                  Add Order
                </Button>
                <Button variant="contained" color="primary" onClick={state.onDescriptionOpen}>
                  To Describe Op Codes
                </Button>
              </>
            ) : null}
            <IconButton
              className={classes.button}
              onClick={state.onMoreIconClick}
              ref={state.anchorRef}
              disabled={!expanded || !state.packageData}
              size="large"
            >
              <MoreHoriz />
            </IconButton>
            <IconButton className={classes.button} onClick={state.handleExpand} size="large">
              <ExpandMore classes={expanded ? iconStyles : {}} />
            </IconButton>
          </div>
        </div>
      </AccordionSummary>

      <AccordionDetails className={classes.details}>
        <PackageAccordionContent
          classes={{ details: classes.details, tablesWrapper: classes.tablesWrapper }}
          isPackageLoading={state.isPackageLoading}
          packageData={state.packageData}
          optionsData={state.optionsData}
          detailsData={state.detailsData}
          complimentaryData={state.complimentaryData}
          upsellData={state.upsellData}
          editingOption={state.editingOption}
          setEditingOption={state.setEditingOption}
          onOptionNameChange={state.onOptionNameChange}
          onCheckboxClick={state.onCheckboxClick}
          isEdit={state.isEdit}
          setIsEdit={state.setIsEdit}
          onInputChange={state.onInputChange}
          isUpsellNameEdit={state.isUpsellNameEdit}
          setUpsellNameEdit={state.setUpsellNameEdit}
          isComplimentaryNameEdit={state.isComplimentaryNameEdit}
          setComplimentaryNameEdit={state.setComplimentaryNameEdit}
          setPackageData={state.setPackageData}
          onUpsellClick={state.onUpsellClick}
          onComplimentaryClick={state.onComplimentaryClick}
          isShowSuggestedPrice={state.currentPackage?.isShowSuggestedPrice}
          onAddOpsCode={state.onAssignOpsCodeOpen}
          onCancel={state.handleCancel}
          onSave={state.handleSave}
        />
      </AccordionDetails>

      <Menu
        open={Boolean(state.anchorEl)}
        anchorEl={state.anchorEl}
        onClose={state.handleCloseMenu}
      >
        <MenuItem onClick={state.handleEdit}>Edit</MenuItem>
        <MenuItem onClick={state.askRemove}>Remove</MenuItem>
      </Menu>
      <AssignOpsCodeModal
        packageName={title}
        open={state.isAssignOpsCodeOpen}
        onClose={state.onAssignOpsCodeClose}
      />
      <SaveRequestToDms
        open={state.isRequestToDMSOpen}
        onClose={state.onRequestToDMSClose}
        packageData={state.packageData}
        setPackageData={state.setPackageData}
        onSave={state.onRequestToDmsSave}
      />
      <DescriptionModal open={state.isDescriptionOpen} onClose={state.onDescriptionClose} />
      <OrderIndexModal onClose={state.onOrderClose} open={state.isOrderOpen} />
    </MuiAccordion>
  );
};
