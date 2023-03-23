import { useEffect } from "react"
import {Typography,Drawer} from "antd";
import { getScreenName } from "../../reducers/feturesReducer";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PersonalTransfer from '../personalInternalTransfer.component/personalTransfer'
const {Paragraph } = Typography;

const PersonalInternalTransafer = (props) => {
    useEffect(() => {
       props.dispatch(getScreenName({getScreen:"dashboard"}))
    }, []);
    
         return (
            <Drawer
            title={[
                <div className="side-drawer-header">
                    <span />
                    <span
                        onClick={() =>props?.onClose()}
                        className="icon md close-white c-pointer"
                    />
                </div>,
            ]}
                placement="right"
                closable={true}
                visible={props.showDrawer}
                closeIcon={null}
                className="side-drawer custom-fait-sidedrawer"
                destroyOnClose={true}
            >
              <PersonalTransfer walletCode={props.walletCode}/>
            </Drawer>
        );

}

const connectDispatchToProps = dispatch => {
    return {
        dispatch
    }
  }
  
 export default connect(connectDispatchToProps)(withRouter(PersonalInternalTransafer));

