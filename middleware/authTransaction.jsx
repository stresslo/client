import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { LazyLoadImage } from 'react-lazy-load-image-component' 
import convertPrice from '../utils/price'
import html2canvas from "html2canvas"
import jspdf from "jspdf"
import moment from "moment"
import getvxsrf from '../service/getvxsrf'
import Loading from '../utils/loading'
import swalert from "../utils/swalert"
import swal from "sweetalert2"
import axios from 'axios'
import snap from '../utils/snap'
import Swaload from '../utils/swaload'

const AuthTransaction = () => {

    const navigate = useNavigate()
    const loc = useLocation()
    const i = loc.state
    const [ loading, setLoading ] = useState(false)
    const [ product, setProduct ] = useState('')
    const [ vxsrf, setVxsrf] = useState('')
    const [ data, setData ] = useState(i)
    const { order_id } = useParams()

    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API}/transaction/result/${order_id}`)
            return response;
        } catch (error) {
            if (error.response || error) {
                swalert(error.response.data || "internal server error", 'error', 2000)
            }
        } finally {setLoading(false)}
    }
    
    const donwloadProduct = async () => {
        if (!order_id) return (await swalert("transaction not found", "error")).dismiss && navigate('/')
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_API}/transaction/success`,{
                order_id : order_id
            }, { headers: { 'xsrf-token' : vxsrf }})
            const url = response.data.file;
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${response.data.name}`);
            document.body.appendChild(link);
            link.onclick = () => { document.body.removeChild(link) }
            swal.fire({
                icon: 'success',
                background: 'var(--primary)',
                color: 'var(--blue)',
                confirmButtonColor: "none",
                text: 'Transaction complete!, thanks for your order on stresslo.',
                customClass: { container: "alertext" },
                confirmButtonText: 'download product',
            })
            .then((res) => {
                res.isConfirmed && link.click()
            })

        } catch (error) {
            swalert("server maintenance!")
            if(error.response) swalert(error.response.data)
        } finally {
            setLoading(false)
        }
    }

    const repay = () => { 
        window.snap.pay(data.transaction_token, {
        onPending : () => { window.location.reload() }
    })}

    const getProducts = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API}/products/vid/${data.product_id}`)
            setProduct(response.data)
        }   catch (error) {
            if (error || error.response) {
              swalert(error.response.data, "error", 1500)
            }
        } finally {
          setLoading(false)
        }
    }

    useEffect(() => {
        if (!i) { getData().then((res) => setData(res.data)) }
        getvxsrf().then((result) => setVxsrf(result))
    } , [])

    useEffect(() => { if(data) {
        if (data.transaction_status == 'pending' || data.transaction_status == 'created') { snap() } 
        data.product_id && getProducts()
    }
    } , [data])

    return(
        <div className='page-max'>
            <div className="back" onClick={() => navigate('/transaction/history')}>
                <div className="fa-solid fa-arrow-left fa-xl active"></div>
                <div className="nav-logo"><h1>stresslo</h1></div>
          </div>
          <div className='form invoice' style={{justifyContent: 'center',  gap: '30px', textAlign: 'left', marginTop: '70px'}}>
            {(data) && 
            <>
                {data.transaction_status == 'settlement' && <div className='button-max' onClick={() => { donwloadProduct() }} style={{ backgroundColor: 'var(--yellow)' }}>Get product file</div>}
                {data.transaction_status == 'pending' && <div className='button-max' onClick={() => repay()} style={{ backgroundColor: 'var(--yellow)' }}>Pay now</div>}
                {data.transaction_status == 'created' && <div className='button-max' onClick={() => repay()} style={{ backgroundColor: 'var(--yellow)' }}>Pay now</div>}
            </>
            }
            { (loading) ? (<Swaload.Product number={1}/>)
            : (product) && 
            <div className='product-card' style={{margin: 'auto'}} onClick={() => navigate(`/product/details/${product.vid}`, {state: product})}>
                <LazyLoadImage className='product-img' src={(product.img) || ('img/img404.jpg')} effect='blur'/>
                <div className='wrapped-text'>
                    <div className='product-title'>{product.title}</div>
                    <div style={{ display: 'flex', flexWrap : 'wrap', flexDirection : 'column'}}>
                        <div className='product-desc'>{product.desc.length >= 40 ? product.desc.substring(0,40) + '...' : product.desc}</div>
                        <div className='wrapdet' style={{ position: 'unset', marginTop: '15px', marginLeft: '5px', gap: '5px' }}>
                            <div style={{ backgroundColor: 'var(--background)', width: '95px', height: '30px' }}>{product.tech}</div>
                            <div style={{ backgroundColor: 'var(--background)', width: '95px', height: '30px' }}>{product.tech.toLowerCase().includes('html') ? "only" : 'JS'}</div>
                        </div>
                    </div>
                    <div className='wrapped-details'>
                        <div className='button price'>Details</div>
                    </div>
                </div>
            </div>
            }
            <div className='title' style={{textAlign: 'center', marginTop: '20px'}}>Product</div>
            {data.transaction_status == 'settlement' && <p style={{color: 'var(--blue)', textAlign: 'center', cursor: 'pointer'}}>*Screenshot if needed</p>}
            <div style={{width: '100%', display: 'flex', gap: '5px', fontFamily: 'var(--quicksand)'}}>
                <div style={{width: '50%', display: 'flex', flexDirection: 'column', gap: '5px', color: 'var(--yellow)'}}>
                    <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>Customer :</h4>
                    <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>Email :</h4>
                    <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>Status :</h4>
                    <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>Order ID :</h4>
                    <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>Product ID :</h4>
                    <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>Amount :</h4>
                    <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>Token :</h4>
                    <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>Date :</h4>
                    <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>Time :</h4>
                </div>
                {(data) && 
                    <div style={{width: '50%', display: 'flex', flexDirection: 'column', gap: '5px', color: 'var(--blue)'}}>
                        <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>{data.name}</h4>
                        <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>{data.email && data.email.substring(0, 1) + '***@gmail.com'}</h4>
                        <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>{data.transaction_status}</h4>
                        <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>{data.order_id && data.order_id.substring(0,5) + '*****'}</h4>
                        <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>{data.product_id}</h4>
                        <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>{data.product_amount && convertPrice(data.product_amount)}</h4>
                        <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>{data.transaction_token? data.transaction_token.substring(0,5) + "*****" : '*****'}</h4>
                        <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>{data.updatedAt && moment(data.updatedAt.slice(0, 10)).format('MMM DD, YYYY')}</h4>
                        <h4 style={{border: '1px solid var(--blue)', padding: '10px', borderRadius: '5px'}}>{data.updatedAt && moment.utc(data.updatedAt).utcOffset("+07:00").format("HH.mm A")}</h4>
                    </div>
                }
            </div>
            {(data) &&
            <>
                {data.transaction_status == 'settlement' && 
                    <div style={{textAlign: 'center', lineHeight: '35px'}}>
                        <div className='fa-solid fa-circle-check fa-2xl' style={{fontSize: '2.5rem', color: 'var(--blue)'}}></div>
                        <div className='desc' style={{color: 'var(--yellow)'}}>Transaction Success</div>
                    </div>
                }
                {data.transaction_status == 'pending' && 
                    <div style={{textAlign: 'center', lineHeight: '32px'}}>
                        <div className='fa-solid fa-clock fa-2xl' style={{fontSize: '2.5rem', color: 'var(--blue)'}}></div>
                        <div className='desc' style={{color: 'var(--yellow)'}}>Transaction Pending</div>
                    </div>
                }
                {data.transaction_status == 'expire' && 
                    <div style={{textAlign: 'center', lineHeight: '32px'}}>
                        <div className='fa-solid fa-circle-xmark fa-2xl' style={{fontSize: '2.5rem', color: 'var(--blue)'}}></div>
                        <div className='desc' style={{color: 'var(--yellow)'}}>Transaction Failed</div>
                    </div>
                }
            </>
            }
            
            <div className='title' style={{textAlign: 'center'}}> <span>stresslo</span> Invoice </div>
          </div>
        </div>
    )
}

export default AuthTransaction;