import {createContext, useContext} from "react";
import {ITokens} from "../types/types";

export interface ITokensContext {
    tokens: Partial<ITokens>,
    setTokens: (t: ITokens) => void
}

export const AuthContext = createContext<ITokensContext>({tokens: {}, setTokens: () => {}});

export function useAuth() {
    return useContext(AuthContext);
}
