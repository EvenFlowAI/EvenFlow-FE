import {styled} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';

export const DetailedFeesList = styled('ul')({
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    marginBottom: 20,
    margin: "12px 0 0",
    padding: 0,
    listStyle: "none",
    background: 'white',
    "& .service-item": {
        textTransform: "capitalize"
    }
});

export const DetailedFeesInfo = styled('div')({
    display: 'flex',
    alignItems: 'center',
    marginBottom: 24,
    padding: 0,
    "& > .text": {
        marginLeft: 10,
    }
});

export const useStyles = makeStyles(() => ({
    item: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 24px',

        "&:not(last-child)": {
            borderBottom: '1px solid rgba(0, 0, 0, 0.15)'
        }
    },
    price: {
        width: '20%',
        fontWeight: 600,
        fontSize: 16,
        textAlign: 'end',
    },
    pricesBlock: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    offersPrice: {
        color: '#008331',
        fontSize: 16,
        fontWeight: 600,
        marginLeft: 12,
    },
    offersText: {
        color: '#008331',
        fontSize: 14,
        fontWeight: 400,
        marginLeft: 12,
    }
}))
