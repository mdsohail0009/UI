import { useEffect, useState } from "react";
import FilePreviewer from "react-file-previewer";
import { Modal, Tooltip, Button,Alert, Spin } from "antd";
import apicalls from "../api/apiCalls";

const DocumentPreview = (props) => {
  debugger
  const [previewPath, setPreviewPath] = useState(null);
  const [previewfileName, setPreviewfileName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const mimeType = {
    pdf: "application/pdf",
    png: "image/png",
    jpeg: "image/jpeg",
    jpg: "image/jpg",
    xls: "application/xls",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    txt: "text/plain"
  };
  const [mimetypefiles, setMimeTypeFiles] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    docPreview();
  }, []);

  const docPreview = async () => {
    debugger
    setIsLoading(true);
    let res = await apicalls.getFileURL(props?.upLoadResponse?.id);
    let extensions =null
    if (res.ok) {
      setIsLoading(false);
      setPreviewfileName(props?.upLoadResponse?.fileName || props?.upLoadResponse?.name);
      if(props?.upLoadResponse?.fileName){
         extensions = props?.upLoadResponse?.fileName.split(".");
      }else{
         extensions = props?.upLoadResponse?.name.split(".");
      }
      let isFileName = extensions[extensions.length - 1];
      setMimeTypeFiles(mimeType[isFileName].toLowerCase());
      setPreviewPath(res.data);
    } else {
      setIsLoading(false);
      setErrorMsg(isErrorDispaly(res));
    }
  };
  const isErrorDispaly = (objValue) => {
    if (objValue.data && typeof objValue.data === "string") {
      return objValue.data;
    } else if (
      objValue.originalError &&
      typeof objValue.originalError.message === "string"
    ) {
      return objValue.originalError.message;
    } else {
      return "Something went wrong please try again!";
    }
  };
  return (
    <>
      {errorMsg !== null && (
        <Alert
          type="error"
          description={errorMsg}
          onClose={() => setErrorMsg(null)}
          showIcon
        />
      )}
      <Modal
        className="documentmodal-width"
        title="Preview"
        width={1000}
        visible={props.previewModal}
        closeIcon={
          <Tooltip title="Close">
            <span
              className="icon md c-pointer close"
              onClick={props.handleCancle}
            />
          </Tooltip>
        }
        footer={
          <>
           <div className="cust-pop-up-btn crypto-pop">
              <Button
                type="primary"
                onClick={props.handleCancle}
                className="cust-cancel-btn cust-cancel-btn pay-cust-btn detail-popbtn paynow-btn-ml"
              >
                Close
              </Button>
              <a
                 className="primary-btn pop-btn detail-popbtn"
                download={previewfileName}
                href={`data:${mimetypefiles};base64,` + previewPath}
                title="Download pdf document"
              >
                Download
              </a>
            </div>
          </>
        }
      >
        <Spin spinning={isLoading}>
          <FilePreviewer
            hideControls={true}
            file={{
              data: previewPath,
              name: previewfileName,
              mimeType: mimetypefiles
            }}
          />
          </Spin>
      </Modal>

      
    </>
  );
};
export default DocumentPreview;
