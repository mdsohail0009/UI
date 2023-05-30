import React, { useEffect, useState } from 'react';
import { Alert,Row,Col } from 'antd';
import { Link } from "react-router-dom";
import {getVideoTutorials} from './api';
import apicalls from '../../api/apiCalls';
import Loader from '../../Shared/loader';
const VideoTutorials = () => {
    const [error,setError]=useState(null);
    const [tutorialData, setTutotialsData] = useState([]);
    const [loader,setLoader]=useState(false);
    useEffect(() => {
         getVideoTutorialsData();
    }, [])
    const getVideoTutorialsData = async () => {
        setError(null);
        setLoader(true);
        let response = await getVideoTutorials();
        if (response.ok) {
            setLoader(false);
            setTutotialsData(response.data);
        } else {
            setLoader(false);
            setTutotialsData([]);
            setError(apicalls.isErrorDispaly(response));
        }
    }
    return <>
        
         {loader ?<Loader/>:
                   <div className="main-container">
                   <div className="backbtn-arrowmb"><Link to="/cockpit"><span className="icon md leftarrow c-pointer backarrow-mr"></span><span className="back-btnarrow c-pointer">Back</span></Link></div>
                <h1 className='grid-title'>Video Tutorials</h1>
                {error && <Alert type="error" showIcon closable={false} description={error} />}
                <div className="table-scroll responsive_table">
                    <div className="video-section" >
                        <div><div className="table-header-row">
                            <p className="text-center text-white m-0 p-16" colSpan={6} >Video Tutorials</p>
                        </div></div>
                        <Row className='video-tutorials'>
                        {tutorialData.map((item) => 
                            <Col sm={12} md={8} className='video-block'>
                                <div className="text-white" key={item.id}>
                                <label >
                                    <a href={item.link}
                                        target="_blank">
                                    {item.name}
                                    </a>
                                   <span></span>{" "}
                                </label>
                                </div>
                            </Col>
                            )
                        }
                       </Row>
                    </div>
                </div>
            </div>}
         
        </>
    
}
export default VideoTutorials;