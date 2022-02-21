import { useContext } from 'react';
import { ContextProvider } from '../context';
import { Box, styled } from "@mui/system";

export default function ShowQrCode() {
    const { vcardValues } = useContext(ContextProvider)

    const QrCodeImage = styled('img')({
        margin: '10px',
        width:'auto',
        maxWidth: '100%',
        height: 'auto'
    })
    return (
        <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%">
            <QrCodeImage 
            src={`https://chart.googleapis.com/chart?chs=414x414&cht=qr&chl=${process.env.REACT_APP_URL+'/'+vcardValues?._id}&choe=UTF-8`} 
            alt="QR Code" />
        </Box>
    )
}