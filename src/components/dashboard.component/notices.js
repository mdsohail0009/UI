import { Alert, Carousel,Typography } from "antd";
import { useEffect, useState } from "react"
import Loader from "../../Shared/loader";
import connectStateProps from "../../utils/state.connect";
import { getNotices } from "./api";
import Translate from 'react-translate-component';
import apicalls from "../../api/apiCalls";
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
            setError({ hasError: true, message: apicalls.isErrorDispaly(response)});
        }
        setLoading(false)
    }
    
    if (error.hasError) {
        return <Alert type="error" message="Alert" description={error.message || "Something went wrong please try again!"} showIcon />
    }
    return( 
    <>
    
 <div className='market-panel-newstyle'></div>
   {notices.length>=1 &&<>
    <div className="fait-wallets-style notices-style">
            <Translate content="notices" component={Title} className="db-titles" />
               </div>
               {loading && <Loader/>}
               </>
  }
    <Carousel autoplay className="">
        {notices.map((notice, indx) => <div key={indx} className="p-28 carousel-card">
            <div className=" carosel-content" dangerouslySetInnerHTML={{__html: notice.notice}}></div>
        </div>)}
    </Carousel>
    </>)
}

export default connectStateProps(Notices)