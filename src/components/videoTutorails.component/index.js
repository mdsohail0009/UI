import React, { useEffect, useState } from 'react';
import { Table, Alert,Row,Col } from 'antd';
import { Link } from "react-router-dom";
import {getVideoTutorials} from './api';
import apicalls from '../../api/apiCalls';
import Loader from '../../Shared/loader';
const VideoTutorials = () => {
    const [error,setError]=useState(null);
    const [tutorialData, setTutotialsData] = useState([{name:"Open suisseBase Account",value:"https://suissebase.storylane.io/share/w4hd30rkwqdb"},{name:"Manual Fiat Whitelist",value:"https://suissebase.storylane.io/share/sfdljrshshom"},
{name:"Manual Crypto Whitelist",value:"https://suissebase.storylane.io/share/hnozvm5vumbx"},{name:"Open EUR SEPA Personal Account",value:"https://suissebase.storylane.io/share/e9qe9m7z2fwg"},
{name:"Send Fiat",value:"https://suissebase.storylane.io/share/mink44eqbpav"},{name:"Send Crypto",value:"https://suissebase.storylane.io/share/xqooxq1r0rnf"},
{name:"Buy/Sell Crypto",value:"https://suissebase.storylane.io/share/bu5oh2agvwsy"},{name:"Customer ID",value:"https://suissebase.storylane.io/share/wyduztkt8usn"},
{name:"Download SuisseBase Referral Letter",value:"https://suissebase.storylane.io/share/dvjwm0s5unkb"},{name:"Partner Referral System",value:"https://suissebase.storylane.io/share/dnhvkqrlklvs"},
{name:"Upload Documents",value:"https://suissebase.storylane.io/share/1mflfx62bfm4"}]);
    const [loader,setLoader]=useState(false);
    
    useEffect(() => {
        // getVideoTutorialsData();
    }, [])
    const getVideoTutorialsData = async () => {
        setError(null);
        setLoader(true);
        let response = await getVideoTutorials();
        if (response.ok) {
            setLoader(false);
            //setTutotialsData(response.data);
        } else {
            setLoader(false);
            setTutotialsData([]);
            setError(apicalls.isErrorDispaly(response));
        }
    }
    return (
        <>
        {console.log(tutorialData,"tutorialData")}
            

            <div className="main-container">
            
                <div className="backbtn-arrowmb"><Link to="/cockpit"><span className="icon md leftarrow c-pointer backarrow-mr"></span><span className="back-btnarrow c-pointer">Back</span></Link></div>
                <h1 className='grid-title'>Video Tutorials</h1>
                {/* {error && <Alert type="error" showIcon closable={false} description={error} />} */}
                <div className="table-scroll responsive_table">
                    <div className="video-section" >
                        <div><div className="table-header-row">
                            <p className="text-center text-white m-0 p-16" colSpan={6} >Video Tutorials</p>
                        </div></div>
                        
                        <Row className='video-tutorials'>
                        {tutorialData.map((item) => 
                        
                            <Col sm={12} md={8} className='video-block'>
                                <div className="text-white">
                                <label >
                                    <a href={item.value}
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
            </div>
            {loader &&<Loader/>}
          
        </>
    )
}
export default VideoTutorials;