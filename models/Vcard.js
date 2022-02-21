import mongoose from "mongoose";

const vcardSchema = new mongoose.Schema({
    logoImg: String,
    profilePicture: String,
    name: String,
    title: String,
    phoneNumber: String,
    address: {
        mapUrl: String,
        addressText: String
    },
    email: String,
    socials:{
        type: Array,
        required: true
    },
    webSite: String,
    userId: String,
    about: String
});

const Vcard = mongoose.model('Vcard', vcardSchema);

export default Vcard;