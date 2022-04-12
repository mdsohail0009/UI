import { Alert, Carousel, Typography, Button } from "antd";
import { useEffect, useState } from "react"
import Translate from "react-translate-component";
import Loader from "../../Shared/loader";
import connectStateProps from "../../utils/state.connect";
import { getNotices } from "./api";
const { Title } = Typography;
const Notices = ({ userProfile }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({ hasError: false, message: null });
    const [notices, setNotices] = useState([]);
    useEffect(() => { fetchNotices(); }, []);
    const fetchNotices = async () => {
        const response = await getNotices(userProfile.id);
        if (response.ok) {
            setNotices(response.data);
        } else {
            setError({ hasError: true, message: response.data });
        }
        setLoading(false)
    }
    if (loading) {
        return <Loader />
    }
    if (!error.hasError) {
        return <Alert type="error" message="Alert" description="Something went wrong please try again!" showIcon />
    }
    return <Carousel autoplay className="mb-24">
        {notices.map((notice, indx) => <div className="p-28 carousel-card">
            <Title className="fs-24 text-black mb-4" title={notice.title} />
            <div className="fs-16 text-black mb-24"  >
                {notice.htmlContent}
            </div>
            {/* <Translate content="db_slider_btn" component={Button} type="primary" className="custom-btn fs-14 prime mb-24" /> */}
        </div>)}
    </Carousel>
}

export default connectStateProps(Notices)