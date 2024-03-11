import {atom} from 'recoil'
export const TicketAtom = atom({
    key:'Ticket',
    default:{
        trainNumber:'',
        trainName:'',
        class:'',
        passengerCount:1,
        price:0,
        
    }
})