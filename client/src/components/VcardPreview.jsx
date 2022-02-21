import { useContext } from 'react';
import { styled } from '@mui/system';
import {
    Skeleton,
    Box,
    Grid,
    Button,
    useMediaQuery,
    Avatar,
    Typography,
    Divider
} from '@mui/material';
import ContactsIcon from '@mui/icons-material/Contacts';
import { useTheme } from '@mui/material/styles';
import { ContextProvider } from '../context';
import { findInSocials } from '../helper';

export default function VcardPreview() {
    const { vcardValues } = useContext(ContextProvider)
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    const Vcard = styled('div')({
        width: '100%',
        marginTop: '50px',
        marginBottom: '50px',
        borderRadius: '30px',
        padding: matches ? '0 1px 80px 1px' : '0 0 80px 0'
    });
    
    const saveVcard = () => {
        window.location.href = process.env.REACT_APP_API_URL+'/vcard/download/'+vcardValues._id;
    }

    return (
        <Vcard sx={{ backgroundColor: 'customColors.color1', pt: 3 }}>
            {
                vcardValues.logoImg ? 
                (
                    <Box 
                    component="div" 
                    mx="auto" 
                    width="100" 
                    maxWidth="320px" 
                    display="flex"
                    justifyContent="center" 
                    alignItems="center">
                        <img src={vcardValues.logoImg} alt="" style={{ maxWidth: '100%' }} />
                    </Box>
                )
                :
                (
                    <Skeleton 
                    height={95} 
                    sx={{ 
                        width:'100%', 
                        maxWidth: '320px',
                        mx: 'auto'
                    }} />
                )
            }
            
            {
                vcardValues.profilePicture ?
                (
                    <Avatar 
                    alt={vcardValues?.name}
                    src={vcardValues.profilePicture}
                    sx={{
                        width:314,
                        height:314,
                        mt:'23px',
                        mx:'auto',
                        border: '7px solid #00091a'
                    }}
                    />
                )
                :
                (
                    <Skeleton 
                    variant="circular" 
                    width={314} 
                    height={314}
                    sx={{
                        mt:'23px',
                        mx:'auto',
                        border: '7px solid #00091a'
                    }} />
                )
            }
                <Divider sx={{ border:0, my:1.2 }} />
            {
                vcardValues.name ?
                (
                    <Typography 
                    variant='h1' 
                    component="h1" 
                    fontSize={20}
                    fontWeight={300}
                    color={"#e8eaec"} 
                    align='center'>
                        {
                            vcardValues.name.split(' ').map((i,k) => {
                                if(vcardValues.name.split(' ').length === (k + 1)){
                                    return <strong style={{ fontWeight:500 }} key={k}>{i}</strong>
                                }else{
                                    return i+" "
                                }
                            })
                        }
                    </Typography>
                )
                :
                (
                    <Skeleton variant="text" width={118} height={40} sx={{ mx:'auto' }} />
                )
            }

                <Divider sx={{ border:0, my:0.5 }} />

            {
                vcardValues.title ? 
                (
                    <Typography 
                    variant='h4' 
                    component="h2" 
                    fontSize={17}
                    fontWeight={300}
                    color={"#e8eaec"} 
                    align='center'>
                       {vcardValues.title}
                    </Typography>
                )
                :
                (
                    <Skeleton variant="text" width={60} height={35} sx={{ mx:'auto' }} />
                )
            }

            <Divider sx={{ border:0, my:1.5 }} />

            <Box sx={{
                backgroundColor: '#ffffff',
                borderTopLeftRadius: '30px',
                borderTopRightRadius: '30px',
                padding: '32px 32px 0 32px',
            }}>
                <Grid container>

                    <Grid item xs={12} sx={{ borderBottom: '1px solid #d3d3d3', mb:'35px' }}>

                        {
                            vcardValues.phoneNumber ? 
                            (
                                <>
                                <Typography
                                variant='h4' 
                                component="h2" 
                                fontSize={17}
                                lineHeight={1.4}
                                fontWeight={300}
                                color={"#b0b0b0"} 
                                align='left'
                                >
                                    GSM No
                                </Typography>
                                <Typography
                                variant='h4' 
                                component="a" 
                                href={`tel:${vcardValues.phoneNumber}`}
                                fontSize={17}
                                lineHeight={2}
                                fontWeight={500}
                                color={"#0c1b32"} 
                                align='left'
                                sx={{
                                    textDecoration: 'none'
                                }}
                                >
                                    {vcardValues.phoneNumber}
                                </Typography>
                                </>
                            )
                            :
                            (
                                <>
                                <Skeleton 
                                    variant="text" 
                                    animation="wave"
                                    width={120}
                                    height={33}
                                    sx={{
                                        mr:'auto',
                                        bgcolor: 'grey.800'
                                    }}
                                />
                                <Skeleton 
                                    variant="text"
                                    animation="wave"
                                    height={33}
                                    sx={{
                                        mr:'auto',
                                        bgcolor: 'grey.900'
                                    }}
                                />
                                </>
                            )
                        }

                    </Grid>

                    <Grid item xs={12} sx={{ borderBottom: '1px solid #d3d3d3', mb:'35px' }}>
                        {
                            vcardValues.email ? 
                            (
                                <>
                                <Typography
                                variant='h4' 
                                component="h2" 
                                fontSize={17}
                                lineHeight={1.4}
                                fontWeight={300}
                                color={"#b0b0b0"} 
                                align='left'
                                >
                                    Email Adresi
                                </Typography>
                                <Typography
                                variant='h4' 
                                component="a" 
                                href={`mailto:${vcardValues.email}`}
                                fontSize={17}
                                lineHeight={2}
                                fontWeight={500}
                                color={"#0c1b32"} 
                                align='left'
                                sx={{
                                    textDecoration: 'none'
                                }}
                                >
                                    {vcardValues.email}
                                </Typography>
                                </>
                            )
                            :
                            (
                                <>
                                <Skeleton 
                                    variant="text" 
                                    animation="wave"
                                    width={120}
                                    height={33}
                                    sx={{
                                        mr:'auto',
                                        bgcolor: 'grey.800'
                                    }}
                                />
                                <Skeleton 
                                    variant="text"
                                    animation="wave"
                                    height={33}
                                    sx={{
                                        mr:'auto',
                                        bgcolor: 'grey.900'
                                    }}
                                />
                                </>
                            )
                        }
                    </Grid>

                    <Grid item xs={12} sx={{ borderBottom: '1px solid #d3d3d3', mb:'35px' }}>
                        {
                            vcardValues.address.addressText ? 
                            (
                                <>
                                <Typography
                                variant='h4' 
                                component="h2" 
                                fontSize={17}
                                lineHeight={1.4}
                                fontWeight={300}
                                color={"#b0b0b0"} 
                                align='left'
                                >
                                    Adres
                                </Typography>
                                <Typography
                                variant='h4' 
                                component="a" 
                                href={vcardValues.address.mapUrl}
                                target="_blank"
                                fontSize={17}
                                lineHeight={2}
                                fontWeight={500}
                                color={"#0c1b32"} 
                                align='left'
                                sx={{
                                    textDecoration: 'none'
                                }}
                                >
                                    {vcardValues.address.addressText}
                                </Typography>
                                </>
                            )
                            :
                            (
                            <>
                                <Skeleton 
                                variant="text" 
                                animation="wave"
                                width={120}
                                height={33}
                                sx={{
                                    mr:'auto',
                                    bgcolor: 'grey.800'
                                }}
                                />
                                <Skeleton 
                                variant="text"
                                animation="wave"
                                height={33}
                                sx={{
                                    mr:'auto',
                                    bgcolor: 'grey.900'
                                }}
                                />
                            </>
                            )
                        }
                    </Grid>

                    {
                        Object.keys(vcardValues.socials).length > 0 ? 
                        (
                            Object.keys(vcardValues.socials).map((i,k) => {

                                return <Grid item xs={12} sx={{ borderBottom: '1px solid #d3d3d3', mb:'35px' }} key={k}>
                        
                                <Typography
                                variant='h4' 
                                component="h2" 
                                fontSize={17}
                                lineHeight={1.4}
                                fontWeight={300}
                                color={"#b0b0b0"} 
                                align='left'
                                >
                                    { findInSocials(vcardValues.socials[i].socialMedia).name }
                                </Typography>
                                <Box component="div" display="flex" justifyContent="flex-start" alignItems="center">
                                <Typography color="#0c1b32" display="flex" alignItems="flex-end">
                                    {
                                        (() => {
                                            let Icon = findInSocials(vcardValues.socials[i].socialMedia).icon;
                                            return <Icon sx={{ width: '30px', height: '30px' }} />
                                        })()
                                    }
                                </Typography>
                                
                                <Typography
                                variant='h4' 
                                display="flex"
                                alignItems="flex-end"
                                component="a" 
                                href={findInSocials(vcardValues.socials[i].socialMedia).urlPrefix+vcardValues.socials[i].username}
                                target="_blank"
                                fontSize={17}
                                lineHeight={1.4}
                                fontWeight={500}
                                color={"#0c1b32"} 
                                align='left'
                                sx={{
                                    textDecoration: 'none'
                                }}
                                >
                                    {vcardValues.socials[i].username}
                                </Typography>
                                </Box>
                                
                            </Grid>
                            })
                        )
                        :
                        (
                            <Grid item xs={12} sx={{ borderBottom: '1px solid #d3d3d3', mb:'35px' }}>
                        
                                <Skeleton 
                                    variant="text" 
                                    animation="wave"
                                    width={120}
                                    height={33}
                                    sx={{
                                        mr:'auto',
                                        bgcolor: 'grey.800'
                                    }}
                                />
                                <Skeleton 
                                    variant="text"
                                    animation="wave"
                                    height={33}
                                    sx={{
                                        mr:'auto',
                                        bgcolor: 'grey.900'
                                    }}
                                />
                                
                            </Grid>
                        )
                    }

                    <Grid item xs={12} sx={{ borderBottom: '1px solid #d3d3d3', mb:'35px' }}>

                        {
                            vcardValues.webSite ? 
                            (
                                <>
                                <Typography
                                variant='h4' 
                                component="h2" 
                                fontSize={17}
                                lineHeight={1.4}
                                fontWeight={300}
                                color={"#b0b0b0"} 
                                align='left'
                                >
                                    Web Sitesi
                                </Typography>
                                <Typography
                                variant='h4' 
                                component="a" 
                                href={`https://${vcardValues.webSite}`}
                                target="_blank"
                                fontSize={17}
                                lineHeight={2}
                                fontWeight={500}
                                color={"#0c1b32"} 
                                align='left'
                                sx={{
                                    textDecoration: 'none'
                                }}
                                >
                                    {vcardValues.webSite}
                                </Typography>
                                </>
                            )
                            :
                            (
                                <>
                                <Skeleton 
                                    variant="text" 
                                    animation="wave"
                                    width={120}
                                    height={33}
                                    sx={{
                                        mr:'auto',
                                        bgcolor: 'grey.800'
                                    }}
                                />
                                <Skeleton 
                                    variant="text"
                                    animation="wave"
                                    height={33}
                                    sx={{
                                        mr:'auto',
                                        bgcolor: 'grey.900'
                                    }}
                                />
                                </>
                            )
                        }
                        
                    </Grid>
                    <Grid 
                    item 
                    xs={12} 
                    sx={{
                        position:'sticky',
                        bottom:'40px'
                    }}
                    justifyContent="center" 
                    display="flex">
                        <Button 
                        sx={{
                            width: '100%',
                            maxWidth: '80%',
                            mb:'-30px',
                            mx:'auto',
                            fontSize: '22px',
                            fontWeight: 400,
                            borderRadius: '20px',
                            border: 'solid 1px #000',
                            padding: '10px 1rem'
                        }}
                        onClick={saveVcard}
                        color="primary"
                        variant="contained" startIcon={<ContactsIcon sx={{ width: '1.5em', height: '1.5em' }} />}>
                            REHBERE KAYDET
                        </Button>
                    </Grid>
                </Grid>
                
            </Box>
        </Vcard>
    )
}
