import React, {useEffect, useMemo, useState} from 'react';
import axios from "axios";
import {IFirstScreenOption} from "../../store/reducers/serviceTypes/types";
import {Loading} from "../UI/Loading";
import {makeStyles} from "@material-ui/core/styles";

type TServiceTypeIconProps = {card: IFirstScreenOption, onClick: () => void, isSM: boolean}

const useStyles = makeStyles((theme) => ({
    icon: {
        width: '100%',
        // width: 224,
        maxHeight: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundSize: 'contain',
        // backgroundPosition: 'center',
        // backgroundRepeat: 'no-repeat',
        [theme.breakpoints.down('sm')]: {
            maxWidth: 224,
            height: 112,
            width: '90%',
        },
    },
    noLogo: {
        width: '100%',
        padding: '10%',
        color: "#DCDCDC",
        fontWeight: 'bold',
        fontSize: 32,
        backgroundColor: "#F4F4F4",
        [theme.breakpoints.down("sm")]: {
            width: 224,
            height: 112,
            maxWidth: '90%'
        }
    },
    image: {
        // width: 'fit-content',
        maxWidth: '100%',
        maxHeight: 112,
        [theme.breakpoints.down("sm")]: {
            maxWidth: 224,
        }
    }
}))

const ServiceTypeIcon: React.FC<TServiceTypeIconProps> = ({card, onClick, isSM}) => {
    const [isIconLoading, setIsIconLoading] = useState<boolean>(false);
    const [icon, setIcon] = useState<string>('');
    const classes = useStyles();

    const iconType = useMemo((): string => {
        if (card.iconPath?.length) {
            const index = card.iconPath.lastIndexOf('.');
            return index > 0 ? card.iconPath.slice(index, card.iconPath.length - 1) : '';
        }
        return '';
    }, [card.iconPath])

    useEffect(() => {
        if (card.iconPath && iconType.length && iconType.toLowerCase() === 'svg') {
            setIsIconLoading(true);
            axios.get(card.iconPath, {withCredentials: false})
                .then(({ data }) => {
                    setIcon(data)
                })
                .finally(() => setIsIconLoading(false))
        }
    }, [iconType, card])

    return isIconLoading
        ? <Loading/>
        : card.iconPath
            ? iconType.toLowerCase() === 'svg'
                ? <div className={classes.icon} dangerouslySetInnerHTML={{__html: icon}} />
                : <div className={classes.icon}
                       onClick={() => isSM && onClick()}
                    //style={{backgroundImage: `url(${card.iconPath})`}}
                >
                    <img className={classes.image} src={card.iconPath} alt="logo"/>
                </div>
            : <div className={classes.noLogo}>No logo</div>
};

export default ServiceTypeIcon;