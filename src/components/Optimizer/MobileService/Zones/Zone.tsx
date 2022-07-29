import React, {Dispatch, SetStateAction} from 'react';
import {TZipCode, TZone} from "../../../../store/reducers/mobileService/types";
import {makeStyles} from "@material-ui/core/styles";
import Checkbox from "../../../UI/Checkbox";
import {styled} from "@material-ui/core";
import {CloseOutlined} from "@material-ui/icons";

type TZoneProps = {
    zone: TZone;
    zipCodes: TZipCode[];
    isSelected: boolean;
    setSelected: (zone: TZone) => void;
    onRemoveZip: () => void;
    setCurrentZip: Dispatch<SetStateAction<string>>;
}

type TStyleProps = {
    isSelected: boolean;
}

const useStyles = makeStyles(() => ({
    zoneContainer: ({isSelected}: TStyleProps) => ({
        display: 'grid',
        gridTemplateColumns: '2fr 3fr',
        alignItems: "flex-start",
        padding: 12,
        borderRadius: 1,
        border: isSelected ? '1px solid #2F80ED' : '1px solid #DADADA',
        backgroundColor: "#FFFFFF",
    }),
    zoneBox: {
        display: "flex",
        alignItems: 'center',
        gap: 10,
        backgroundColor: "#F2F3F7",
        border: '1px solid #DADADA',
        borderRadius: 2,
        paddingRight: 11,
        marginRight: 10,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: "#252733",

    },
    codesContainer: {
        display: "grid",
        gridTemplateColumns: '1fr 1fr',
        gridGap: 8,
        padding: 8,
        border: "2px solid #DADADA",
        borderRadius: 2,
        backgroundColor: "#F2F3F7",
    },
    icon: {
        width: 16,
        height: 16,
        borderRadius: '50%',
        color: "grey",
        backgroundColor: 'white',
        cursor: 'pointer',
    }
}))

const ZipCode = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: "center",
    backgroundColor: "#7898FF",
    borderRadius: 4,
    padding: '2px 6px',
    color: '#FFFFFF',
})

const Zone: React.FC<TZoneProps> = ({isSelected, zone, zipCodes, setSelected, setCurrentZip, onRemoveZip}) => {
    const classes = useStyles({isSelected});

    const onClick = () => {
        setSelected(zone)
    }

    const deleteZipCode = (item: TZipCode) => (e: React.MouseEvent<{}>) => {
        setCurrentZip(item.code);
        onRemoveZip();
    }

    return (
        <div className={classes.zoneContainer} role="presentation" onClick={onClick}>
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
        </div>
    );
};

export default Zone;