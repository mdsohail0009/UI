import { Alert, Carousel,Typography } from "antd";
import { useEffect, useState } from "react"
import Loader from "../../Shared/loader";
import connectStateProps from "../../utils/state.connect";
import { getNotices } from "./api";
import Translate from 'react-translate-component';
const {Title}=Typography;
const Notices = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({ hasError: false, message: null });
    const [notices, setNotices] = useState([]);
    useEffect(() => { fetchNotices(); }, []);//eslint-disable-line react-hooks/exhaustive-deps
    const fetchNotices = async () => {
        const response = await getNotices();
        if (response.ok) {
            setNotices(response.data);
        } else {
            setError({ hasError: true, message: isErrorDispaly(response) });
        }
        setLoading(false)
    }
    const isErrorDispaly = (objValue) => {
        if (objValue.data && typeof objValue.data === "string") {
            return objValue.data;
        } else if (objValue.originalError && typeof objValue.originalError.message === "string"
        ) {
            return objValue.originalError.message;
        } else {
            return "Something went wrong please try again!";
        }
    };
    
    if (error.hasError) {
        return <Alert type="error" message="Alert" description={error.message || "Something went wrong please try again!"} showIcon />
    }
    return( 
    <>
 {/* <div className='market-panel-newstyle'></div> */}
   {notices.length>=1 &&<>
    <div className="">
            <Translate content="notices" component={Title} className="db-titles" />
               </div>
               {loading && <Loader/>}
               </>
  }
    <Carousel autoplay className="notices-content">
        {notices.map((notice, indx) => <div key={indx} className="p-28 carousel-card">
            <div className=" carosel-content" dangerouslySetInnerHTML={{__html: notice.notice}}></div>
        </div>)}
    </Carousel>
    </>)
}

export default connectStateProps(Notices)