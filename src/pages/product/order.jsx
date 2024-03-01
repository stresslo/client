import React, { useContext } from 'react'
import axios from 'axios'
import snap from "../../../utils/snap"
import swalert from '../../../utils/swalert'
import Loading from "../../../utils/loading"
import convertPrice from '../../../utils/price'
import getvxsrf from '../../../service/getvxsrf'
import Context from "../../../utils/context"
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useEffect } from 'react'
import { useState } from 'react'
import Swal from 'sweetalert2'
import "../../style/create.css"

const Order = () => {

    const context = useContext(Context)
    const location = useLocation()
    const history = JSON.parse(localStorage.getItem("inputOrder"))
    const navigate = useNavigate()
    const {vid} = useParams()
    const i = location.state
    
    const [loading, setLoading] = useState('')
    const [vxsrf, setVxsrf] = useState('')
    const [data, setData] = useState(i)
    const [name, setName] = useState(context.username ? context.username : '')
    const [email, setEmail] = useState(context.email ? context.email : '')
    const [phone, setPhone] = useState(history ? history.phone : '')
    
    if (name || email || phone) {
      localStorage.setItem('inputOrder', JSON.stringify({ name, email, phone }))
    }
    
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

    const showPlaceOrder = async () => {
      const tax = i.price * 0.11
      const total = i.price + tax
      if (email && name) {
        return Swal.fire({
          html: `
          <div style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
            <h2 style="text-align: center;">Shipping Details</h2>
            <div style="width: 100%; height: 1px; background-color: var(--blue);"></div>
            <h4 style="margin-top: 5px; text-align: left;"><span>Customer</span> : ${name}</h4>
            <h4 style="text-align: left;"><span>Phone Number</span> : ${phone.length >= 10 ? phone : '087800000000'}</h4>
            <h4 style="text-align: left;"><span>Email Address</span> : ${email}</h4>
            <h4 style="text-align: left;"><span>Product ID</span> : ${vid}</h4>
            <h4 style="text-align: left;"><span>Quantity</span> : 1</h4>
            <h4 style="text-align: left;"><span>Price</span> : ${convertPrice(i.price)}</h4>
            <h4 style="text-align: left;"><span>TAX</span> : ${convertPrice(tax)}</h4>
            <div style="width: 100%; height: 1px; background-color: var(--blue)"></div>
            <h4><span>Total Amount</span> : ${convertPrice(total)}</h4>
          </div>  
          `,
          confirmButtonText: 'Confirm & Pay',
          cancelButtonText: "Cancel",
          reverseButtons : true,
          allowOutsideClick: false,
          showCancelButton: true,
          focusConfirm: false,
          color: 'var(--blue)',
          background: 'var(--primary)',
          customClass: {container: 'alertext'},
        })
        .then((res) => {
          if (res.isConfirmed) {
            checkout()
          }
        })
      }
    }
    
    const checkout = async () => {
      try {
        setLoading(true)
        const response = await axios.post(`${import.meta.env.VITE_API}/transaction/create`,{
          vid     : vid,
          name    : name,
          email   : email,
          phone   : phone.length >= 10 ? phone : '087800000000',
        }, 
        { headers : { "xsrf-token" : vxsrf } })
        localStorage.setItem('transaction_mode', "true")
        window.snap.pay(response.data, {
          onSuccess: (result) => { window.location.href = `/transaction/result/${result.order_id}`},
          onPending : () => {window.location.href = '/'}
      })
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
      if (!i) { getProducts() }
      snap()
      getvxsrf().then((result) => setVxsrf(result))
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
            <div className='input-form' >
              <div>
                <div>Phone Number :</div>
                <input className='productinput' value={phone} type="text" placeholder='(Optional)' onChange={(e) => setPhone(e.target.value)} required/>
              </div>
              <div className='button-max' onClick={() => context.token ? showPlaceOrder() : getWarning()} style={(name && email) ? { backgroundColor: 'var(--yellow)' } : { backgroundColor: "#aaa" }}>Checkout</div>
            </div>
            <div>
              <div className='itext' style={{color: 'var(--yellow)'}}>Order Details : </div>
              <div style={{margin: '10px 0' , width: '100%', height: '1.5px', backgroundColor: 'var(--primary)'}}/>
              <div style={{margin: '5px', fontFamily: 'var(--quicksand)', fontSize: '1rem', color: 'var(--blue)', lineHeight : '30px'}}>
                <div>Name : {name}</div>
                <div>Email : {email}</div>
                <div>Phone : {phone}</div>
              </div>
              <div style={{margin: '10px 0' , width: '100%', height: '1.5px', backgroundColor: 'var(--primary)'}}/>
              <div style={{margin: '5px', fontFamily: 'var(--quicksand)', fontSize: '1rem', color: 'var(--text)', lineHeight : '30px'}}>
                <div>Product ID : {vid}</div>
                <div>Quantity : 1</div>
              </div>
              <div style={{margin: '10px 0' , width: '100%', height: '1.5px', backgroundColor: 'var(--primary)'}}/>
              <div style={{margin: '5px', fontFamily: 'var(--quicksand)', fontSize: '1rem', color: 'var(--text)', lineHeight : '30px'}}>
                <div>Price : {convertPrice(i.price)}</div>
                <div>TAX : {convertPrice(i.price * 0.11)}</div>
              </div>
              <div style={{margin: '10px 0' , width: '100%', height: '1.5px', backgroundColor: 'var(--primary)'}}/>
              <div style={{margin: '5px', fontFamily: 'var(--quicksand)', fontSize: '1rem', color: 'var(--text)', lineHeight : '30px'}}>
                <div>Total : {convertPrice(i.price * 0.11 + i.price)}</div>
              </div>
            </div>
            <div className='prev-form'>
              <div className='itext'>Product</div>
              <div className='product-card'>
                <LazyLoadImage className='product-img' src={data.img} loading='lazy' effect='blur'/>
                <div className='wrapped-text'>
                    <div className='product-title'>{data.title}</div>
                    <div className='product-desc' style={{marginTop: '10px'}}>{data.desc}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
}

export default Order