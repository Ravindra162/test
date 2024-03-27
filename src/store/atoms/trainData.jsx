import {atom} from 'recoil'
export const trainDataAtom = atom({
    key:'TrainData',
    default:{
        trainName:'',
    trainNumber:'',
    startDate:'',
    startTime:'',
    endDate:'',
    endTime:'',
    source:'',
    destination:''
    }
})