import {atom} from 'recoil'
export const compartmentAtom = atom({
    key:'compartment',
    default:[{
        compartmentName:'',
    'class':'',
    capacity:''
    }]
})