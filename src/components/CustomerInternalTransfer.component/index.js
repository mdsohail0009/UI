import { useEffect } from "react"
import {Drawer} from "antd";
import { getScreenName } from "../../reducers/feturesReducer";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import CustomerTransfer from './customerInternalTransfer'
const CustomerInternalTransafer = (props) => {
    useEffect(() => {
       props.dispatch(getScreenName({getScreen:"dashboard"}))
    }, []);
    
         return (
            <Drawer
            title={[
                <div className="side-drawer-header" key={""}>
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
              <CustomerTransfer walletCode={props.walletCode} onClose={props?.onClose}/>
            </Drawer>
        );

}

const connectDispatchToProps = dispatch => {
    return {
        dispatch
    }
  }
  
 export default connect(connectDispatchToProps)(withRouter(CustomerInternalTransafer));

