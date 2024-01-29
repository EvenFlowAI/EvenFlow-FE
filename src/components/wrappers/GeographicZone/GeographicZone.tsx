import React, {Dispatch, SetStateAction} from 'react';
import {TZipCode, TZone} from "../../../store/reducers/mobileService/types";
import Checkbox from "../../formControls/Checkbox/Checkbox";
import {CloseOutlined} from "@mui/icons-material";
import {useStyles, ZipCode, ZoneContainer} from "./styles";

type TZoneProps = {
    zone: TZone;
    zipCodes: TZipCode[];
    isSelected: boolean;
    onRemoveZip: () => void;
    setCurrentZip: Dispatch<SetStateAction<TZipCode|null>>;
    setSelectedZone: Dispatch<SetStateAction<TZone|null>>;
}

const GeographicZone: React.FC<React.PropsWithChildren<React.PropsWithChildren<TZoneProps>>> = ({isSelected, zone, zipCodes, setCurrentZip, onRemoveZip, setSelectedZone}) => {
    const classes = useStyles();

    const onClick = () => {
        setSelectedZone(zone);
    }

    const deleteZipCode = (item: TZipCode) => (e: React.MouseEvent<{}>) => {
        setCurrentZip(item);
        onRemoveZip();
    }

    return (
        <ZoneContainer isSelected={isSelected} role="presentation" onClick={onClick}>
            <div className={classes.zoneBox}>
                <Checkbox checked={isSelected} color="primary"/>
                <div>{zone.name}</div>
            </div>
            <div className={classes.codesContainer}>
                {zipCodes.map(item => <ZipCode key={item.id}>
                    <div>{item.code}</div>
                    <CloseOutlined className={classes.icon} onClick={deleteZipCode(item)}/>
                </ZipCode>)}
            </div>
        </ZoneContainer>
    );
};

export default GeographicZone;