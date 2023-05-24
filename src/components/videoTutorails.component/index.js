import React, { useEffect, useState } from 'react';
import { Table, Alert } from 'antd';
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
            <h1> this is a video tutorials</h1>

            <div className="main-container">

                <div className="backbtn-arrowmb"><Link to="/cockpit"><span className="icon md leftarrow c-pointer backarrow-mr"></span><span className="back-btnarrow c-pointer">Back</span></Link></div>

                {/* {error && <Alert type="error" showIcon closable={false} description={error} />} */}
                <div className="table-scroll responsive_table">
                    <table className="commision-table table-border edit-commition-table view-commition-table" border="1">
                        <thead><tr className="table-header-row">
                            <th className="text-center" colSpan={6} >Video Tutorials</th>
                        </tr></thead>
                        
                        <tbody>
                        {tutorialData.map((item) => 
                        
                            <tr >
                                <td className="text-center text-white">
                                <label >
                                    <a href={item.value}
                                        target="_blank">
                                    {item.name}
                                    </a>
                                    
                                    <span></span>{" "}
                                </label>
                                </td>
                            </tr>
                            
                        )
                        }
                            {/* <tr>
                                <td><Link to="https://suissebase.storylane.io/share/w4hd30rkwqdb">Open suisseBase Account</Link></td>
                                <td><Link to="https://suissebase.storylane.io/share/sfdljrshshom">Manual Fiat Whitelist</Link></td>
                                <td><Link to="https://suissebase.storylane.io/share/hnozvm5vumbx">Manual Crypto Whitelist</Link></td>
                               
                            </tr>
                            <tr>
                                <td><Link to=" https://suissebase.storylane.io/share/e9qe9m7z2fwg">Open EUR SEPA Personal Account</Link></td>
                                <td><Link to=" https://suissebase.storylane.io/share/mink44eqbpav">Send Fiat</Link></td>
                                <td><Link to=" https://suissebase.storylane.io/share/xqooxq1r0rnf">Send Crypto</Link></td>
                               
                            </tr>
                            <tr>
                                <td><Link to=" https://suissebase.storylane.io/share/bu5oh2agvwsy">Buy/Sell Crypto</Link></td>
                                <td><Link to="https://suissebase.storylane.io/share/wyduztkt8usn">Customer ID</Link></td>
                                <td><Link to="https://suissebase.storylane.io/share/dvjwm0s5unkb">Download SuisseBase Referral Letter</Link></td>
                               
                            </tr>
                            <tr>
                                <td><Link to="https://suissebase.storylane.io/share/dnhvkqrlklvs">Partner Referral System</Link></td>
                                <td><Link to=" https://suissebase.storylane.io/share/1mflfx62bfm4">Upload Documents</Link></td>
                                <td></td>
                               
                            </tr> */}
                        </tbody>
                        
                    </table>
                </div>
            </div>
            {loader &&<Loader/>}
            <Table className="video_tutorials">
                <tbody>
                    {/* <tr>
                        {tutorialData.map((item) => 
                            <td className="text-center text-white">
                               <Link></Link>
                                <label >
                                     {item.name}
                                    <span></span>{" "}
                                </label>
                            </td>
                        )
                        }
                      

                    </tr> */}
                </tbody>
            </Table>
        </>
    )
}
export default VideoTutorials;