import React,{ useContext, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { IMaskInput } from 'react-imask';
import {
    Box,  
    Slide,
    AppBar,
    Toolbar,
    IconButton,
    Typography ,
    Dialog,
    Button,
    Grid,
    TextField,
    InputLabel,
    MenuItem,
    FormControl,
    Select ,
    useMediaQuery
  } from '@mui/material';
import { Close, PhotoCamera, Add } from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import { ContextProvider } from '../context';
import { getBase64, SocialMediaOptions } from '../helper';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const InputImg = styled('input')({
    display: 'none',
});

export default function AddNewDialog({ handleDialog }) {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('lg'));
    const { vcardValues, setVcardValues, socialMediaGrids } = useContext(ContextProvider)

    const { socialGrids, setSocialGrids } = socialMediaGrids;
    
    const { openDialog, setOpenDialog } = handleDialog;
    const [inputbg, setInputbg] = useState({
      logoImg: null,
      profilePicture: null
    })
    
    const ButtonLogoSelect = {
        width: '327px',
        height: '60px',
        backgroundImage: `url('${inputbg.logoImg}')`,
        backgroundColor:'grey.700',
        borderRadius: '3px',
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundOrigin: 'content-box'
    }

    const ButtonPpSelect = {
        width: '300px',
        height: '300px',
        backgroundImage: `url('${inputbg.profilePicture}')`,
        backgroundColor:'grey.700',
        borderRadius: '50%',
        border: '7px solid #00091a',
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    }

    const handleImg = (e,key) => {
        let file = e.currentTarget.files[0];
        getBase64(file,(res) => {
            setInputbg({
              ...inputbg,
              [key]: res
            })
            setVcardValues({
                ...vcardValues,
                [key]: res
            })
        })
    }

    const handleChange = (e) => {
      setVcardValues({
        ...vcardValues,
        [e.currentTarget.name]: e.currentTarget.value
      });
    }

    const handleSave = async () => {
      const form = document.getElementById("vcardForm");
      const formData = new FormData(form);
      try {
        const logoFile = document.getElementById("addLogoInput").files[0];
        const ppFile = document.getElementById("AddPP").files[0];
        formData.append("logoImg",logoFile)
        formData.append("profilePicture",ppFile)
        setInputbg({
          logoImg: null,
          profilePicture: null
        });
        const {statusText} = await axios({
          method: "post",
          url: "/vcard/create",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        if(statusText === "OK"){
          setOpenDialog(false);
          form.reset()
        }
      } catch (err) {
        console.log(err);
      }
    }

    const PhoneMaskCustom = React.forwardRef(function PhoneMaskCustom(props, ref) {
      const { onChange, ...other } = props;
      return (
        <IMaskInput
          {...other}
          mask="+00(000) 000 00 00"
          placeholder="+90(000) 000 00 00"
          definitions={{
            '#': /[1-9]/,
          }}
          inputRef={ref}
          onAccept={(value) => onChange({ currentTarget: { name: props.name, value } })}
          overwrite
        />
      );
    });
    
    PhoneMaskCustom.propTypes = {
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
    };

    return (
        <Dialog
        fullScreen
        sx={{
            maxWidth:'calc(768px + 3.2rem)',
            mx:'auto'
        }}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Transition}
      >
        <AppBar color='secondary' enableColorOnDark position='sticky'>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpenDialog(false)}
              aria-label="close"
            >
              <Close />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Yeni Ekle
            </Typography>
            <Button autoFocus onClick={handleSave}>
              Kaydet
            </Button>
          </Toolbar>
        </AppBar>
        <Box 
        height="100%" 
        id='vcardForm'
        encType="multipart/form-data"
        component="form">
          <Grid container>
                <Grid item xs={12} p={2} display="flex" justifyContent="center" alignItems="center">
                    <label htmlFor="addLogoInput">
                        <InputImg accept="image/*" id="addLogoInput" type="file" onChange={e => handleImg(e,'logoImg')} />
                        <IconButton color="primary" aria-label="upload picture" component="span" sx={ButtonLogoSelect}>
                            <PhotoCamera />
                        </IconButton>
                    </label>
                </Grid>

                <Grid item xs={12} p={2} display="flex" justifyContent="center" alignItems="center">
                    <label htmlFor="AddPP">
                        <InputImg accept="image/*" id="AddPP" type="file" onChange={e => handleImg(e,'profilePicture')} />
                        <IconButton color="primary" aria-label="upload picture" component="span" sx={ButtonPpSelect}>
                            <PhotoCamera />
                        </IconButton>
                    </label>
                </Grid>

                <Grid item xs={12} p={2}>
                  <TextField 
                  fullWidth
                  label="Adı Soyadı"
                  color="secondary"
                  name="name"
                  value={ vcardValues.name }
                  onChange={handleChange}
                  variant="outlined" />
                </Grid>

                <Grid item xs={12} p={2}>
                  <TextField 
                  fullWidth
                  label="Ünvan"
                  color="secondary"
                  name="title"
                  value={vcardValues.title}
                  onChange={handleChange}
                  variant="outlined" />
                </Grid>

                <Grid item xs={12} p={2}>
                  <TextField 
                  fullWidth
                  label="GSM No"
                  color="secondary"
                  name="phoneNumber"
                  value={vcardValues.phoneNumber}
                  onBlur={handleChange}
                  InputProps={{inputComponent: PhoneMaskCustom}}
                  variant="outlined" />
                </Grid>

                <Grid item xs={12} p={2}>

                  <TextField 
                  fullWidth
                  label="Email Adresi"
                  type="email"
                  color="secondary"
                  name="email"
                  value={vcardValues.email}
                  onChange={handleChange}
                  variant="outlined" />

                </Grid>

                <Grid item xs={12} p={2}>
                  
                  <Grid container>
                    <Grid item lg={5} xs={12} mb={matchesXs ? 1 : 0}>
                    <TextField 
                    fullWidth
                    name="address[mapUrl]"
                    label="Map Url"
                    color="primary"
                    value={vcardValues.address.mapUrl}
                    onChange={e => setVcardValues({...vcardValues, address: { ...vcardValues.address, mapUrl: e.currentTarget.value }})}
                    variant="outlined" />
                    </Grid>

                    <Grid item lg={7} pl={matchesXs ? 0 : 1} xs={12}>
                    <TextField 
                    fullWidth
                    multiline
                    name="address[addressText]"
                    label="Adres"
                    color="primary"
                    value={vcardValues.address.addressText}
                    onChange={e => setVcardValues({...vcardValues, address: { ...vcardValues.address, addressText: e.currentTarget.value }})}
                    variant="outlined" />
                    </Grid>
                  </Grid>

                </Grid>

                <Grid item xs={12} pt={2} px={2}>
                  <Grid container>
                    <Grid item md={11} xs={10}>
                        
                    {
                      Array.from(Array(socialGrids.amount), (e,i) => {
                        return <Grid container key={i} mb={2}>
                        <Grid item md={3} xs={12} mb={matchesXs ? 0.5 : 0}>
                          <FormControl fullWidth sx={{ height:'100%' }}>
                            <InputLabel id={`simple-select-label-${i}`}>Sosyal Medya</InputLabel>
                            <Select
                              labelId={`simple-select-label-${i}`}
                              name={`socials[${i}][socialMedia]`}
                              value={socialGrids.socials[i] ? socialGrids.socials[i] : ''}
                              color='secondary'
                              label="Sosyal Medya"
                            >
                              {
                                SocialMediaOptions.map((val,k) => {
                                  return <MenuItem 
                                  onClick={(e) => setSocialGrids({
                                    ...socialGrids,
                                    socials: {
                                      ...socialGrids.socials,
                                      [i] : val.id
                                    }
                                  })}
                                  value={val.id} 
                                  key={k}>
                                    <Box component="div" display="flex" justifyContent="flex-start" alignItems="center">
                                      <val.icon />{val.name}
                                    </Box>
                                  </MenuItem>
                                })
                              }
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item md={9} pl={matchesXs ? 0 : 1} xs={12}>
                          <TextField 
                          fullWidth
                          disabled={socialGrids.socials[i] ? false : true}
                          label="Social Media Username"
                          name={`socials[${i}][username]`}
                          placeholder='/username'
                          color="secondary"
                          defaultValue={vcardValues?.socials[i]?.username}
                          onChange={(e) => setVcardValues({
                            ...vcardValues,
                            socials: {
                              ...vcardValues.socials,
                              [i] : {"socialMedia" : socialGrids.socials[i] , "username" : e.currentTarget.value}
                            }
                          })}
                          variant="outlined" />
                        </Grid>
                      </Grid>
                      })
                    }

                    </Grid>
                    <Grid 
                    item 
                    md={1} 
                    xs={2} 
                    position="relative" 
                    display="flex"
                    justifyContent="flex-start"
                    alignItems={matchesXs ? "flex-end" : "flex-start"}
                    mb={matchesXs ? 2 : 0}
                    >
                      <Button 
                      variant='contained' 
                      color='secondary' 
                      onClick={() => setSocialGrids({...socialGrids, amount: socialGrids.amount + 1})}
                      sx={{
                        px:0,
                        height:'100%',
                        maxHeight: 56,
                        borderTopLeftRadius: '2px',
                        borderBottomLeftRadius: '2px',
                      }}>
                        <Add />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} p={2}>
                  <TextField 
                  fullWidth
                  label="Web Sitesi"
                  placeholder='www.website.com'
                  color="primary"
                  name="webSite"
                  value={vcardValues.webSite}
                  onChange={handleChange}
                  variant="outlined" />

                </Grid>
          </Grid>
        </Box>
      </Dialog>
    )
}
