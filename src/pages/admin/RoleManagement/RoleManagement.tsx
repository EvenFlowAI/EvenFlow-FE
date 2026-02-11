import React from 'react';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { Titles } from '../../../types/types';
import { applicationRoot } from '../../../utils/constants';
import { Button } from '@mui/material';
import { useStyles } from './styles';
import Filters from './Filters';
const RoleManagement = () => {
  const { classes } = useStyles();

  const onClick = () => {};

  return (
    <div className={classes.root}>
      <TitleContainer title={Titles.RoleManagement} parent={applicationRoot} pad />
      <div className={classes.buttonWrapper}>
        <Button variant="contained" onClick={onClick} color="primary">
          Add user account
        </Button>
      </div>
      <Filters />
    </div>
  );
};

export default RoleManagement;
