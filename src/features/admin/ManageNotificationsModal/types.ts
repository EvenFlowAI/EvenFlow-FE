import {Dispatch, SetStateAction} from "react";

export type TChangesState = {
    scNotificationsSaved: boolean;
    podNotificationsSaved: boolean;
    recallNotificationsSaved: boolean;
    transportationNotificationsSaved: boolean;
}

export type TNotificatonsProps = {setChangesState: Dispatch<SetStateAction<TChangesState>>, changesState?: TChangesState}