import React, { createContext, useContext } from 'react';
import { Button, Paper, PaperProps } from '@mui/material';
import { useMakesFormStyles } from './styles';

type TMakesDropdownFooterContext = {
  loading: boolean;
  onCancel: () => void;
  onAdd: () => void;
};

export const MakesDropdownFooterContext = createContext<TMakesDropdownFooterContext>({
  loading: false,
  onCancel: () => undefined,
  onAdd: () => undefined,
});

/** Autocomplete paper with Cancel / Add footer. Mouse down is prevented to keep the input focused. */
export const MakesDropdownPaper: React.FC<PaperProps> = ({ children, ...props }) => {
  const { classes } = useMakesFormStyles();
  const { loading, onCancel, onAdd } = useContext(MakesDropdownFooterContext);

  return (
    <Paper {...props}>
      {children}
      <div className={classes.footer} onMouseDown={e => e.preventDefault()}>
        <Button className={classes.cancelButton} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          className={classes.addButton}
          disabled={loading}
          onClick={onAdd}
        >
          Add
        </Button>
      </div>
    </Paper>
  );
};
