import { Button, Typography, Form, Tooltip, Input, Checkbox } from "antd";
import NumberFormat from "react-number-format";
import apiCalls from "../../api/apiCalls";
import Translate from "react-translate-component";
const { Text, Paragraph } = Typography;
const CodeVerification = () => {
    // return <Form
    //     className="mt-36"
    //     name="advanced_search"
    //     autoComplete="off"
    // >

    //     <Text className="fs-14 mb-8 text-white d-block fw-200">
    //         Phone verification code *
    //     </Text>

    //     <Form.Item
    //         name="code"
    //         className="input-label otp-verify"
    //         extra={
    //             <div>
    //                 <Text className="fs-12 text-white-30 fw-200">
    //                     Please enter 6 digit code received in SMS
    //                 </Text>
    //                 <Text
    //                     className="fs-12 text-red fw-200"
    //                     style={{ float: "right", color: "var(--textRed)" }}>
    //                     {""}
    //                 </Text>
    //             </div>
    //         }
    //         rules={[{ required: true, message: "Is required" }]}
    //     >
    //         <div className="p-relative d-flex align-center">

    //             <NumberFormat
    //                 customInput={Input}
    //                 thousandSeparator={false}
    //                 prefix={""}
    //                 decimalScale={0}
    //                 allowNegative={false}
    //                 allowLeadingZeros={true}
    //                 className="cust-input custom-add-select mb-0"
    //                 placeholder={"Enter code"}
    //                 maxLength={6}
    //                 style={{ width: "100%" }}
    //                 onValueChange={(e) => { }}
    //                 disabled={inputDisable}
    //             />
    //             <div className="new-add c-pointer get-code text-yellow hy-align">
    //                 {!verifyTextotp && (
    //                     <Button
    //                         type="text"
    //                         loading={phoneLoading}
    //                         style={{ color: "black" }}
    //                         onClick={() => { }}
    //                         disabled={disable}>
    //                         {btnList[buttonText]}
    //                     </Button>
    //                 )}
    //                 {tooltipVisible == true && (
    //                     <Tooltip
    //                         placement="topRight"
    //                         title={`Haven\'t received code? Request new code in ${seconds} seconds. The code will expire after 30mins.`}>

    //                         <span className="icon md info mr-8" />
    //                     </Tooltip>
    //                 )}
    //                 <Button
    //                     type="text"
    //                     loading={phoneVerifyLoading}
    //                     style={{ color: "black", margin: "0 auto" }}
    //                     onClick={() => { }}
    //                     disabled={verifyPhone == true}>
    //                     {verifyOtpText[verifyOtpText]}
    //                     {verifyTextotp == true && (
    //                         <span className="icon md greenCheck" />
    //                     )}
    //                 </Button>
    //             </div>
    //         </div>
    //     </Form.Item>

    //     <Text className="fs-14 mb-8 text-white d-block fw-200">
    //         Email verification code *
    //     </Text>

    //     <Form.Item
    //         name="emailCode"
    //         className="input-label otp-verify"
    //         extra={
    //             <div>
    //                 <Text className="fs-12 text-white-30 fw-200">
    //                    Please enter 6 digit code received in you'r email id
    //                 </Text>
    //                 <Text
    //                     className="fs-12 text-red fw-200"
    //                     style={{ float: "right", color: "var(--textRed)" }}>
    //                     {""}
    //                 </Text>
    //             </div>
    //         }
    //         rules={[{ required: true, message: "Is required" }]}
    //     >
    //         <div className="p-relative d-flex align-center">
    //             <Input
    //                 type="text"

    //                 className="cust-input custom-add-select mb-0"
    //                 placeholder={"Enter code"}
    //                 maxLength={6}
    //                 style={{ width: "100%" }}
    //                 onClick={(event) =>{}
    //                     //this.handleSendOtp(event.currentTarget.value)
    //                 }
    //                 onChange={(e) => { }}
    //             />
    //             <div className="new-add c-pointer get-code text-yellow hy-align">
    //                     <Button
    //                         type="text"
    //                         style={{ color: "black", margin: "0 auto" }}
    //                         onClick={() => { }}>
    //                         {emailBtn[emailText]}
    //                     </Button>
                  
    //                     <Tooltip
    //                         placement="topRight"
    //                         title={`Haven\'t received code? Request new code in ${seconds2} seconds. The code will expire after 30mins.`}>

    //                         <span className="icon md info mr-8" />
    //                     </Tooltip>

    //                 <Button
    //                     type="text"
    //                     style={{ color: "black", margin: "0 auto" }}
    //                     loading={emailVerifyLoading}
    //                     onClick={(e) => this.getEmailVerification(e)}
    //                     disabled={verifyEmail == true}>
    //                     {verifyText[verifyText]}
    //                     {verifyEmailOtp == true && (
    //                         <span className="icon md greenCheck" />
    //                     )}
    //                 </Button>


    //             </div>
    //         </div>
    //     </Form.Item>


    //     <Text className="fs-14 mb-8 text-white d-block fw-200">
    //         Authenticator Code *
    //     </Text>


    //     <Form.Item
    //         name="authenticator"
    //         className="input-label otp-verify"
    //         extra={
    //             <div>
    //                 <Text
    //                     className="fs-12 text-red fw-200"
    //                     style={{ float: "right", color: "var(--textRed)" }}>
    //                     {""}
    //                 </Text>
    //             </div>
    //         }
    //         rules={[
    //             {
    //                 validator: (rule, value, callback) => {
    //                     var regx = new RegExp(/^[0-9]+$/);
    //                     if (value) {
    //                         if (!regx.test(value)) {
    //                             callback("Invalid 2fa code");
    //                         } else if (regx.test(value)) {
    //                             callback();
    //                         }
    //                     } else {
    //                         callback();
    //                     }
    //                 },
    //             },
    //             {
    //                 required: true,
    //                 message: apiCalls.convertLocalLang("is_required"),
    //             },
    //         ]}
    //     >
    //         <div className="p-relative d-flex align-center">
    //             <Input
    //                 type="text"
    //                 className="cust-input custom-add-select mb-0"
    //                 placeholder={"Enter code"}
    //                 maxLength={6}
    //                 onChange={(e) =>{}
    //                     //this.handleAuthenticator(e, "authenticator")
    //                 }
    //                 style={{ width: "100%" }}

    //             />
    //             <div className="new-add c-pointer get-code text-yellow hy-align" >
    //                 <Button
    //                     type="text"
    //                     style={{ color: "black", margin: "0 auto" }}
    //                     onClick={() => { }}>
    //                     Click here to verify
    //                 </Button>
    //             </div>
    //         </div>
    //     </Form.Item>


    //     <Form.Item
    //         className="custom-forminput mb-36 agree"
    //         name="isAccept"
    //         valuePropName="checked"
    //         required
    //     >
    //         <span className="d-flex">
    //             <Checkbox className={`ant-custumcheck ${!agreeRed ? "check-red" : " "}`} />
    //             <span className="withdraw-check"></span>
    //             <Translate
    //                 content="agree_to_suissebase"
    //                 with={{ LinkValue }}
    //                 component={Paragraph}
    //                 className="fs-14 text-white-30 ml-16 mb-4"
    //                 style={{ flex: 1 }}
    //             />
    //         </span>
    //     </Form.Item>
    //     <Button size="large" block className="pop-btn" htmlType="submit">
    //         <Translate content="with_draw" component={Text} />
    //     </Button>

    // </Form>
    return ""
}
export default CodeVerification;