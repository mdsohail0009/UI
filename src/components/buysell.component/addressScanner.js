import React, { Component } from 'react';

class addressScanner extends Component {
    state = {}
    render() {
        return (
            <div>
                <div className="scanner-img">
                    <img src={sacnner} />
                </div>
                <div className="crypto-address">
                    <div className="mb-0 fw-400 text-secondary">Address</div>
                    <div className="mb-0 fs-14 fw-500 text-textDark">TAQgcJD9p29m77EnXweijpHegPUSnxkdQW</div>
                </div>
                <Paragraph className="text-center f-12 text-white">Please make sure your delivery address is correct.</Paragraph>
                <Button size="large" block className="pop-btn" style={{ marginTop: '100px' }}>COPY</Button>
                <Button type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block>Share</Button>
            </div>
        )
    }
}

export default addressScanner;