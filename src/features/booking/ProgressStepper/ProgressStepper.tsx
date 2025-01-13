import React, { useMemo } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Label, Wrapper } from './styles';

type TProps = {
  activeStep: number;
  steps: number;
  label: string;
  nextLabel?: string;
};

export const ProgressStepper: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({ activeStep, steps, label, nextLabel }) => {
  const { t } = useTranslation();
  const stepWeight = useMemo(() => {
    return 100 / (steps || 1);
  }, [steps]);
  return (
    <Wrapper>
      <Box position="relative" mr={1}>
        <CircularProgress
          thickness={4}
          size={55}
          variant="determinate"
          value={100}
          color="inherit"
          style={{ color: '#fff', position: 'absolute', top: 0, left: 0 }}
        />
        <CircularProgress
          thickness={4}
          size={55}
          variant="determinate"
          value={stepWeight * activeStep}
        />
        <Label>
          {activeStep} {t('of')} {steps}
        </Label>
      </Box>
      <Box p={1} fontWeight="bold">
        <Typography variant="h6" color="primary">
          <strong>{label}</strong>
        </Typography>
        <Typography color="primary" style={{ fontSize: 14, fontWeight: 400 }}>
          {nextLabel ? `${t('Next')}: ${nextLabel}` : ''}
        </Typography>
      </Box>
    </Wrapper>
  );
};
