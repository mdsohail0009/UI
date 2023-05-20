import React, { useEffect, useState } from 'react';
import { Table, Alert } from 'antd';
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
    return (
        <>
        {console.log(tutorialData,"tutorialData")}
            <h1> this is a video tutorials</h1>

            <div className="main-container">

                <div className="backbtn-arrowmb"><Link to="/cockpit"><span className="icon md leftarrow c-pointer backarrow-mr"></span><span className="back-btnarrow c-pointer">Back</span></Link></div>

                {error && <Alert type="error" showIcon closable={false} description={error} />}
                <div className="table-scroll responsive_table">
                    <table className="commision-table table-border edit-commition-table view-commition-table" border="1">
                        <thead><tr className="table-header-row">
                            <th className="text-center" colSpan={6} >Video Tutorials</th>
                        </tr></thead>
                    </table>
                </div>
            </div>
            {loader &&<Loader/>}
            <Table className="video_tutorials">
                <tbody>
                    <tr>
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
                      

                    </tr>
                </tbody>
            </Table>
        </>
    )
}
export default VideoTutorials;