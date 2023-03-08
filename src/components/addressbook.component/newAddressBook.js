import React, { useState, useEffect } from "react";
import Translate from "react-translate-component";
import apiCalls from "../../api/apiCalls";
import { Link } from "react-router-dom";
import AddressCommonCom from "./addressCommonCom";
const LinkValue = (props) => {
  return (
    <Translate
      className="textpure-yellow text-underline c-pointer"
      content={props.content}
      component={Link}
      onClick={() =>
        window.open(
          process.env.REACT_APP_TERMS_AND_CONDITIONS,
          "_blank"
        )
      }
    />
  );
};
const link = <LinkValue content="terms_service" />;
const NewAddressBook = (props) => {
  const [isEdit, setEdit] = useState(false);
  const [state, setstate] = useState({data:"Fiat"})
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

  return (
    <>
      <AddressCommonCom   />
    </>
  );
};


export default (NewAddressBook);
