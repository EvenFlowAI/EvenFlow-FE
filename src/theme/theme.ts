import {
    createTheme, Theme,
    ThemeOptions,
} from "@mui/material";
import {colors} from "./colors";

declare module "@mui/material/styles" {
    interface BreakpointOverrides {
        xs: true;
        sm: true;
        mds: true;
        md: true;
        mdl: true;
        lg: true;
        xl: true;
    }
}

export const sideBarWidth = 270;

const themeOptions: ThemeOptions = {
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            mds: 720,
            md: 960,
            mdl: 1024,
            lg: 1280,
            xl: 1440
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
        MuiIconButton: {
            styleOverrides: {
                root: {
                    padding: 9,
                }
            }
        }
    },
    palette: colors,
};

const input = {
    border: "none",
    padding: 9,
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
           },
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
            },
        }
    },
    MuiCheckbox: {
        styleOverrides: {
            root: {
                color: "#DADADA"
            }
        }
    },
    MuiTab: {
        styleOverrides: {
            root: {
                padding: '6px 12px',
                color: "#858585",
                '&.Mui-selected': {
                    color: '#000000'
                }
            }
        }
    },
    MuiChip: {
        styleOverrides: {
            deleteIcon: {
                color: "#FFFFFF"
            }
        }
    },
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
// @ts-ignore
export const frameTheme: Theme = (theme: Theme) => createTheme({
    ...theme,
    palette: {
        ...theme.palette,
        primary: {
            main: "#000000"
        }
    },
    components: {
        ...theme.components,
        MuiButton: {
            styleOverrides: {
                ...theme.components?.MuiButton?.styleOverrides,
                root: {
                    borderRadius: 0,
                    fontWeight: "bold"
                }
            }
        },
        MuiInput: {
            styleOverrides: {
                ...theme.components?.MuiInput?.styleOverrides,
                root: {
                    "&.Mui-error": {
                        borderColor: "#FF0000",
                        color: "#FF0000"
                    },
                    '&.Mui-focused': {
                        borderColor: "#aaaaaa"
                    }
                },
                input: {
                    ...input,
                    border: 0,
                    backgroundColor: "#F7F8FB",
                },
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                ...theme.components?.MuiInput?.styleOverrides,
                root: {
                    "&.Mui-error": {
                        borderColor: "#FF0000",
                        color: "#FF0000"
                    },
                    '&.Mui-focused': {
                        borderColor: "#aaaaaa"
                    }
                },
                input: {
                    ...input,
                    border: 0,
                    backgroundColor: "#F7F8FB",
                }
            }
        }
    }
});

export default theme;