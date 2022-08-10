import { Route } from "react-router-dom"
import { store } from "../../../store"
import { KEY_URL_MAP } from "./config";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { menuItems: { features, featurePermissions } } = store.getState();
    return <Route {...rest} render={(props) => {
        if (featurePermissions[KEY_URL_MAP][props.path]){
            return <Component {...rest} />
        }else{
            
        }
    }} />
}

export default ProtectedRoute; 