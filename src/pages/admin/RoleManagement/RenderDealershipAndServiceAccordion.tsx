import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { useStyles } from './styles';
import { IDealership } from './types';

export const RenderDealershipAndServiceAccordion: React.FC<{
  dealerships: IDealership[];
  isSc: boolean;
}> = ({ dealerships, isSc }) => {
  const { classes } = useStyles();

  if (!dealerships?.length) return <span>-</span>;
  if (dealerships.length === 1 && !isSc) return <span>{dealerships[0].name}</span>;

  const allSC = dealerships.flatMap(d => d.serviceCenters);
  if (isSc && !allSC?.length) return <span>-</span>;
  if (isSc && allSC.length === 1) return <span>{allSC[0].name}</span>;

  return (
    <Accordion sx={{ boxShadow: 'none', backgroundColor: 'transparent' }}>
      <AccordionSummary
        sx={{
          boxShadow: 'none',
          background: '#DADADA',
          color: '#252733',
          width: 'fit-content',
          gap: '6px',
          borderRadius: '16px',
          padding: '0 15px',
          minHeight: '36px !important',
          height: '36px',
        }}
        expandIcon={<ExpandMoreIcon fontSize="small" />}
      >
        <Typography fontSize={16} variant="body2" fontWeight={500}>
          {!isSc ? `${dealerships.length} dealership groups` : `${allSC.length} service centers`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0, pl: 2, mt: '10px' }}>
        <div className={classes.details}>
          {!isSc
            ? dealerships.map(d => (
                <p key={d.id} className={classes.text}>
                  {d.name}
                </p>
              ))
            : dealerships.map(d => (
                <Accordion
                  key={d.id}
                  sx={{
                    boxShadow: 'none',
                    backgroundColor: 'transparent',
                    '&::before': { display: 'none' },
                    margin: '0 0 6px 0 !important',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon fontSize="small" />}
                    sx={{
                      boxShadow: 'none',
                      background: '#EAEAEA',
                      color: '#252733',
                      width: 'fit-content',
                      gap: '6px',
                      borderRadius: '12px',
                      padding: '0 12px',
                      minHeight: '32px !important',
                      height: '32px',
                    }}
                  >
                    <Typography fontSize={14} variant="body2" fontWeight={500}>
                      {d.name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      p: 0,
                      pl: 2,
                      mt: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    {d.serviceCenters.length ? (
                      d.serviceCenters.map(sc => (
                        <p key={sc.id} className={classes.text}>
                          {sc.name}
                        </p>
                      ))
                    ) : (
                      <span>-</span>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
