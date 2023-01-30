import { Button, Typography } from "antd";
import React, { Component } from "react";
import { userManager } from ".";
import { apiClient } from "../api";
import pending from "../assets/images/warning.png";
const { Title } = Typography;
class SecurityLogin extends Component {
    state = {
        isRelogin: false
    }
    componentDidMount() {
        apiClient.axiosInstance.interceptors.response.use((response) => { return response; }, (error) => {
            const stCode = error.response?.status;
            if (stCode === 409) { this.setState({ ...this.state, isRelogin: true }); }
            return error;
        });
    }
    render() {
        if (this.state.isRelogin) {
            return <div className="main-container cust-cypto-view">
                <div className="security-login text-center">
                    <img src={pending} className="confirm-icon mb-36" />
                    <Title level={4} className="security-text">Due to security reasons please logout and relogin</Title>
                    <div className="text-center">
                        <Button
                            className="primary-btn pop-cancel"
                            style={{ width: '250px' }}
                            onClick={() => { userManager.signoutRedirect(); }}>

                            Click Here to Re-login
                        </Button>
                    </div>
                </div>
            </div>
        }
        return <>{this.props.children}</>
    }
}
export default SecurityLogin;