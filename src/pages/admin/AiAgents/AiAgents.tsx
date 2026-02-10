import React from 'react';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { Titles } from '../../../types/types';
import { useStyles } from './styles';
import { useHistory } from 'react-router-dom';
import { Grid, Paper } from '@mui/material';
import { useCenterSettingsStyles } from '../../../hooks/styling/useCenterSettingsStyles';

interface AgentI {
  name: string;
  available: boolean;
  description: string;
  link: string;
}

const AiAgents = () => {
  const { classes } = useStyles();
  const { classes: centerSettingsClasses } = useCenterSettingsStyles();
  const history = useHistory();

  const AIAgentsList: AgentI[] = [
    {
      name: 'Configuration Agent',
      available: true,
      description: 'Use the configuration AI agent to adjust settings for ease of use',
      link: '/admin/configuration-agent',
    },
    {
      name: 'Insights Agent',
      available: false,
      description: 'Get answers from your personal business intelligence and data analyst',
      link: '/admin/insights-agent',
    },
    {
      name: 'Anomaly Agent',
      available: !(
        process.env.REACT_APP_ENV === 'production' || process.env.REACT_APP_ENV === 'PreProd'
      ),
      description: 'View future appointment demand predictions and gaps',
      link: '/admin/anomaly-agent',
    },
  ];

  const redirectToAgent = (link: string) => {
    history.push(link);
  };

  return (
    <React.Fragment>
      <TitleContainer title={Titles.AiAgents} pad />
      <Grid container spacing={3}>
        {AIAgentsList.map((agent: AgentI) => (
          <Grid item xs={6} md={4} key={agent.name}>
            <Paper className={centerSettingsClasses.paper} variant={'outlined'}>
              <div className={classes.header}>
                <span className={classes.title}>{agent.name}</span>
                <p onClick={() => redirectToAgent(agent.link)} className={classes.redirectButton}>
                  {agent.available ? 'Start Chat' : 'View'}
                </p>
              </div>
              <p className={classes.agentAvailability}>
                {agent.available ? 'Active' : 'Coming Soon'}
              </p>
              <div>
                <span>{agent.description}</span>
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
};

export default AiAgents;
