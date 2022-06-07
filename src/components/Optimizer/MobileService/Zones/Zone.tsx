import React from 'react';
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
}

type TStyleProps = {
    isSelected: boolean;
}

const useStyles = makeStyles(() => ({
    zoneContainer: ({isSelected}: TStyleProps) => ({
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        alignItems: "flex-start",
        border: isSelected ? '1px solid #2F80ED' : '1px solid #DADADA',
        padding: 12,
        borderRadius: 1,
    }),
    zoneBox: {
        display: "flex",
        alignItems: 'center',
        gap: 10,
        backgroundColor: "#F2F3F7",
        border: '1px solid #DADADA',
        borderRadius: 2,
        padding: '0 11px',
        marginRight: 10,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: "#252733",

    },
    codesContainer: {
        display: "grid",
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        padding: '0px 8px',
        backgroundColor: "#F2F3F7",
    },
    icon: {
        width: 16,
        height: 16,
        borderRadius: '50%',
        color: "grey",
        backgroundColor: 'white',
    }
}))

const ZipCode = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: "center",
    backgroundColor: "#7898FF",
    borderRadius: 4,
    padding: '2px 6px',
    margin: 5,
    color: '#FFFFFF',
})

const Zone: React.FC<TZoneProps> = ({isSelected, zone, zipCodes, setSelected}) => {
    const classes = useStyles({isSelected});

    const onChange = (zone: TZone) => (e: React.ChangeEvent<{}>) => {
        setSelected(zone)
    }
    const deleteZipCode = (id: number) => (e: React.MouseEvent<{}>) => {

    }

    return (
        <div className={classes.zoneContainer}>
            <div className={classes.zoneBox}>
                <Checkbox checked={isSelected} onChange={onChange(zone)} color="primary"/>
                <div>{zone.name}</div>
            </div>
            <div className={classes.codesContainer}>
                {zipCodes.map(item => <ZipCode key={item.id}>
                    <div>{item.code}</div>
                    <CloseOutlined className={classes.icon} onClick={deleteZipCode(item.id)}/>
                </ZipCode>)}
            </div>
        </div>
    );
};

export default Zone;