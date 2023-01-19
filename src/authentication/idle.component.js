import React, { Component } from 'react'
import { Button,Modal } from 'antd';
import App from '../components/app.component/App';
import { userManager } from './index';
import IdleTimer from 'react-idle-timer';
import { updateAccessdenied } from '../reducers/feturesReducer';
import { connect } from 'react-redux';
import swwicon from '../assets/images/oops.png'

class IdleCmp extends Component {
    _count = 15;
    timeInterval;
    state = {
        counter: 15,
        showIdleModal: false,
        showRefreshPage: false,
    }
    handleOnIdle = () => {
        this.setState({ ...this.state, showIdleModal: true });
        this.timeInterval = setInterval(() => {
            if (this._count === 0) { clearInterval(this.timeInterval); userManager.signoutRedirect(); } else {
                this._count = this._count - 1;
                this.setState({ ...this.state, counter: this._count });
            }
        }, 1000);
    }


    handleCancel = () => {
        clearInterval(this.timeInterval); this._count = 15;
        this.setState({ ...this.state, counter: this._count, showIdleModal: false });
    }

    render() {
        const { showIdleModal, counter, showRefreshPage } = this.state;
        if(this.props.menuItems?.accessDenied){
            this.props.dispatch(updateAccessdenied(false))
            this.setState({ ...this.state, showRefreshPage: true });
          }
        return (
            <div>
                <IdleTimer
                    ref={ref => { this.idleTimer = ref }}
                    timeout={1000 * 60 * 10}
                    onIdle={this.handleOnIdle}
                    debounce={250}
                />
                <App updateAvailable={this.props.updateAvailable} />
                <Modal
                    title="Session timedout alert" visible={showIdleModal}
                    closable={false}
                    closeIcon={false}
                    footer={[
                        <>

                            
                            <Button  block
                                className="cust-cancel-btn cust-cancel-btn pay-cust-btn detail-popbtn paynow-btn-ml"
                                onClick={() => this.handleCancel()}>Cancel</Button>
                            <Button block className="primary-btn pop-btn detail-popbtn "
                                // style={{ width: 100, height: 50 }}
                                onClick={() => {userManager.signoutRedirect() }}>Ok</Button>
                        </>
                    ]} >
                    <h4 className="summary-liststyle">You're session will be logged out in {counter}</h4>
                </Modal>
                <Modal
                    title="Oops !" visible={showRefreshPage}
                    closable={false}
                    closeIcon={false}
                    footer={[
                        <>
                            
                            <Button className="primary-btn pop-btn"
                                // style={{ width: 100, height: 50 }}
                                onClick={() => {window.location.reload() }}>Refresh</Button>
                        </>
                    ]} >
                        <div className='text-center'>
                        <img src={swwicon} alt={"error"} />
                    <h4 className="summary-liststyle">Something went wrong please refresh the page.</h4>
                    </div>
                </Modal>
            </div >
        )
    }
}
const mapStateToProps = ({menuItems }) => {
    return { menuItems }
}

export default connect(mapStateToProps)(IdleCmp);