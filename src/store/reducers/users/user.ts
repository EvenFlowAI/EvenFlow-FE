import {ICurrentUser, TUserActions} from "./types";


type IUsersState = {
    currentUser?: ICurrentUser
}
const initialState: IUsersState = {

}

export function usersReducer(state=initialState, action: TUserActions): IUsersState {
    switch (action.type) {
        case "User/GetCurrentUser":
            return {...state, currentUser: action.payload};
        default:
            return initialState;
    }
}