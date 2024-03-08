import {atom} from 'recoil'
export const TicketAtom = atom({
    key:'Ticket',
    default:{
        trainNumber:'',
        trainName:'',
        class:'',
        price:'',
        passengerCount:1
    }
})