import React, {useEffect, useState} from 'react';
import {EZoneTimeGap} from "../../../store/reducers/capacityServiceValet/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import moment from "moment";
import {generateTimeSlots} from "./utils";

type TZoneCapacityTableProps = {
    gap: EZoneTimeGap;
}

const ZoneCapacityTable: React.FC<TZoneCapacityTableProps> = ({gap}) => {
    const {slotRange} = useSelector((state: RootState) => state.slotScoring);
    const [slots, setSlots] = useState<moment.Moment[]>([]);

    useEffect(() => {
        setSlots(generateTimeSlots(gap, slotRange?.start, slotRange?.end))
    }, [slotRange, gap])

    return (
        <div>

        </div>
    );
};

export default ZoneCapacityTable;