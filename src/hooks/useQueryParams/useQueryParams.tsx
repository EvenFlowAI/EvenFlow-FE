import { useHistory , useLocation} from "react-router-dom"

export const useQueryParams = () => {
    const {replace} = useHistory();
    const {pathname, search} = useLocation();

    const params = new URLSearchParams(search);

    const setQuery = (queryKey: string, queryValue: string) => {
        params.set(queryKey, queryValue);
        replace({pathname,
            search: params.toString()
        })
    }

    const getQuery = (queryKey: string) => params.get(queryKey)

    return {
        setQuery,
        getQuery
    }

}