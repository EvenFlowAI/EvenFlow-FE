import React, { useEffect } from 'react';
import { BaseModal, DialogTitle } from '../../BaseModal/BaseModal';
import { DialogProps } from '../../BaseModal/types';
import { useDispatch } from 'react-redux';
import { getRecallComponent } from '../../../../store/reducers/recallDatabase/actions';
import { GlobalRecallComponent } from '../../../../pages/admin/RecallDatabase/types';
import { CircularProgress, Typography, Box, Button, Divider } from '@mui/material';
import dayjs from 'dayjs';
import { useViewGlobalRecallStyles } from './useViewGlobalRecallStyles';

const ViewGlobalRecall: React.FC<
  React.PropsWithChildren<DialogProps & { recallId: number | null }>
> = ({ recallId, ...props }) => {
  const dispatch = useDispatch();
  const [recall, setRecall] = React.useState<GlobalRecallComponent | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { classes } = useViewGlobalRecallStyles();

  const handleSuccess = (recall: GlobalRecallComponent) => {
    setRecall(recall);
    setLoading(false);
  };

  useEffect(() => {
    if (recallId && props.open) {
      setLoading(true);
      dispatch(getRecallComponent(recallId, handleSuccess));
    }
  }, [props.open, recallId]);

  const handleClick = () => {
    if (!recall) return;
    const url = `https://www.nhtsa.gov/recalls?nhtsaId=${recall.nhtsaCampaign}`;
    window.open(url, '_blank');
  };

  return (
    <BaseModal {...props} width={835}>
      <Box className={classes.root}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : !recall ? (
          <Typography color="textSecondary" align="center">
            Recall data not found.
          </Typography>
        ) : (
          <>
            <DialogTitle
              onClose={props.onClose}
              style={{
                padding: '0',
                position: 'sticky',
                top: 0,
                left: 0,
                zIndex: 100,
                background: 'white',
                marginTop: 0,
              }}
            >
              <div className={classes.titleWrapper}>
                <p className={classes.title}>Recall Component</p>
                <p className={classes.subTitle}>{recall.recallComponent}</p>
              </div>
            </DialogTitle>
            <div style={{ display: 'flex', width: '100%', gap: '24px' }}>
              <div
                style={{ background: '#F2F4FB', padding: '24px 24px 24px 32px', width: '286px' }}
              >
                <Box className={classes.grid}>
                  <Box>
                    <Typography className={classes.label}>NHTSA Campaign</Typography>
                    <Typography className={classes.value}>{recall.nhtsaCampaign || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography className={classes.label}>OEM Program</Typography>
                    <Typography className={classes.value}>{recall.oemProgram || '-'}</Typography>
                  </Box>
                  <Box className={classes.makesWrapper}>
                    <Typography className={classes.label}>Makes & Models</Typography>
                    {recall.makes && recall.makes.length > 0 ? (
                      recall.makes.map((make, idx) => (
                        <Box key={make.name + idx}>
                          <Typography className={classes.value} component="span">
                            {make.name}
                          </Typography>
                          <span className={classes.models}>
                            {make.models.map((model, idx) => (
                              <div key={idx}>
                                · {model.name} {model.year}
                              </div>
                            ))}
                          </span>
                        </Box>
                      ))
                    ) : (
                      <Typography className={classes.value}>-</Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography className={classes.label}>Reported Date</Typography>
                    <Typography className={classes.value}>
                      {recall.reportedDate ? dayjs(recall.reportedDate).format('MMM D, YYYY') : '-'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography className={classes.label}>Impacted Vehicles</Typography>
                    <Typography className={classes.value}>
                      {recall.impactedVehicles?.toLocaleString() ?? '-'}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography className={classes.label}>Do Not Drive</Typography>
                  <Typography className={classes.value}>
                    {recall.doNotDrive ? 'Yes' : 'No'}
                  </Typography>
                </Box>
                <Box>
                  <Typography className={classes.label}>Fire Risk</Typography>
                  <Typography className={classes.value}>
                    {recall.fireRisk ? 'Yes' : 'No'}
                  </Typography>
                </Box>
                <Box>
                  <Typography className={classes.label}>Recall Link</Typography>
                  <Button
                    onClick={handleClick}
                    variant="text"
                    style={{ paddingLeft: 0, paddingTop: 0 }}
                    color="primary"
                  >
                    Go to Recall
                  </Button>
                </Box>
              </div>
              <div>
                <Divider style={{ borderColor: '#EAEBEE' }} />
                <Box className={classes.section}>
                  <Typography className={classes.bigLabel}>Summary</Typography>
                  <Typography className={classes.summary}>{recall.summary || '-'}</Typography>
                </Box>
                <Divider style={{ borderColor: '#EAEBEE' }} />
                <Box className={classes.section}>
                  <Typography className={classes.bigLabel}>Safety Risk</Typography>
                  <Typography className={classes.safetyRisk}>{recall.safetyRisk || '-'}</Typography>
                </Box>
                <Divider style={{ borderColor: '#EAEBEE' }} />
                <Box className={classes.section}>
                  <Typography className={classes.bigLabel}>Remedy</Typography>
                  <Typography className={classes.remedy}>{recall.remedy || '-'}</Typography>
                </Box>
              </div>
            </div>
          </>
        )}
      </Box>
    </BaseModal>
  );
};

export default ViewGlobalRecall;
