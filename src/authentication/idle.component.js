import React, { Component } from 'react'
import App from '../App';
import { Modal } from 'antd';
import { userManager } from './index';
import IdleTimer from 'react-idle-timer'
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
    handleOnActive = event => {


    }

    handleOnAction = event => {

    }

    render() {
        const { showIdleModal, counter } = this.state;
        return (
            <div>
                <IdleTimer
                    ref={ref => { this.idleTimer = ref }}
                    timeout={1000 * 60 * 1}
                    onActive={this.handleOnActive}
                    onIdle={this.handleOnIdle}
                    onAction={this.handleOnAction}
                    debounce={250}
                />
                <App />
                <Modal title="Session timedout alert" visible={showIdleModal} closable={false} closeIcon={false} onOk={() => { userManager.signoutRedirect(); }} onCancel={() => this.handleCancel()} >
                    <h4>You're session will be logged out in {counter}</h4>
                </Modal>
            </div >
        )
    }
}

export default IdleCmp