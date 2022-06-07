import React from 'react';
import {Button, styled} from "@material-ui/core";
import EligibleCustomerSegment from "./EligibleCustomerSegment";
import Zones from "./Zones/Zones";

const TabHeaderWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
})

const ButtonsWrapper = styled('div')({
    display: 'flex',
    alignItems: 'center',
})

const Title = styled('div')({
    fontSize: 24,
    fontWeight: "bold",
})

const TextButton = styled(Button)({
    textTransform: 'none',
    fontSize: 18,
    fontWeight: 'normal',
    color: '#252733',
    marginRight: 20,
})

const ZonesWrapper = styled('div')({
    display: 'flex',
    alignItems: 'flex-start',
    '& > div': {
        marginRight: 24,
    }
})

const GeographicZones = () => {
    const onEditZone = () => {};
    const onRemoveZone = () => {};
    const onAddZone = () => {};

    return (
        <div>
            <TabHeaderWrapper>
                <Title>Eligible Customer Type</Title>
                <ButtonsWrapper>
                    <TextButton variant="text" onClick={onEditZone}>Edit</TextButton>
                    <TextButton variant="text" onClick={onRemoveZone}>Remove</TextButton>
                    <Button onClick={onAddZone} variant="contained" color="primary" style={{width: 160}}>Add Zone</Button>
                </ButtonsWrapper>
            </TabHeaderWrapper>
            <ZonesWrapper>
                <div style={{width: '30%'}}>
                    <EligibleCustomerSegment/>
                </div>
                <Zones/>
            </ZonesWrapper>
        </div>
    );
};

export default GeographicZones;