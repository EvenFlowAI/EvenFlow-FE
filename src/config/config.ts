import {IOrder} from "../types/types";
import {TRole} from "../store/reducers/users/types";

//let apiHost = "https://be.dev.evenflow.ai";
let apiHost = "https://3.134.209.56";

// todo change
// let apiHost = "https://api.evenflow.ai";
switch(process.env.REACT_APP_ENV){
    case "production":
        apiHost = "https://api.evenflow.ai"; 
        break;
    case "stage":
        apiHost = "https://be.stage.evenflow.ai"; 
        break;
    case "local":
        apiHost = "http://localhost:5000"; 
        break;
}

export const APIHost = apiHost;
export const APIUrl = `${APIHost}/api/v0`;

export const defaultRowsPerPageOptions = [10, 50, 100];
export const defaultRowsPerPage = 10;
export const defaultOrder: IOrder = {isAscending: true};
export const superUser: TRole = "Super Admin";