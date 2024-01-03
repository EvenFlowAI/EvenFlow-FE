import React, {useMemo} from "react";
import {Button, Grid, Paper} from "@material-ui/core";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {useCenterSettingsStyles} from "../../../../hooks/styling/useCenterSettingsStyles";
import {useStyles} from "./styles";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";

type TProps = {
    onEdit: () => void;
    isLoading: boolean;
}

export const ZonesOpsCodesPlate: React.FC<TProps> = ({onEdit, isLoading}) => {
    const {centerSettings} = useSelector((state: RootState) => state.capacityServiceValet);
    const {zones} = useSelector((state: RootState) => state.serviceValet);
    const centerSettingsClasses = useCenterSettingsStyles();
    const classes = useStyles();

    const zonesData = useMemo(() => {
        return zones.map(el => {
            const opsCode = centerSettings?.zoneServiceRequests
                .find(item => item.zone.id === el.id)?.serviceRequest?.code;
            return {
                name: el.name,
                opsCode: opsCode ?? 'Unassigned'
            }
        })
    }, [centerSettings, zones])

    return <Grid item xs={6} md={4}>
        <Paper className={centerSettingsClasses.paper} variant={"outlined"} >
            <h3 className={centerSettingsClasses.title}>Service Valet Ops Code</h3>
            <Button className={centerSettingsClasses.edit} color="primary" onClick={() => onEdit()}>Edit</Button>
            {isLoading
                ? <Loading/>
                : <div className={classes.wrapper}>
                    {[...zonesData]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(item => {
                            return <div className={classes.elementWrapper} key={item.name}>
                                <div className={classes.zone}>{item.name.toUpperCase()}</div>
                                <div>{item.opsCode}</div>
                            </div>
                        })}
                </div>
            }
        </Paper>
    </Grid>
}