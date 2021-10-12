import React from "react";
import {CloseOutlined} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {IPackageByQuery} from "../../../../api/types";

type TPackageLabel = {
    onDelete: (pack: IPackageByQuery) => void;
    pack: IPackageByQuery,
}

const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'start',
        background: '#7898FF',
        color: 'white',
        borderRadius: 4,
        fontWeight: 'bold',
        margin: '8px 0',
        padding: '4px 6px',
    },
    icon: {
        fontSize: 16,
        background: 'white',
        color: '#7898FF',
        borderRadius: '50%',
        cursor: 'pointer',
    }
}))

const PackageLabel: React.FC<TPackageLabel> = ({ onDelete, pack }) => {
    const classes = useStyles();
    return <div className={classes.wrapper}>{pack.name}
        <CloseOutlined onClick={() => onDelete(pack)} className={classes.icon}/></div>
}

export default PackageLabel;