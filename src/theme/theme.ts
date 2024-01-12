import {
    createTheme, Theme,
    ThemeOptions,
} from "@mui/material";
import {fonts} from "./fonts";
import {colors} from "./colors";

declare module "@mui/material/styles" {
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
            '"Proxima Nova"',
            'Roboto',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(','),
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '@font-face': fonts
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    padding: 9
                }
            }
        }
    },
    palette: colors,
};

const input = {
    border: "none",
    padding: 11,
    fontSize: 16,
    background: "transparent",
}

const theme = createTheme(themeOptions);
theme.components = {
    ...theme.components,
    MuiInputBase: {
       styleOverrides: {
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
                   borderColor: theme.palette.grey.A200
               },
           },
           inputMultiline: {
               padding: theme.spacing(2)
           },
           input: {
               ...input,
           }
       }
    },
    MuiButton: {
        styleOverrides: {
            contained: {
                boxShadow: "none"
            },
            root: {
                borderRadius: 4,
                fontWeight: "bold",
            }
        }
    },
    MuiCheckbox: {
        styleOverrides: {
            root: {
                color: "#DADADA"
            }
        }
    }
}

export const loginTheme = createTheme({
    ...theme,
    palette: {
        ...theme.palette,
        primary: {
            main: "#3855F3",
        },
    },
    components: {
        MuiInputBase: {
            styleOverrides: {
                input: {
                    ...input,
                    padding: theme.spacing(2),
                    border: '1px solid #DADADA',
                    backgroundColor: "#F7F8FB",
                    fontWeight: "bold"
                }
            }
        }
    }
});

// @ts-ignore
export const endUserTheme = createTheme({
    ...theme,
    palette: {
        ...theme.palette,
        primary: {
            main: "#3855F3",
        },
    },
});

// @ts-ignore
export const frameTheme: Theme = (theme: Theme) => createTheme({
    ...theme,
    palette: {
        ...theme.palette,
        primary: {
            main: "#000000"
        }
    },
});

frameTheme.components = {
    ...frameTheme.components,
    MuiButton: {
       styleOverrides: {
           root: {
               borderRadius: 0
           }
       }
    },
    MuiInput: {
      styleOverrides: {
          error: {
              borderColor: "#FF0000",
              color: "#FF0000"
          }
      }
    }
}
export default theme;