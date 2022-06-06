import React, { Component } from 'react'
import { Button,Modal } from 'antd';
import App from '../components/app.component/App';
import { userManager } from './index';
import IdleTimer from 'react-idle-timer';
import ConnectStateProps from '../utils/state.connect';
class IdleCmp extends Component {
    _count = 15;
    timeInterval;
    state = {
        counter: 15,
        showIdleModal: false
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
        const { showIdleModal, counter } = this.state;
        return (
            <div>
                <IdleTimer
                    ref={ref => { this.idleTimer = ref }}
                    timeout={1000 * 60 * 10}
                    onIdle={this.handleOnIdle}
                    debounce={250}
                />
                <App />
                <Modal
                    title="Session timedout alert" visible={showIdleModal}
                    closable={false}
                    closeIcon={false}
                    footer={[
                        <>
                            <Button style={{ width: 100 }}
                                className=" pop-cancel"
                                onClick={() => this.handleCancel()}>Cancel</Button>
                            <Button className="primary-btn pop-btn"
                                style={{ width: 100, height: 50 }}
                                onClick={() => {userManager.signoutRedirect() }}>Ok</Button>
                        </>
                    ]} >
                    <h4 className="text-white fs-16 fw-400">You're session will be logged out in {counter}</h4>
                </Modal>
            </div >
        )
    }
}

export default ConnectStateProps(IdleCmp);