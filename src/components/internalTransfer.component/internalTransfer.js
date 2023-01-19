import { useEffect } from "react"
import comingsoon from '../../assets/images/comingsoon.png'
import {Typography} from "antd";
import { getScreenName } from "../../reducers/feturesReducer";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

const { Text } = Typography;

const InternalTransfer = (props) => {
    useEffect(() => {
       props.dispatch(getScreenName({getScreen:"dashboard"}))
    }, []);
    
    return <div className="text-center intertrans">
        <div className="">
        <img src={comingsoon} className="" style={{ marginBottom: '10px' }} alt="Confirm" />
        <div><Text className="db-titles internal-titles">Coming soon</Text></div>
        </div>

        </div>

}

const connectDispatchToProps = dispatch => {
    return {
        dispatch
    }
  }
  
 export default connect(connectDispatchToProps)(withRouter(InternalTransfer));

