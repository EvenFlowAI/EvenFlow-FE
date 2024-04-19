import React, {useMemo} from "react";
import {Button, Grid, Paper} from "@mui/material";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {useZonePlateStyles} from "../../../../hooks/styling/useZonePlateStyles";
import {useStyles} from "./styles";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";

type TProps = {
    onEdit: () => void;
    isLoading: boolean;
}

export const ZonesOpsCodesPlate: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({onEdit, isLoading}) => {
    const {centerSettings} = useSelector((state: RootState) => state.capacityServiceValet);
    const {zones} = useSelector((state: RootState) => state.serviceValet);
    const { classes: centerSettingsClasses } = useZonePlateStyles();
    const { classes  } = useStyles();

    const zonesData = useMemo(() => {
        if (centerSettings?.zoneServiceRequests) {
            return zones.map(el => {
                const opsCode = centerSettings?.zoneServiceRequests
                    .find(item => item.zone.id === el.id)?.serviceRequest?.code;
                return {
                    name: el.name,
                    opsCode: opsCode ?? 'Unassigned'
                }
            })
        } else {
            return [];
        }
    }, [centerSettings, zones])

    return <Grid item xs={6} md={4}>
        <Paper className={centerSettingsClasses.paper} variant={"outlined"} >
            <h3 className={centerSettingsClasses.title}>Service Valet Ops Code</h3>
            <Button className={centerSettingsClasses.edit} color="primary" onClick={() => onEdit()} disabled={!zonesData.length}>Edit</Button>
            {isLoading
                ? <Loading/>
                : zonesData.length
                    ? <div className={classes.wrapper}>
                        {[...zonesData]
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(item => {
                                return <>
                                    <div className={classes.zone} key={item.name}>{item.name.toUpperCase()}</div>
                                    <div key={item.opsCode + item.name}>{item.opsCode}</div>
                                </>
                            })}
                    </div>
                    : <div className={centerSettingsClasses.value}>No zones</div>
            }
        </Paper>
    </Grid>
}