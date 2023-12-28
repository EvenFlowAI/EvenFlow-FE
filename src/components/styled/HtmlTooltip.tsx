import {Tooltip, withStyles} from "@material-ui/core";

export const HtmlTooltip = withStyles({
    tooltip: {
        fontSize: 13,
        color: '#202021',
        background: '#D1D1D1',
    },
    popper: {
        borderRadius: 2,
    }
})(Tooltip);