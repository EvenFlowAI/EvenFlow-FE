import React from "react";
import { Button, Divider } from "@mui/material";
import { useStyles } from "./styles";

type TAccordionProps = {
  onCancel: () => void;
  onSave: () => void;
  onAddOpsCode: () => void;
};

const AccordionActions: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TAccordionProps>>
> = ({ onAddOpsCode, onCancel, onSave }) => {
  const { classes } = useStyles();
  return (
    <>
      <Divider />
      <div className={classes.wrapper}>
        <div className={classes.buttonsWrapper}>
          <Button onClick={onCancel} className={classes.cancelButton}>
            Cancel
          </Button>
          <Button onClick={onAddOpsCode} className={classes.addButton}>
            Assign Op Code to Option
          </Button>
          <Button onClick={onSave} className={classes.saveButton}>
            Save Changes
          </Button>
        </div>
      </div>
    </>
  );
};

export default AccordionActions;
