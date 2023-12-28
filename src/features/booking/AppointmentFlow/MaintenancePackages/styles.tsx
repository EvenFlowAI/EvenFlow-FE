import {styled, Theme} from "@material-ui/core";

const border = '1px solid #DADADA';
export const Wrapper = styled('div')<Theme, { count: number }>(({theme, count}) => ({
    display: "grid",
    marginTop: 12,
    gap: "0 16px",
    gridTemplateColumns: count === 3
        ? `2fr repeat(${count}, 1fr)`
        : count === 2
            ? '1fr 1fr 1fr'
            : '1fr 1fr',
    width: "100%",
    alignItems: "stretch",
    [theme.breakpoints.down('sm')]: {
        overflowX: "auto"
    },

    "& .currentWrp": {
        flexBasis: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "stretch"
    },
    "& > div": {
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: border,
        padding: '2px 8px',
        fontWeight: "bold",
        borderLeft: border,
        borderRight: border,
        cursor: "pointer",
        transition: "all .2s",
        [theme.breakpoints.down("xs")]: {
            minWidth: "180px"
        },
        "&.selected": {
            borderLeftColor: "#000000",
            borderRightColor: "#000000",
            "&.top": {
                borderTopColor: "#000000"
            },
            "&.end": {
                borderBottomColor: "#000000"
            },
            "&.title": {
                background: "#000000",
                color: "#FFFFFF"
            },
            "& .triangle": {
                width: 0,
                height: 0,
                borderTop: "14px solid transparent",
                borderBottom: "14px solid transparent",
            },
            "& .current": {
                background: "#D32F2F",
                color: "#FFFFFF",
            }
        },
        '&.top': {
            borderTop: border,
        },
        '&:nth-child(4n+1)': {
            justifyContent: "center",
            cursor: "default",
        },
        "&.gray": {
            background: "#DADADA",
        },
        "&.title": {
            padding: 20,
            fontSize: 20,
            textTransform: "uppercase"
        },
        "&.subtitle": {
            textTransform: "uppercase",
            justifyContent: "flex-end",
        },
        "&.service": {
            justifyContent: "center",
            padding: "6px 8px",
        },
        "&.serviceWithInfo": {
            display: 'flex',
            justifyContent: "flex-end",
            alignItems: 'center',
            padding: "6px 8px",
            textAlign: 'right',
        },
        "&.green": {
            background: "#E5F5FF"
        },
        "&.yellow": {
            background: "#FFF2CC"
        },
        "&.lgray": {
            background: "#EFEFEF",
        },
        "&.green.subtitle": {
            background: "#91CFF7"
        },
        "&.yellow.subtitle": {
            background: "#FFD966"
        },
        "&.totalMaintenance": {
            justifyContent: "flex-end",
            fontWeight: 'bold',
            borderTop: border,
            paddingBottom: 10,
            fontSize: 14,
        },
        "&.last": {
            borderBottomColor: "#000000",
        },
        "&.totalComplimentary": {
            justifyContent: "center",
            padding: "16px 8px",
            color: "#202021",
        },
        "&.complimentaryTitle": {
            justifyContent: "flex-end",
            borderBottomColor: "#000000",
        },
        "&.total": {
            justifyContent: "flex-end",
            padding: 8,
            "&>.info": {
                display: "inline-block",
                marginLeft: 4,
                textTransform: "none",
                fontWeight: "normal",
            }
        },
        "&.price": {
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            alignItems: "center",
            justifyContent: "center",
            "& .current": {
                flexGrow: 1,
                fontSize: 20,
                color: '#000000'
            },
            "&.selected": {
                "& .current": {
                    background: "#000000",
                    color: "#FFFFFF",
                },
                "& .triangle": {
                    borderRight: "14px solid #000000",
                },
            }
        },
        '&.priceWithBefore': {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            alignItems: "center",
            justifyContent: "center",
            "&>.before": {
                textDecoration: "line-through",
                fontWeight: "bold",
                color: "#000000",
                fontSize: 20,
            },
            "& .current": {
                flexGrow: 1,
                fontSize: 20,
                color: '#D32F2F'
            },
            "&.selected": {
                "& .current": {
                    background: "#D32F2F",
                    color: "#FFFFFF",
                },
                "& .triangle": {
                    borderRight: "14px solid #D32F2F",
                },
            }
        },
    }
}));

export const Info = styled("div")({
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    fontSize: 14,
    color: "#808080",
})

export const FeesText = styled('div')<Theme, { count: number }>(({theme, count}) => ({
    width: "100%",
    display: "grid",
    gap: "0 16px",
    gridTemplateColumns: count === 3
        ? `2fr repeat(${count}, 1fr)`
        : count === 2
            ? '1fr 1fr 1fr'
            : '1fr 1fr',
    alignItems: "stretch",
    justifyItems: 'flex-end',
    fontSize: 16,
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
        overflowX: "auto"
    },
}))

export const PackagesStepWrapper = styled('div')(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    flexDirection: "column",
    width: "100%",
    [theme.breakpoints.down('sm')]: {
        marginBottom: "auto",
    }
}))