import { useEffect } from "react"
import {Typography} from "antd";
import { getScreenName } from "../../reducers/feturesReducer";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

const { Text } = Typography;

const PersonalInternalTransafer = (props) => {
    useEffect(() => {
       props.dispatch(getScreenName({getScreen:"dashboard"}))
    }, []);
    
    return <div className="text-center intertrans">
        <div className="">
        <div><Text className="db-titles internal-titles">Personal Internal Transafer</Text></div>
        </div>

        </div>

}

const connectDispatchToProps = dispatch => {
    return {
        dispatch
    }
  }
  
 export default connect(connectDispatchToProps)(withRouter(PersonalInternalTransafer));

