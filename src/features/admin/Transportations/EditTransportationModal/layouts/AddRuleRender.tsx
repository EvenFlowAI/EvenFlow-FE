import React from 'react';
import { Button } from '@mui/material';
import { setRules } from '../../../../../store/reducers/serviceRequests/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';

const AddRuleRender = () => {
  const dispatch = useDispatch();
  const { rules } = useSelector((state: RootState) => state.serviceRequests);

  const addRule = () => {
    dispatch(
      setRules([
        ...rules,
        {
          name: '',
          daysOfWeek: [],
          serviceRequests: [],
          serviceRequestFilterMode: null,
          timeOfDay: null,
          capacity: undefined,
          expanded: true,
          state: 1,
          orderIndex: rules.length + 1,
        },
      ])
    );
  };

  return (
    <Button variant="outlined" onClick={addRule} fullWidth>
      Add Rule
    </Button>
  );
};

export default AddRuleRender;
