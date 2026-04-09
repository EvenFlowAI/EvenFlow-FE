import React, { useMemo } from 'react';
import { TextField } from '../../../../components/styled/EndUserInputs';
import { Grid, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { setCustomerEnteredEmail } from '../../../../store/reducers/appointment/actions';
import { EServiceType, EUserType } from '../../../../store/reducers/appointmentFrameReducer/types';
import { setUserType } from '../../../../store/reducers/appointmentFrameReducer/actions';
import { useLoadingStyles } from '../../../../hooks/styling/useLoadingStyles';
import { useStyles } from '../styles';
import { LoadingButton } from '../../../../components/buttons/LoadingButton/LoadingButton';

type TProps = {
  onComplete: (serviceType: EServiceType, userType?: EUserType) => void;
  loading: boolean;
};

const ReturningSelfCustomer: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
  loading,
  onComplete,
}) => {
  const { customerEnteredEmail } = useSelector((state: RootState) => state.appointment);
  const { serviceTypeOption } = useSelector((state: RootState) => state.appointmentFrame);

  const { classes } = useStyles();
  const loadingClasses = useLoadingStyles();
  const { t } = useTranslation();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const isXs = useMediaQuery('xs');
  const dispatch = useDispatch();

  const serviceType = useMemo(
    () => (serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter),
    [serviceTypeOption]
  );

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
    dispatch(setCustomerEnteredEmail(value));
  };

  const handleComplete = async () => {
    dispatch(setUserType(EUserType.Existing));
    onComplete(serviceType, EUserType.Existing);
  };

  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) handleComplete().then();
  };

  return (
    <Grid item xs={12} sm={12} md={6} style={{ padding: isSm ? '16px 0' : 16 }}>
      <div className={classes.existing}>
        <form name="existingCustomerForm" role="form">
          <span>{t('I’m an Existing Customer')}</span>
          <TextField
            style={{ marginTop: 20, marginBottom: 20 }}
            name="phoneOrEmail"
            placeholder={`${t('Enter your')} ${t('Email or ')}${t('Phone')}`}
            InputProps={{ disableUnderline: true }}
            variant="standard"
            onChange={handleChange}
            onKeyUp={onKeyUp}
            value={customerEnteredEmail}
            fullWidth
          />
          <LoadingButton
            fullWidth={isXs}
            loading={loading}
            variant="contained"
            color="primary"
            classes={loadingClasses}
            className={classes.loadingButton}
            disabled={loading || !customerEnteredEmail}
            onClick={handleComplete}
          >
            {t('Search')}
          </LoadingButton>
        </form>
      </div>
    </Grid>
  );
};

export default ReturningSelfCustomer;
