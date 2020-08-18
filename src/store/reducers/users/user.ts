import {ICurrentUser, TUserActions} from "./types";
import {superUser} from "../../../config/config";


type IUsersState = {
    currentUser?: ICurrentUser
}
const initialState: IUsersState = {

}

export function usersReducer(state=initialState, action: TUserActions): IUsersState {
    switch (action.type) {
        case "User/GetCurrentUser":
            return {...state, currentUser: {...action.payload, isSuperUser: action.payload.role === superUser}};
        default:
            return state;
    }
}