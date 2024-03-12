import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RecoilRoot } from 'recoil'
import {NextUIProvider} from "@nextui-org/react";

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <RecoilRoot >
  <React.StrictMode>
  <NextUIProvider>
    <App />
    </NextUIProvider>
  </React.StrictMode>
  </RecoilRoot>   
  
  ,
)
