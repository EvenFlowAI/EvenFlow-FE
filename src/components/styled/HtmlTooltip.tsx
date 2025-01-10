import { Tooltip } from "@mui/material";

import { withStyles } from "tss-react/mui";

export const HtmlTooltip = withStyles(Tooltip, {
  tooltip: {
    fontSize: 13,
    color: "#202021",
    background: "#D1D1D1",
  },
  popper: {
    borderRadius: 2,
  },
});

export const AdminHTMLTooltip = withStyles(Tooltip, {
  tooltip: {
    fontSize: 12,
    color: "#202021",
    backgroundColor: "#F7F8FB",
    borderRadius: 0,
  },
  popper: {
    maxWidth: 180,
    borderRadius: 0,
    padding: 8,
    filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25))",
  },
});
