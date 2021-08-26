
import QRCode  from 'qrcode.react';

const QRCodeComponent = ({ value, bgColor, fgColor, size = 128 }) => {


    return <QRCode value={value} size={size} bgColor={bgColor} fgColor = {fgColor} />
}

export default QRCodeComponent