// import React, { useEffect, useState } from 'react';
// import { Form, Input, Button, notification, Typography, Alert } from 'antd';
// import connectStateProps from '../../utils/state.connect';
// import { changePassword } from '../../api/apiServer';
// notification.config({
//     placement: "topRight",
//     rtl: true
// });
// const ChangePassword = ({ profile, onSubmit, info }) => {
//     const [form] = Form.useForm();
//     const [requiredMark, setRequiredMarkType] = useState('required');
//     const [changePasswordResponse, setChangePasswordResponse] = useState({ error: false, messsage: "", isLoading: false });
//     useEffect(() => {
//         setChangePasswordResponse({ error: false, messsage: "", isLoading: false });
//         form.resetFields();
//     }, [info])
//     const onFinish = async (values) => {
//         setChangePasswordResponse({ ...changePasswordResponse, isLoading: true, messsage: "" });
//         const obj = { "email": profile?.profile?.email, "currentPassword": values.oldPassword, "password": values.newPassword, "confirmPassword": values.confirmPassword, }
//         const response = await changePassword(obj);
//         if (response.ok) {
//             setChangePasswordResponse({ error: false, messsage: "Password updated successfully", isLoading: false });
//             onSubmit();
//         } else {
//             setChangePasswordResponse({ error: true, messsage: response.originalError.message, isLoading: false });
//         }
    

//     }
//     return (
//         <Form
//             form={form}
//             layout="vertical"
//             initialValues={{
//                 requiredMarkValue: requiredMark,
//                 oldPassword: "",
//                 newPassword:"",
//                 confirmPassword: ""
//             }}
//             requiredMark={requiredMark}
//             onFinish={(values) => onFinish(values)}
            
//         >
//             {changePasswordResponse.messsage !== "" && <Typography>
//                 <Alert type={changePasswordResponse?.error ? "error" : "success"} showIcon message="Change Password" description={changePasswordResponse.messsage} />
//             </Typography>}
//             <Form.Item label="Current Password" required tooltip="This is a required field" name="oldPassword" rules={[{ required: true, message: "Please enter old password" }]}>
//                 <Input type="password" placeholder="Current Password" />
//             </Form.Item>
//             <Form.Item name="newPassword"
//                 label="New password"
//                 tooltip="This is a required field"
//                 required
//                 rules={[{ required: true, message: "Please enter new password" }]}
//             >
//                 <Input type="password" placeholder="New Password" />
//             </Form.Item>
//             <Form.Item required name="confirmPassword"
//                 label="Confirm password"
//                 dependencies={['password']}
//                 hasFeedback
//                 rules={[
//                     {
//                         required: true,
//                         message: 'Please confirm your password!',
//                     },
//                     ({ getFieldValue }) => ({
//                         validator(rule, value) {
//                             if (!value || getFieldValue('newPassword') === value) {
//                                 return Promise.resolve();
//                             }
//                             return Promise.reject('The two passwords that you entered do not match!');
//                         },
//                     }),
//                 ]} tooltip="This is a required field"
//             >
//                 <Input type="password" placeholder="Confirm Password" />
//             </Form.Item>
//             <Form.Item >
//                 <Button loading={changePasswordResponse.isLoading} type="primary" htmlType="submit">Submit</Button>
//             </Form.Item>
//         </Form>
//     );
// };

// export default connectStateProps(ChangePassword);




import { Drawer, Typography, Input, Button, label,Select, Switch,Form, notification,  Alert } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import connectStateProps from '../../utils/state.connect';
import { changePassword } from '../../api/apiServer';
notification.config({
      placement: "topRight",
      rtl: true
  });

