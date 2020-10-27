import React from 'react';
import {Button} from "@material-ui/core";

export const ActiveOffers = () => {
    return (
        <div>
            <div style={{textAlign: "right"}}>
                <Button
                    variant="outlined"
                    color="primary"
                >Add New Offer</Button>
                <Button
                    style={{marginLeft: 12}}
                    variant="contained"
                    color="primary"
                >Send Offer</Button>
            </div>
        </div>
    );
};