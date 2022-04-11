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
        {/* {notices.map((notice, indx) => <div className="p-28 carousel-card">
            <Title className="fs-24 text-black mb-4" title={notice.title} />
            <div className="fs-16 text-black mb-24"  >
                {notice.htmlContent}
            </div>
            <Translate content="db_slider_btn" component={Button} type="primary" className="custom-btn fs-14 prime mb-24" />
        </div>)} */}
        <div className="p-28 carousel-card">
            <Title className="fs-24 text-black mb-16">Dear Users,</Title>
            <div className="fs-16 text-black">
            Our office will be closed on Friday, 15 April 2022, in order for us to celebrate the Good Friday holidays. During this period, we won’t respond to any messages / we’ll be slower to respond than usual but we will be checking our emails. We assure you that all your emails will be answered as soon as we return to the office on 18 April 2022.
            <br />
            <br />
            Thank you.
            </div>
            {/* <Translate content="db_slider_btn" component={Button} type="primary" className="custom-btn fs-14 prime" /> */}
        </div>

    </Carousel>
}

export default connectStateProps(Notices)