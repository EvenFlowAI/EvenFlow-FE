import React from 'react';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { Titles } from '../../../types/types';
import { useStyles } from './styles';
import { useHistory } from 'react-router-dom';

interface AgentI {
  name: string;
  available: boolean;
  description: string;
  link: string;
}

const AiAgents = () => {
  const { classes } = useStyles();
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
      available: true,
      description: 'Get answers from your personal business intelligence and data analyst',
      link: '/admin/insights-agent',
    },
    {
      name: 'Anomaly Agent',
      available: false,
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
      <div className={classes.wrapper}>
        {AIAgentsList.map((agent: AgentI) => (
          <div key={agent.name} className={classes.agent}>
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
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default AiAgents;