const LinkValue = (props) => {
    return (
        <Translate className="text-yellow text-underline c-pointer"
            content={props.content}
            component={Link}
            to="./#"
        />
    )
}
const { Option } = Select;
const ChangePassword = ({ profile, onSubmit, info }) => {
      const [form] = Form.useForm();
      const [requiredMark, setRequiredMarkType] = useState('required');
      const [changePasswordResponse, setChangePasswordResponse] = useState({ error: false, messsage: "", isLoading: false });
      useEffect(() => {
          setChangePasswordResponse({ error: false, messsage: "", isLoading: false });
          form.resetFields();
      }, [info])
      const onFinish = async (values) => {
          setChangePasswordResponse({ ...changePasswordResponse, isLoading: true, messsage: "" });
          const obj = { "email": profile?.profile?.email, "currentPassword": values.oldPassword, "password": values.newPassword, "confirmPassword": values.confirmPassword, }
          const response = await changePassword(obj);
          if (response.ok) {
              setChangePasswordResponse({ error: false, messsage: "Password updated successfully", isLoading: false });
              onSubmit();
          } else {
              setChangePasswordResponse({ error: true, messsage: response.originalError.message, isLoading: false });
          }
      
  
      }

        const { Paragraph,Title, Text } = Typography;
        return (
          <div className="custom-formcard mt-36">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              requiredMarkValue: requiredMark,
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            requiredMark={requiredMark}
            onFinish={(values) => onFinish(values)}
          >
            {changePasswordResponse.messsage !== "" && (
              <Typography>
                <Alert
                  type={changePasswordResponse?.error ? "error" : "success"}
                  showIcon
                  message="Change Password"
                  description={changePasswordResponse.messsage}
                />
              </Typography>
            )}
            <Translate
              content="Change_password"
              component={Title}
              className="mb-0  fs-24 text-white-30 fw-400 "
            />
            <Translate
              content="Choose_a_unique_password_to_protect_your_account"
              component={Paragraph}
              className="mt-36 mb-8 fs-14 text-white-30 fw-400 "
            />
            <Form.Item
              className="custom-forminput"
              // label="Current Password"
              required
              tooltip="This is a required field"
              name="oldPassword"
              rules={[
                { required: true, message: "Please enter old password" },
              ]}
              
            >
              <Input
                type="password"
                placeholder="Current Password"
                className="cust-input mb-8"
              />
            </Form.Item>
            <Form.Item
              name="newPassword"
              // label="New password"
              tooltip="This is a required field"
              required
              rules={[
                { required: true, message: "Please enter new password" },
              ]}
            >
              <Input
                type="password"
                placeholder="New Password"
                className="cust-input mb-8"
              />
            </Form.Item>
            <Form.Item
              required
              name="confirmPassword"
              // label="Confirm password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "The two passwords that you entered do not match!"
                    );
                  },
                }),
              ]}
              tooltip="This is a required field"
            >
              <Input
                type="password"
                placeholder="Confirm Password"
                className="cust-input mb-8"
              />
            </Form.Item>
            <div className="pay-list custom-switch p-0">
              <div>
                <Translate
                  className="fw-400 fs-16 text-white-30"
                  content="Require_all_devices_to_signin"
                  component={Text}
                />
                <Translate
                  content="with_new_password"
                  component={Paragraph}
                  className="fs-14 text-white-30 fw-500 "
                />
              </div>
              <div>
                <Translate
                  className="fw-400 fs-16 text-white-30 mr-4"
                  content="Yes"
                  component={Text}
                  style={{ verticalAlign: "middle" }}
                />
                <Switch
                  size="small"
                  defaultChecked
                  className="custom-toggle ml-12 custom-switch-toggle"
                />
              </div>
            </div>

            <Form.Item>
              <Button
                loading={changePasswordResponse.isLoading}
                type="primary"
                htmlType="submit"
                size="large"
                block
                className="pop-btn fw-400 fs-16"
              >
                Submit
              </Button>
            </Form.Item>
            <Form.Item>
              <Translate
                type="text"
                size="large"
                loading={changePasswordResponse.isLoading}
                className="text-center fs-16 text-white-30 pop-cancel fw-400 text-captz "
                block
                htmlType="submit"
                content="forgot_your_password"
                component={Button}
              />
            </Form.Item>
          </Form>
        </div>
        );
}

const connectStateToProps = ({ buySell, oidc }) => {
    return { buySell }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(ChangePassword);
