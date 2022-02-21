import React,{ useContext, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import {
  Box, 
  useMediaQuery,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  BottomNavigationAction,
  BottomNavigation,
  Alert
} from '@mui/material';
import VcardPreview from './components/VcardPreview';
import AddNewDialog from './components/AddNewDialog';
import About from './components/About';
import ShowQrCode from './components/ShowQrCode';
import { useTheme } from '@mui/material/styles';
import {
  Share,
  QrCode,
  Add,
  Info,
  ContactPhone,
  QrCode2,
  Logout
} from '@mui/icons-material';
import SwipeableViews from 'react-swipeable-views';
import { ContextProvider } from './context';

function App() {
  let { vcardId } = useParams();
  const { vcardValues, setVcardValues, authdispatch } = useContext(ContextProvider);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [showToast, setShowToast] = React.useState(null);
  const [screen, setScreen] = React.useState(1);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const actions = [
    { icon: <Add />, name: 'Ekle / Güncelle', id: 'add' },
    { icon: <QrCode />, name: 'QR Code İndir', id: 'qrcode' },
    { icon: <Share />, name: 'Paylaş', id: 'share' },
    { icon: <Logout />, name: 'Çıkış Yap', id: 'logout' }
  ];

  const handleAction = (id) => {
    switch (id) {
      case 'add':
        setOpenDialog(true);
      break;

      case 'logout':
        axios.get('/auth/logout')
        .then(({data}) => {
          authdispatch({type: 'LOGOUT'})
        })
        .catch(err => {
          console.log(err)
        })
      break;

      case 'share':
        navigator.clipboard.writeText(process.env.REACT_APP_URL+'/'+vcardValues?._id)
        setShowToast('URL Kopyalandı !')
        setTimeout(() => {
          setShowToast(null)
        }, 3000);
      break;

      case 'qrcode':
        var qrImageUrl = `https://chart.googleapis.com/chart?chs=414x414&cht=qr&chl=${process.env.REACT_APP_URL+'/'+vcardValues?._id}&choe=UTF-8`;
         fetch(qrImageUrl).then((response) => {
              return response.blob();
          }).then(blob => {
              const objUrl = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = objUrl;
              a.download = "QrCode-Vcard.png";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
          });
      break;
    
      default:
        return null;
    }
  }

  const swipableStyles = {
    item: {
      padding: 0,
      height: 'calc(100vh - 56px)',
      overflow: 'auto'
    },
    container: {
      px: matches ? '1.6rem' : '.5rem',
      py: '.6rem'
    }
  }

  const handleScreenChange = (event, index) => {
    setScreen(index);
  }

  const showVcard = () => {
    axios.get('/vcard/show/card',{params:{vcardId: vcardId}}).then(({data}) => {
      setVcardValues({
        ...data,
        logoImg: process.env.REACT_APP_URL+'/uploads/'+data.logoImg,
        profilePicture: process.env.REACT_APP_URL+'/uploads/'+data.profilePicture
      })
    }).catch((err) => {
        console.log(err)
    })
  }

  useEffect(() => {
    if(vcardId) showVcard();
  }, [])

  return (
    <>
    <Box sx={{
      width:'100%',
      maxWidth:`calc(768px + ${matches ? (1.6 * 2)+'rem' : (0.5 * 2)+'rem'})`,
      height: '100vh',
      backgroundColor: 'customColors.main',
      px: 0,
      py: 0,
      position: 'relative',
      overflow:'auto'
    }}>

      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={screen}
      >
        <Box sx={swipableStyles.item} index={0} dir={theme.direction}>
          <About />
        </Box>
        <Box sx={swipableStyles.item} index={1} dir={theme.direction}>
          <Box sx={swipableStyles.container}>
            <VcardPreview />
          </Box>
        </Box>
        <Box sx={swipableStyles.item} index={2} dir={theme.direction}>
          <ShowQrCode />
        </Box>
      </SwipeableViews>

      <BottomNavigation
        showLabels
        value={screen}
        onChange={handleScreenChange}
      >
        <BottomNavigationAction label="Hakkımda" icon={<Info />} />
        <BottomNavigationAction label="Kartvizit" icon={<ContactPhone />} />
        <BottomNavigationAction label="QR Code" icon={<QrCode2 />} />
      </BottomNavigation>

    </Box>
    {!vcardId && (
      <>
      {/* Floating Action Button */}
      <Box sx={{
        width:'100%',
        height:0,
        position:'fixed',
        bottom:0,
        left:0,
        right:0,
        display:'flex',
        justifyContent: 'center',
        alignItems:'center'
      }}>
        <Box sx={{
          width:'100%',
          height:'auto',
          maxWidth:'1024px',
          position:'relative'
        }}>
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: !matches ? 66 : 16, right: 16 }}
            icon={<SpeedDialIcon />}
          >
            {actions.map((action) => (
              <SpeedDialAction
                sx={{ boxShadow:'0px 0px 13px -8px rgba(255,255,255,0.75)'  }}
                key={action.name}
                icon={action.icon}
                onClick={() => handleAction(action.id)}
                tooltipTitle={action.name}
              />
            ))}
          </SpeedDial>
        </Box>
      </Box>
      
      {/* Floating Action Button */}
      <AddNewDialog handleDialog={{ openDialog, setOpenDialog }} />

      {/* Toast Alert */}
      {showToast && (
        <Alert 
        severity="success" 
        color="success" 
        sx={{
          position: 'fixed',
          bottom:10,
          textAlign:'center',
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          left:0,
          right:0,
          margin:'auto',
          maxWidth:'300px'
        }}>
          {showToast}
        </Alert>
      )}
      </>
    )}
    
    </>
  );
}

export default App;
