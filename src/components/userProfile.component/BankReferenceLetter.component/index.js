import React, { useEffect } from 'react';
import { Row } from 'antd';
const BankDeclarationForm = () => {
    useEffect(() => {

    }, []);

    return (
        <div>
            <div className="basicprofile-info">
                <Row className="order-bottom add-custom">
                    <a
                        className="btn lightbox-231763449585064"
                        style={{
                            marginTop: '16px',
                            textTransform: 'uppercase',
                            fontSize: '14px',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            display: 'inline-block',
                            padding: '10px',
                            fontFamily: 'inherit',
                            textShadow: 'none',
                            userSelect: 'none',
                            transition: 'all .1s ease-in',
                            backgroundColor: '#FFA500',
                            border: '1px solid #FFA500',
                            color: '#FFFFFF',
                        }}
                    >
                        Bank Reference Letter
                    </a>
                </Row></div>
        </div>
    );
};

export default BankDeclarationForm;
