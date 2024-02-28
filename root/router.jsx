import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import jwt_decode from "jwt-decode"
import axios from "axios"

import Main from "../src/pages/user/main"
import Login from "../src/pages/user/login"
import Context from "../utils/context"
import Order from "../src/pages/product/order"
import Profile from "../src/pages/user/profile"
import Create from "../src/pages/product/create"
import Store from "../src/pages/contributor/store"
import Details from "../src/pages/product/details"
import Product from "../src/pages/product/product"
import Register from "../src/pages/user/register"
import Confirm from "../middleware/confirm"
import checkvxsrf from "../service/checkvxsrf"
import History from "../src/pages/user/history"
import AuthTransaction from "../middleware/authTransaction"

const Routing = () => {

  const axtoken = axios.create()
  const history = localStorage.getItem('status')
  
  const [vid, setVid] = useState('')
  const [img, setImg] = useState('/img/dui.jpg')
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [expires, setExpires] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(history ? history : '')
  
  axtoken.interceptors.request.use(async (config) => {
    const endpoint = status === 'contributor' ? 'vxrft/contributor' : 'vxrft/user'
    const current = new Date().getTime()
    if (expires * 1000 < current) {
      const response = await axios.get(`${import.meta.env.VITE_API}/${endpoint}`)
      config.headers.authorization = `bearer ${token}`
      setToken(response.data.token)}
      return config
  }, (error) => { return Promise.reject(error) })

  useEffect(() => {
    if (token) {
      const decoded = jwt_decode(token)
      decoded.img && setImg(decoded.img)
      setStatus(history)
      setVid(decoded.vid)
      setEmail(decoded.email)
      setExpires(decoded.exp)
      setUsername(decoded.username)
    }
  }, [token])

  useEffect(() => {
      context.setLoading(true)
      const endpoint = status === 'contributor' ? 'vxrft/contributor' : 'vxrft/user'
      axios.get(`${import.meta.env.VITE_API}/${endpoint}`)
      .then((response) => setToken(response.data.token))
      .then(() => checkvxsrf())
      .catch((error) => {console.log(error.message)})
      .finally(() => {context.setLoading(false)})
  }, [])

  const context = {vid, img, email, username, status, token, setToken, loading, setLoading}

  return (
    <Context.Provider value={context}>
      <Router>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/create" element={<Create/>}/>
          <Route path="/Profile" element={<Profile/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/product/:ctg" element={<Product/>}/>
          <Route path="/order/:vid" element={<Order/>}/>
          <Route path="/products" element={<Main/>}/>
          <Route path="/about" element={<Main/>}/>
          
          <Route path="/contributor/store" element={<Store/>}/>
          <Route path="/product/details/:vid" element={<Details/>}/>

          <Route path="/confirm/user" element={<Confirm.user/>}/>
          {/* <Route path="/confirm/contributor" element={<AuthRegisterCont/>}/> */}
          <Route path="/transaction/history" element={<History/>}/>
          <Route path="/transaction/result/:order_id" element={<AuthTransaction/>}/>
        </Routes>
      </Router>
    </Context.Provider>
  )
}

export default Routing
