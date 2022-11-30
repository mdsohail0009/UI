import React from 'react';
import {Button, Form,Modal,DatePicker,Tooltip,Alert} from "antd";
  import moment from "moment/moment";
  import apicalls from '../../api/apiCalls';
  import Translate from "react-translate-component";
const TransactionTimeSpan=(props)=> {
 const {modal,handleDateCancel,message,handleDateChange,handleOk,searchObj,formDateRef}=props
    return (
      <>
         <Modal
          title="Custom Dates"
          visible={modal}
          closeIcon={
            <Tooltip title="Close">
              <span
                className="icon md close-white c-pointer"
                onClick={() => handleDateCancel()}
              />
            </Tooltip>

          }
          footer={null}
        >
          <div className="">
            <Form
                autoComplete="off"
                onFinish={(e) =>handleOk(e, "timeSpan")}
                ref={formDateRef}
              >
                {message && <Alert showIcon type="info" description={message} closable={false} />}
                <div className="mb-24">
                  <Form.Item
                    name="fromdate"
                    className="input-label"
                    style={{ marginLeft: 0 }}
                    label="From Date"
                    rules={[
                      { required: true, message: "Is required" }
                    ]}
                  >
                    <DatePicker
                      format={"DD/MM/YYYY"}
                      placeholder={apicalls.convertLocalLang('Select_Date')}
                      onChange={(e) => handleDateChange(e, 'fromdate')}
                      className="cust-input mb-0" style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    name="todate"
                    className="input-label mt-12"
                    style={{ marginLeft: 0 }}
                    label="To Date"
                    // {<Translate content="End_Date" component={Form.label} className=" ml-8" />}
                    rules={[
                      { required: true, message: apicalls.convertLocalLang('is_required') }, {
                        type: "date", validator: async (rule, value, callback) => {
                          if (value) {
                            if (new Date(value) < moment(searchObj.fromdate).format('DD/MM/YYYY')) {
                              throw new Error("From date must be less than or equal to the to date.")
                            } else {
                              callback();
                            }
                          }
                        }
                      }
                    ]}
                  >
                    <DatePicker
                      className="cust-input mb-0"
                      placeholder={apicalls.convertLocalLang('Select_Date')}
                      onChange={(e) => handleDateChange(e, 'todate')}
                      format={"DD/MM/YYYY"}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </div>
                <Form.Item className="mb-0">
                  <div className="text-right">
                    <Button type="button" className="c-pointer text-center text-white-30 fw-400 mr-8 cancel-btn pop-btn" onClick={handleDateCancel} ><span><Translate content="cancel" /></span></Button>
                    <Button type="button" style={{ width: 100 }} key="submit" className="c-pointer pop-btn ant-btn px-24" htmlType="submit"><span><Translate content="ok" /></span></Button>
                  </div>
                </Form.Item>
              </Form>
          </div>
        </Modal>
      </>
    );
  }

export default TransactionTimeSpan;