
import React, { useEffect,useState } from "react";
import apiCalls from "../../api/apiCalls";
import AddressCommonCom from "./addressCommonCom";

const NewFiatAddress = (props) => {
  const [isEdit, setEdit] = useState(false);
  const [state, setstate] = useState()
  useEffect(() => {
    if (
      props?.addressBookReducer?.selectedRowData?.id !==
      "00000000-0000-0000-0000-000000000000" &&
      props?.addressBookReducer?.selectedRowData?.id
    ) { setEdit(true); }
    addressbkTrack();


  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addressbkTrack = () => {
    apiCalls.trackEvent({
      Type: "User",
      Action: "Withdraw Fiat Address Book Details page view ",
      Username: props?.userConfig?.id,
      customerId: props?.userConfig?.id,
      Feature: "Withdraw Fiat",
      Remarks: "Withdraw Fiat Address book details view",
      Duration: 1,
      Url: window.location.href,
      FullFeatureName: "Withdraw Fiat",
    });
  };
  const screen=()=>{
  setstate("Fiat")
}
  return (
    <>
      <AddressCommonCom  data={()=>screen()}/>
    </>
  );
};


export default (NewFiatAddress);