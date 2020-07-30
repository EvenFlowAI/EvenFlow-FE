import {createMuiTheme, ThemeOptions} from "@material-ui/core";
import {fonts} from "./fonts";
import {colors} from "./colors";


const themeOptions: ThemeOptions = {
    typography: {
        fontFamily: [
            // '-apple-system',
            // 'BlinkMacSystemFont',
            '"Proxima Nova"',
            'Roboto',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(','),
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '@font-face': fonts
            }
        }
    },
    palette: colors,
};

const theme = createMuiTheme(themeOptions);
theme.overrides = {
    ...theme.overrides,
    MuiInputBase: {
        input: {
            border: '1px solid #DADADA',
            padding: theme.spacing(2),
            backgroundColor: "#F7F8FB",
            fontWeight: "bold",
            transition: theme.transitions.create(['border-color']),
            '&:focus': {
            //     boxShadow: `${fade(theme.palette.grey.A400, 0.25)} 0 0 0 0.2rem`,
                borderColor: theme.palette.grey.A200
            },
        }
    },
    MuiButton: {
        root: {
            borderRadius: 4,
            fontWeight: "bold",
            padding: theme.spacing(2)
        }
    },
    MuiCheckbox: {
        root: {
            color: "#DADADA"
        }
    }
}
export default theme;