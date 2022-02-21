import { createContext } from "react";

export const VcardDefaultValues = {
    logoImg:'',
    profilePicture: '',
    name: '',
    title: '',
    phoneNumber: '',
    address: {
        mapUrl: '',
        addressText: ''
    },
    email: '',
    socials : {},
    webSite: ''
}

export const ContextProvider = createContext();