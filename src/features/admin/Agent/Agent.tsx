import React, { useState } from 'react';
import { useStyles } from './styles';
import { useHistory } from 'react-router-dom';
import InputField from './InputField/InputField';

interface AgentI {
  agentName: string;
}

const Agent = ({ agentName }: AgentI) => {
  const { classes } = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const redirect = () => {
    history.push('/admin/ai-agents');
  };

  const sendMessage = (message: string) => {
    console.log('send message to agent: ', message);
    setLoading(true);
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
        <div className={classes.agentWindow}>
          <p className={classes.agentTitle}>Chat with AI Agent</p>

          <InputField
            isHistory={false}
            loading={loading}
            setLoading={setLoading}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Agent;
