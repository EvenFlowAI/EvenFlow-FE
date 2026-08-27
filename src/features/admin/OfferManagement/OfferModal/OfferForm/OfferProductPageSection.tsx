import React from 'react';
import { Button, Switch } from '@mui/material';
import HtmlEditor from '../../../../../components/modals/admin/HTMLEditor/HTMLEditor';
import { TOfferForm } from '../../types';
import { useModal } from '../../../../../hooks/useModal/useModal';
import { useStyles } from './styles';

type TProps = {
  isProductPageOn: boolean;
  onValueChange: (name: keyof TOfferForm, value: unknown) => void;
};

export const OfferProductPageSection: React.FC<React.PropsWithChildren<TProps>> = ({
  isProductPageOn,
  onValueChange,
}) => {
  const { isOpen, onOpen, onClose } = useModal();
  const { classes } = useStyles();

  const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>, value: boolean) => {
    onValueChange('isProductPageOn', value);
  };

  return (
    <>
      <div className={classes.lastRowContainer}>
        <p className={classes.text}>Product Page</p>
        <Switch onChange={handleSwitch} checked={isProductPageOn} color="primary" />
        <Button variant="contained" onClick={onOpen} color="primary" disabled={!isProductPageOn}>
          Edit Product Page
        </Button>
      </div>

      <HtmlEditor
        open={isOpen}
        onSave={value => console.log(value)}
        onClose={onClose}
        title="Edit Product Page Content"
      />
    </>
  );
};
