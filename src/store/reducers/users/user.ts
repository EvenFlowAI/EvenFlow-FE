import {ICurrentUser, TUserActions} from "./types";
import {superUser} from "../../../config/config";
import {Roles} from "../../../config/constants";


type IUsersState = {
    currentUser?: ICurrentUser,
    saving: boolean,
}
const initialState: IUsersState = {
    saving: false
}

export function usersReducer(state=initialState, action: TUserActions): IUsersState {
    switch (action.type) {
        case "User/GetCurrentUser":
            const additional: Partial<ICurrentUser> = {};
            if (action.payload.role === superUser) {
                if (action.payload.dealershipId) {
                    additional.role = Roles.Owner;
                } else {
                    additional.isSuperUser = true;
                }
            }
            return {...state, currentUser: {
                ...action.payload,
                ...additional
            }};
        case "User/Saving":
            return {...state, saving: action.payload};
        default:
            return state;
    }
}