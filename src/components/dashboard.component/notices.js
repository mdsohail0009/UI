import { Alert, Carousel } from "antd";
import { useEffect, useState } from "react"
import Loader from "../../Shared/loader";
import connectStateProps from "../../utils/state.connect";
import { getNotices } from "./api";

const Notices = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({ hasError: false, message: null });
    const [notices, setNotices] = useState([]);
    useEffect(() => { fetchNotices(); }, []);
    const fetchNotices = async () => {
        const response = await getNotices();
        if (response.ok) {
            setNotices(response.data);
        } else {
            setError({ hasError: true, message: response.originalError });
        }
        setLoading(false)
    }
    if (loading) {
        return <Loader />
    }
    if (error.hasError) {
        return <Alert type="error" message="Alert" description="Something went wrong please try again!" showIcon />
    }
    return <Carousel autoplay className="mb-16">
        {notices.map((notice, indx) => <div key={indx} className="p-28 carousel-card">
            <div className="fs-16 text-black mb-24" dangerouslySetInnerHTML={{__html: notice.notice}}></div>
        </div>)}
    </Carousel>
}

export default connectStateProps(Notices)