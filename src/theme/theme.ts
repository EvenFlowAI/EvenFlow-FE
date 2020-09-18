import {unstable_createMuiStrictModeTheme as createMuiTheme, ThemeOptions} from "@material-ui/core";
import {fonts} from "./fonts";
import {colors} from "./colors";

declare module "@material-ui/core/styles/createBreakpoints" {
    interface BreakpointOverrides {
        xs: true;
        sm: true;
        mds: true;
        md: true;
        lg: true;
        xl: true;
    }
}

export const sideBarWidth = 255;


const themeOptions: ThemeOptions = {
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            mds: 720,
            md: 960,
            lg: 1280,
            xl: 1920
        }
    },
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
        },
        MuiIconButton: {
            root: {
                padding: 9
            }
        }
    },
    palette: colors,
};
const input = {
    border: "none",
    padding: 11,
    fontSize: 14,
    background: "transparent",
    // fontWeight: "bold" as const,
}
const theme = createMuiTheme(themeOptions);
theme.overrides = {
    ...theme.overrides,
    MuiInputBase: {
        root: {
            backgroundColor: "#F7F8FB",
            border: '1px solid #DADADA',
            "&.MuiInputBase-adornedStart": {
                paddingLeft: 8
            },
            "&.MuiInputBase-adornedEnd": {
                paddingRight: 8
            },
            "&.Mui-disabled": {
                background: "#F7F8FB"
            },
            transition: theme.transitions.create(['border-color']),
            '&.Mui-focused': {
            //     boxShadow: `${fade(theme.palette.grey.A400, 0.25)} 0 0 0 0.2rem`,
                borderColor: theme.palette.grey.A200
            },
        },
        input: {
            ...input,
        }
    },
    MuiButton: {
        contained: {
            boxShadow: "none"
        },
        root: {
            borderRadius: 4,
            fontWeight: "bold",
        }
    },
    MuiCheckbox: {
        root: {
            color: "#DADADA"
        }
    }
}

export const loginTheme = createMuiTheme({
    ...theme,
    palette: {
        ...theme.palette,
        primary: {
            main: "#3855F3",
        },
    },
    overrides: {
        ...theme.overrides,
        MuiInputBase: {
        input: {
            ...input,
            padding: theme.spacing(2),
            border: '1px solid #DADADA',
            backgroundColor: "#F7F8FB",
            fontWeight: "bold"
        }
        }
    }
});
export default theme;