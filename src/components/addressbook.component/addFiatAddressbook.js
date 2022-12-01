
import React, { useEffect } from "react";
import Translate from "react-translate-component";
import apiCalls from "../../api/apiCalls";
import { Link } from "react-router-dom";
import AddressCommonCom from "./addressCommonCom";
// const LinkValue = (props) => {
//   return (
//     <Translate
//       className="textpure-yellow text-underline c-pointer"
//       content={props.content}
//       component={Link}
//       onClick={() =>
//         window.open(
//           "https://www.iubenda.com/terms-and-conditions/42856099",
//           "_blank"
//         )
//       }
//     />
//   );
// };
//  <LinkValue content="terms_service" />;
const NewFiatAddress = (props) => {
 
  useEffect(() => {
    if (
      props?.addressBookReducer?.selectedRowData?.id !==
      "00000000-0000-0000-0000-000000000000" &&
      props?.addressBookReducer?.selectedRowData?.id
    ) {  }
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
 
}
  return (
    <>
      <AddressCommonCom  data={()=>screen()}/>
    </>
  );
};


export default (NewFiatAddress);