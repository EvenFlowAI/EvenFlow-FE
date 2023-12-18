import React from "react";
import {CloseOutlined} from "@material-ui/icons";
import {IPackageByQuery} from "../../../../../api/types";
import {useStyles} from "./styles";

type TPackageLabelProps = {
    onDelete: (pack: IPackageByQuery) => void;
    pack: IPackageByQuery,
}

const PackageLabel: React.FC<TPackageLabelProps> = ({ onDelete, pack }) => {
    const classes = useStyles();
    return <div className={classes.wrapper}>{pack.name}
        <CloseOutlined onClick={() => onDelete(pack)} className={classes.icon}/>
    </div>
}

export default PackageLabel;