import React from "react";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {OptimizationPlate, TOptimizationPlateProps} from "./OptimizationPlate";
import {Grid} from "@material-ui/core";

export const OptimizationWindowsPage = () => {
    const data: TOptimizationPlateProps[] = [
        {
            count: 10,
            helperText: "Set the number of demand value segments to group service requests of equal value",
            label: "Segments",
            title: "Demand Segments",
            onEdit: () => {}
        },
    ]
    return <>
        <TitleContainer title="Optimization Windows" pad parent={optimizerRoot} />
        <Grid container spacing={3}>
            {data.map(plate =>
                <Grid item xs={4} key={plate.title}>
                    <OptimizationPlate
                        onEdit={plate.onEdit}
                        title={plate.title}
                        count={plate.count}
                        label={plate.label}
                        helperText={plate.helperText}
                    />
                </Grid>
            )}
        </Grid>
    </>
}