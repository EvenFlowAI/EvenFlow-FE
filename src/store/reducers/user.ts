interface IUser {
    name: string;
}

interface IUsersState {
    usersList: IUser[] | null;
    usersLoading: boolean;
}
type AddUser = {type: "GET_USERS", payload: IUser[]};
type LoadingUsers = {type: "LOADING_USERS", payload: boolean};
type UserActions = AddUser | LoadingUsers;


const initialState: IUsersState = {
    usersList: null,
    usersLoading: false
}

export function usersReducer(state=initialState, action: UserActions): IUsersState {
    switch (action.type) {
        case "GET_USERS":
            return {...state, usersList: action.payload};
        case "LOADING_USERS":
            return {...state, usersLoading: action.payload};
        default:
            return initialState;
    }
}