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
    if (loading) {
        return <Loader />
    }
    if (error.hasError) {
        return <Alert type="error" message="Alert" description={error.message || "Something went wrong please try again!"} showIcon />
    }
    return <Carousel autoplay className="mb-16">
        {notices.map((notice, indx) => <div key={indx} className="p-28 carousel-card">
            <div className="fs-16 text-black mb-24 carosel-content" dangerouslySetInnerHTML={{__html: notice.notice}}></div>
        </div>)}
    </Carousel>
}

export default connectStateProps(Notices)