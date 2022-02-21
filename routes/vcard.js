import { Router } from "express";
import { body,check } from "express-validator";
import Vcard from "../models/Vcard.js";
import vCardsJS from 'vcards-js';
import jwt from 'jsonwebtoken';
import multer from "multer";
import { validateRequest } from '../helper/index.js'
import path, { dirname } from 'path';

const router = Router();

//upload single file
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
  },
})
const upload = multer({storage: storage});


/* POST register user. */
const sanitizeVcard = [
  body('name')
  .notEmpty(),
  body('title')
  .notEmpty(),
  body('phoneNumber')
  .notEmpty(),
  body('address')
  .isObject(),
  body('address.mapUrl')
  .notEmpty(),
  body('address.addressText')
  .notEmpty(),
  body('email')
  .notEmpty(),
  body('socials')
  .isArray(),
  body('webSite')
  .notEmpty()
]

const cpUpload = upload.fields([{ name: 'logoImg', maxCount: 1 }, { name: 'profilePicture', maxCount: 1 }])
router.post('/create' ,cpUpload , sanitizeVcard, async (req, res, next) => {
  const vcardReq = req.body;

  try {
    const access_token = req.signedCookies.access_token;
    const decodedUser = jwt.verify(access_token, process.env.JWT_SECRET);
    const { logoImg, profilePicture } = req.files;
    
    validateRequest(req,res);
    const findVcard = await Vcard.findOne({ userId: decodedUser.id });
    if(findVcard){
      await Vcard.findOneAndUpdate({id: findVcard.id}, {
        ...vcardReq,
        logoImg: logoImg ? logoImg[0].filename : findVcard.logoImg, 
        profilePicture: profilePicture ? profilePicture[0].filename : findVcard.profilePicture, 
      });
    }else{
      if(logoImg === undefined) return res.status(500).json({error: 'Logo Required!'});
      if(profilePicture === undefined) return res.status(500).json({error: 'Profile Picture Required!'});
      const vcard = new Vcard({
        ...vcardReq, 
        logoImg: logoImg[0].filename, 
        profilePicture: profilePicture[0].filename, 
        userId: decodedUser.id
      });
      await vcard.save();
    }
    return res.status(200).json({success: 'Başarılı'});
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.get('/show/mycard' , async (req, res, next) => {
  try {
    const access_token = req.signedCookies.access_token;
    const decodedUser = jwt.verify(access_token, process.env.JWT_SECRET);
    
    const myCard = await Vcard.findOne({ userId: decodedUser.id });

    return res.status(200).json(myCard);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});


router.get('/show/card',check('vcardId').notEmpty() ,async (req, res) => {
  const { vcardId } = req.query;
  try {
    validateRequest(req,res);
    const card = await Vcard.findById(vcardId);
    return res.status(200).json(card);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong!'});
  }
});

router.post('/save-about' , async (req, res, next) => {
  const { about } = req.body;
  try {
    const access_token = req.signedCookies.access_token;
    const decodedUser = jwt.verify(access_token, process.env.JWT_SECRET);
    
    const myCard = await Vcard.findOneAndUpdate({email: decodedUser.email},{ about });

    return res.status(200).json(myCard);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.get('/download/:cardId' , async (req, res, next) => {
  const { cardId } = req.params;
  try {
    if(cardId){
      var vCard = vCardsJS();
      const card = await Vcard.findById(cardId);
      if(!card) throw new Error("Card Required");

      const fullName = card.name.split(" ");
      const lastname = fullName.pop();
      const name = fullName.join(" ");
      const socialmedia = {
        "linkedin" : "https://www.linkedin.com/in",
        "instagram" : "https://www.instagram.com",
        "facebook" : "https://www.facebook.com"
      }
      //set properties
      vCard.firstName = name;
      vCard.lastName = lastname;
      //vCard.organization = 'ACME Corporation';
      vCard.photo.embedFromFile(path.resolve('public/uploads', card.profilePicture));
      vCard.title = card.title;
      vCard.url = card.website;
      vCard.workUrl = card.website;
      vCard.cellPhone = card.phoneNumber;
      vCard.email = card.email;

      //social medias
      card.socials.forEach(element => {
        vCard.socialUrls[element.socialMedia] = socialmedia[element.socialMedia]+""+element.username;
      });

      vCard.workAddress.label = 'Adres';
      vCard.workAddress.street = card.address.addressText;

      //set content-type and disposition including desired filename
      res.set('Content-Type', 'text/vcard; name="vcard.vcf"');
      res.set('Content-Disposition', 'inline; filename="vcard.vcf"');
      
      res.send(vCard.getFormattedString());
    }else{
      return res.status(500).json({error: 'Card id required!'});
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

export default router;
