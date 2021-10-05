import { Alert, Carousel, Typography } from "antd";
import { useEffect, useState } from "react"
import Loader from "../../Shared/loader";
import connectStateProps from "../../utils/state.connect";
import { getNotices } from "./api";
const { Title, Text } = Typography;
const Notices = ({ userProfile }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({ hasError: false, message: null });
    const [notices, setNotices] = useState([]);
    useEffect(() => { fetchNotices(); }, []);
    const fetchNotices = async () => {
        const response = await getNotices(userProfile.id);
        if (response.ok) {
            setNotices(response.data);
            setError({ hasError: false, message: null });
        } else {
            setError({ hasError: true, message: response.data });
        }
        setLoading(false)
    }
    if (loading) {
        return <Loader />
    }
    if (error.hasError) {
        return <Alert type="error" message="Alert" description="Something went wrong please try again!" showIcon />
    }
    return <Carousel autoplay className="mb-24">

        {notices.map((notice, indx) => <div key={indx} className="p-28 carousel-card">
            <Title className="fs-24 text-black mb-4" >{notice.title}</Title>
            <div className="fs-16 text-black mb-24 noticeNxtLine" dangerouslySetInnerHTML={{ __html: notice.htmlContent }}>

            </div>
        </div>)}
        {notices.length === 0 && <div className="carousel-card"><Text className="notice-nodata fs-20 fw-500 text-primary">Notices are not available</Text></div>}
    </Carousel>
}

export default connectStateProps(Notices)