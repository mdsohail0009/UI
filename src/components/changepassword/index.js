import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import connectStateProps from '../../utils/state.connect';
import { changePassword } from '../../api/apiServer';
notification.config({
    placement:"topRight",
    rtl:true
});
const ChangePassword = ({ profile, onSubmit }) => {
    const [form] = Form.useForm();
    const [requiredMark, setRequiredMarkType] = useState('required');
    const showNotification = ({ type, description, title }) => {
        notification[type]({
            message: title,
            description:description,
        })
    }
    const onFinish = async (values) => {
        const obj = { "email": profile?.profile?.email, "currentPassword": values.oldPassword, "password": values.newPassword, "confirmPassword": values.confirmPassword, }
        const response = await changePassword(obj);
        if (response.ok) {
            showNotification({ type: "success", title: "Change password", description: "Password updated successfully" });
            onSubmit();
        } else {
            showNotification({ type: "error", title: "Change password", description: response.originalError });
            onSubmit();
        }

    }
    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                requiredMarkValue: requiredMark,
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            }}
            requiredMark={requiredMark}
            onFinish={(values) => onFinish(values)}
        >

            <Form.Item label="Current Password" required tooltip="This is a required field" name="oldPassword" rules={[{ required: true, message: "Please enter old password" }]}>
                <Input type="password" placeholder="Current Password" />
            </Form.Item>
            <Form.Item name="newPassword"
                label="New password"
                tooltip="This is a required field"
                required
                rules={[{ required: true, message: "Please enter new password" }]}
            >
                <Input type="password" placeholder="New Password" />
            </Form.Item>
            <Form.Item required name="confirmPassword"
                label="Confirm password"
                dependencies={['password']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(rule, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject('The two passwords that you entered do not match!');
                        },
                    }),
                ]} tooltip="This is a required field"
            >
                <Input type="password" placeholder="Confirm Password" />
            </Form.Item>
            <Form.Item >
                <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
        </Form>
    );
};

export default connectStateProps(ChangePassword);