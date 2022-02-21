import { LinkedIn, Instagram, Facebook } from '@mui/icons-material';

export function getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

export const SocialMediaOptions = [
    { name: 'Linkedin', icon: LinkedIn, urlPrefix: 'https://www.linkedin.com/in', id: 'linkedin' },
    { name: 'Instagram', icon: Instagram, urlPrefix: 'https://www.instagram.com', id: 'instagram' },
    { name: 'Facebook', icon: Facebook, urlPrefix: 'https://www.facebook.com', id: 'facebook' }
]

export const findInSocials = (i) => {
    let obj = SocialMediaOptions.find((item, index) => {
        if(item.id === i) return true

        return false
    })
    return obj;
}

export const loginPhotos = [
    'X0coaIM5FBs',
    'AXkRhn-vyeA', 
    'I1rVxQ-2wTI', 
    'O7CIc6fmsoE', 
    'D_4R9CcYZOk', 
    'TGYQVFiYpWw', 
    'cxQUMyt_Hmc', 
    '8u3rwoDfL4M', 
    'DDBO05yBbuk', 
    'A5E-ym6WyGM',
    'oS97v02HN2I',
    'mI61X5I-jKQ',
    '38bbv0ppF2o',
    '2r2RUsEU1Aw',
    'gLd3LSTvTAM',
    'Af3GEg0DMEw',
    '0H87aXUE8bE',
    'Lq2051y3dBo',
    'gg2xaft_7UU',
    '1ndTNM7XO9w',
    'sqvF_3o40Gg',
    '0KRcR8Nydk4',
    'RSgWh0jmGbo'
    ];