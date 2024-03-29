import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import React, { useContext } from 'react'
import axios from 'axios'
import snap from "../../../utils/snap"
import swalert from '../../../utils/swalert'
import Loading from "../../../utils/loading"
import convertPrice from '../../../utils/price'
import getvxsrf from '../../../service/getvxsrf'
import Context from "../../../utils/context"
import { useEffect } from 'react'
import { useState } from 'react'
import "../../style/create.css"

const Order = () => {

    const context = useContext(Context)
    const location = useLocation()
    const navigate = useNavigate()
    const {vid} = useParams()
    const i = location.state
    
    const [loading, setLoading] = useState('')
    const [vxsrf, setVxsrf] = useState('')
    const [data, setData] = useState(i)
    const [name, setName] = useState(context.username ? context.username : '')
    const [email, setEmail] = useState(context.email ? context.email : '')
    
    const getProducts = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API}/products/vid/${vid}`)
            setData(response.data)
        }   catch (error) {
            if (error || error.response) {
              swalert(error.response.data, "error", 1500)
              .then((res) => res.dismiss && navigate('/'))
            }
        } finally {
          setLoading(false)
        }
    }
    
    const checkout = async () => {
      if (context.role == 'contributor') {
        swalert('please switch to user account', 'info', 3000)
        return false;
      }
      try {
        setLoading(true)
        const response = await axios.post(`${import.meta.env.VITE_API}/transaction/create`,{
          vid     : vid,
          name    : name,
          email   : email,
        }, 
        { headers : { "xsrf-token" : vxsrf } })
        localStorage.setItem('transaction_mode', "true")
        const token = response.data.transactionToken
        if (token) {
          window.snap.pay(token, {
            onSuccess: (result) => { window.location.href = `/transaction/result/${result.order_id}`},
            onPending : () => {window.location.href = '/'}
        })
        }
      } 
      catch (error) {
        if (error || error.response) {
          swalert(error.response.data, "error")
        }
      }
      finally { setLoading(false) }
    }

    const getWarning = () => {
      if (!context.token) {
        swalert('please login first before starting the transaction', 'info', 3000)
      }
    }

    useEffect(() => {
      window.scrollTo({top: 0,  behavior: 'smooth'})
      if (name || email) {
        snap()
        getvxsrf().then((result) => setVxsrf(result))
      }
      if (!i) { getProducts() }
    }, [])

    useEffect(() => {
      context.username && setName(context.username)
      context.email && setEmail(context.email)
    }, [context])

    if (loading) return <Loading/>

    return (
        <div className='page-max' style={{gap:'30px'}}>
          <div className="back" onClick={() => navigate(`/product/details/${vid}`, { state: i })}>
            <div className="fa-solid fa-arrow-left fa-xl active"></div>
            <div className="nav-logo"><h1>stresslo</h1></div>
            <div className='snap-container'></div>
          </div>
          <div className='form'>
          <div className='button-max' onClick={() => context.token ? checkout() : getWarning()} style={(name && email) ? { backgroundColor: 'var(--yellow)', marginTop: '30px' } : { backgroundColor: "#aaa", marginTop: '30px' }}>Payment Method</div>
            <div>
              <div className='itext' style={{color: 'var(--yellow)', marginTop: '10px'}}>Shipping Details</div>
              <div style={{margin: '5px', marginTop: '10px', fontFamily: 'var(--quicksand)', fontSize: '1rem', color: '#aaa', lineHeight : '35px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div>Name : </div>
                  <div style={!name ? {color: 'var(--oren)', cursor: 'pointer'} : {color: 'var(--blue)'}} onClick={() => !name && navigate('/login')}>{name || "Login"}</div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div>Email Address : </div>
                  <div style={!email ? {color: 'var(--oren)', cursor: 'pointer'} : {color: 'var(--blue)'}} onClick={() => !name && navigate('/login')}>{email ? email.substring(0, 1) + '***@gmail.com' : "Login"}</div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div>Product ID : </div>
                  <div>{vid}</div>
                </div>
              </div>
              <div style={{margin: '10px 0' , width: '100%', height: '2px', backgroundColor: 'var(--primary)'}}/>
              <div style={{margin: '5px', fontFamily: 'var(--quicksand)', fontSize: '1rem', color: 'var(--text)', lineHeight : '30px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div>Price : </div>
                  <div>{convertPrice(i.price)}</div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div>Discount : </div>
                  <div>{convertPrice(0)}</div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div>Taxes & Fees : </div>
                  <div>{convertPrice(i.price * 0.11)}</div>
                </div>
              </div>
              <div style={{margin: '10px 0' , width: '100%', height: '2px', backgroundColor: 'var(--primary)'}}/>
              <div style={{margin: '5px', fontFamily: 'var(--quicksand)', fontSize: '1rem', color: 'var(--text)', lineHeight : '30px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bolder'}}>
                  <div><span>Total :</span> </div>
                  <div>{convertPrice(i.price * 0.11 + i.price)}</div>
                </div>
              </div>
            </div>
            <div className='prev-form'>
              <div className='itext'><span>Place</span> Order</div>
              <div className="product-card" style={{ height: 'max-content', width: '100%', marginTop: '0px', justifyContent: 'center' }}>
                <LazyLoadImage style={{ width: '100%' }} className='product-img' src={data.img} loading='lazy' effect='blur'/>
              </div>
              <div className='product-card' style={{ height: 'max-content', width: '100%', marginTop: "0" }}>
                <div className='wrapped-text'>
                    <div className='product-title' style={{ fontSize: '1rem', textAlign: 'center', color: 'var(--text)', textShadow: 'unset', marginTop: '0px' }}>{data.title}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
}

export default Order