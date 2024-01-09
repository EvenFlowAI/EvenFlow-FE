import {useEffect} from "react";
import {LocalTokens} from "../../types/types";
import {v4 as uuidv4} from "uuid";

export const useStorage = () => {
    useEffect(() => {
        if (!sessionStorage.getItem(LocalTokens.sessionId)) {
            const uid = uuidv4();
            sessionStorage.setItem(LocalTokens.sessionId, uid);
        }
        window.addEventListener('unload', () => {
            sessionStorage.setItem(LocalTokens.sessionId, '')
        })
    }, [sessionStorage])
}