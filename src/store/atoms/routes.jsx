import {atom} from 'recoil'
export const routesAtom = atom({
    key:'routes',
    default:[{
        stationName: '',
        stopNo: '',
        arrivalDate: '',
        departureDate: '',
        arrivalTime: '',
        departureTime: ''
    }]
})