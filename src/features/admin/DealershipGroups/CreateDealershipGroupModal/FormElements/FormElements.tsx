import React from "react";
import { Grid } from "@mui/material";
import { TextField } from "../../../../../components/formControls/TextFieldStyled/TextField";
import { KeyPair } from "../types";

type FormElementProps<U> = {
  elements: KeyPair<U>[];
  data: U;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: string[];
};

export const FormElements: <T>(
  p: FormElementProps<T>,
) => React.ReactElement<FormElementProps<T>> = (props) => {
  return (
    <Grid container spacing={2}>
      {props.elements.map((element) => {
        return (
          <Grid item xs={6} key={element.name as string}>
            <TextField
              fullWidth
              label={element.label}
              name={element.name as string}
              id={element.name as string}
              value={props.data[element.name]}
              placeholder={element.label}
              error={props.errors.includes(element.name as string)}
              onChange={props.onChange}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
