import {atom} from 'recoil'
export const CrucksAtom = atom({
    key:'crucks',
    default:{
        source:'',
        destination:'',
        date:''
    }
})