import {ICurrentUser, TUserActions} from "./types";
import {superUser} from "../../../config/config";


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
            return {...state, currentUser: {...action.payload, isSuperUser: action.payload.role === superUser}};
        case "User/Saving":
            return {...state, saving: action.payload};
        default:
            return state;
    }
}