import React from 'react';
import { useStyles } from './styles';
import { useHistory } from 'react-router-dom';

interface AgentI {
  agentName: string;
}

const Agent = ({ agentName }: AgentI) => {
  const { classes } = useStyles();
  const history = useHistory();

  const redirect = () => {
    history.push('/admin/ai-agents');
  };

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        <div className={classes.nav}>
          <p className={classes.navGeneralAgents} onClick={redirect}>
            AI Agents (beta)
          </p>
          <span className={classes.navSeparator}> / </span>
          <span className={classes.navAgentName}>{agentName}</span>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Agent;
