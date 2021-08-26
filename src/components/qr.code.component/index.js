
import QRCode  from 'qrcode.react';

const QRCodeComponent = ({ value="abc", bgColor, fgColor, size = 250 }) => {


    return <QRCode value={value} size={size} bgColor={bgColor} fgColor = {fgColor} />
}

export default QRCodeComponent