import { withStyles } from "tss-react/mui";

import { LoadingButton } from "../buttons/LoadingButton/LoadingButton";

export const LoginButton = withStyles(LoadingButton, (theme) => ({
  wrapper: { marginTop: 40 },
  root: {
    padding: theme.spacing(2),
  },
}));
