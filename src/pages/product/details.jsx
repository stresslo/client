import moment from "moment"
import Skeleton from "react-loading-skeleton"
import convertPrice from "../../../utils/price"
import { useLocation, useParams } from "react-router-dom"
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LazyLoadImage } from "react-lazy-load-image-component"
import Context from "../../../utils/context"
import swalert from "../../../utils/swalert"
import axios from "axios"
import "../../style/create.css"
import Swal from "sweetalert2"

const Details = () => {

    const backref = useRef(null)
    const context = useContext(Context)
    const { vid } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [cont, setCont] = useState('')
    const [i, seti] = useState(location.state)
    const [loading, setLoading] = useState(false)
    const date = moment(i.createdAt.slice(0, 10)).format('MMM DD, YYYY')

    const freeDonwload = async () => {
        try {
          setLoading(true)
          const response = await axios.get(`${import.meta.env.VITE_API}/product/free/donwload/${vid}`)
          const url = response.data.file;
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${response.data.name}`);
          document.body.appendChild(link);
          link.click()
          document.body.removeChild(link)
          swalert('successfuly donwload product', 'success', 3000)
          .then((res) => res.dismiss && backref.current.click())
        } catch (error) {
          error.response && swalert(error.response.data, 'info', 3000)
          return false;
        } finally {
          setLoading(false)
        }
    }

    const getContributor = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API}/product/by/${i.by}`)
            setCont(response.data)
        } catch (error) {
            return Promise.reject(error)
        } finally {
            setLoading(false)
        }
    }

    const getProducts = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API}/products/vid/${vid}`)
            seti(response.data)
        }   catch (error) {
            if (error || error.response) {
              swalert(error.response.data, "error", 1500)
              .then((res) => res.dismiss && navigate('/'))
            }
        } finally {
          setLoading(false)
        }
    }

    const deleteProduct = async () => {
        const url = `${import.meta.env.VITE_API}/product/${i.status}/delete/${vid}`
        Swal.fire({
            icon: 'info',
            text : 'are you sure want delete this product?',
            confirmButtonText : 'Delete',
            showDenyButton: true,
            focusConfirm: false,
            focusDeny : false,
            denyButtonText : 'Cancel',
            background : 'var(--primary)',
            color : 'var(--blue)',
            customClass : { container: 'alertext' }
        })
        .then(async (res) => {
            if (res.isConfirmed) {
                try {
                    setLoading(true)
                    const response = await axios.get(url)
                    swalert(response.data, 'success', 3000)
                    .then((res) => res.dismiss && navigate(i.prev))
                } catch (error) {
                    if (error || error.response) {
                        swalert(error.response.data, 'info', 3000)
                        return false;
                    }
                }
            }
        })
    }

    useEffect(() => { 
        i.by && getContributor() 
        !i && getProducts()
    }, [])

    return (
        <div className='page-max'>
            <div className="back" ref={backref} onClick={() => i ? i.prev ? navigate(i.prev) : navigate(`/product/${i.ctg}`, { state: i.pageHistory}) : navigate(`/product/${i.ctg}`, { state: i.pageHistory })}>
                <div className="fa-solid fa-arrow-left fa-xl active"></div>
                <div className="nav-logo"><h1>stresslo</h1></div>
            </div>
            <div className="form">
                <div className='prev-form' style={{ marginTop: '10px', paddingBottom: '0', gap: '20px' }}>
                    <div className='itext'>Product Details</div>
                        <>
                        <div className="product-card" style={{ height: 'max-content', width: '100%', marginTop: '0px', justifyContent: 'center' }}>
                            <LazyLoadImage style={{ width: '100%' }} className='product-img' src={i.img} loading='lazy' effect='blur'/>
                        </div>
                        {(i.ctg === 'web') && 
                        <div className="button-max" style={{ color: "var(--text)", backgroundColor: "var(--primary)"}} onClick={() => window.open(i.link)}>
                            <div className="i fa-solid fa-globe fa-xl"/>
                            Live Preview
                        </div>
                        }
                        <div className='product-card' style={{ height: 'max-content', width: '100%', marginTop: "30px" }}>
                            <div className='wrapped-text'>
                                <div className='product-title' style={{ fontSize: '1.4rem' }}>{i.title}</div>
                                <div className='product-desc' style={{ display: "block", fontSize: '1rem', marginTop: '10px', fontFamily: 'var(--quicksand)', color: 'var(--blue)' }}>{i.desc}</div>
                            </div>
                        </div>
                        <div className='product-card' style={{ height: 'max-content', width: '100%', marginTop: '10px' }}>
                            <div className='wrapped-text'>
                                <div className='wrapped-details' style={{margin: 0, paddingTop: '0', display: 'flex',alignItems: 'unset', flexDirection: "column", gap: '10px'}}>
                                    <div className="product-desc-product"><span>VID</span>          : {i.vid}</div>
                                    <div className="product-desc-product"><span>Price</span>        : {i.price == 0 ? 'Free' : convertPrice(i.price)}</div>
                                    <div className="product-desc-product"><span>Category</span>     : {i.ctg}</div>
                                    {i.ctg == 'web' ? 
                                    <div className="product-desc-product"><span>Framework</span>  : {i.tech} {i.tech.toLowerCase().includes('html') ? "" : 'JS'}</div>
                                    :
                                    <>
                                    <div className="product-desc-product"><span>Software</span>  : {i.tech}</div>
                                    <div className="product-desc-product"><span>Main Format</span>  : {i.format}</div>
                                    </>
                                    }   
                                    <div className="product-desc-product"><span>Date created</span>  : {date}</div>
                                </div>
                            </div>
                        </div>
                        <div className='product-card' style={{ height: 'max-content', width: '100%' }}>
                            <div className='wrapped-text'>
                                <div className='wrapped-details' style={{margin: 0, paddingTop: '0', display: 'flex',alignItems: 'unset', flexDirection: "column", gap: '10px'}}>
                                    <div className="product-desc-product">
                                        <span>Contributor </span>
                                        {(loading) ? 
                                            <div style={{marginTop: '10px',display: 'flex', gap: '10px', alignItems: 'center'}}>
                                                <Skeleton style={{boxShadow: 'var(--softshadow)', width: '30px', height: '30px', borderRadius: '50%'}} baseColor='var(--primary)' highlightColor='var(--prime)'/> 
                                                <Skeleton style={{boxShadow: 'var(--softshadow)'}} className='itext' width={150} height={30} baseColor='var(--primary)' highlightColor='var(--prime)'/>
                                            </div>
                                        : 
                                            <div style={{marginTop: '10px',display: 'flex', gap: '10px', alignItems: 'center'}}>
                                                <LazyLoadImage src={cont.img ? cont.img : '/img/dui.jpg'} style={{width: '30px', height: '30px', objectFit: 'cover', borderRadius: '50%'}}/>
                                                <p style={{color: 'var(--blue)'}}>{cont.username && cont.username}</p>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(i.status) ?
                        <>
                        {(i.status == 'active') && 
                        <>
                        <div onClick={() => navigate('/edit/product', {state: i})} className="button-max" style={{ marginTop: '30px', backgroundColor: 'var(--yellow)' }}>
                            <div className="i fa-solid fa-pen-to-square fa-xl" style={{color: 'var(--background)'}}/>
                            Edit Product
                        </div>
                        <div onClick={() => deleteProduct()} className="button-max" style={{ marginTop: '0px', backgroundColor: 'var(--oren)' }}>
                            <div className="i fa-solid fa-trash fa-xl" style={{color: 'var(--background)'}}/>
                            Delete Product
                        </div>
                        </>}
                        {(i.status == 'pending') &&
                        <>
                        <div onClick={() => navigate('/edit/product', {state: i})} className="button-max" style={{ marginTop: '30px', backgroundColor: 'var(--yellow)' }}>
                            <div className="i fa-solid fa-pen-to-square fa-xl" style={{color: 'var(--background)'}}/>
                            Edit Product
                        </div>
                        <div onClick={() => deleteProduct()} className="button-max" style={{ marginTop: '0px', backgroundColor: 'var(--oren)' }}>
                            <div className="i fa-solid fa-trash fa-xl" style={{color: 'var(--background)'}}/>
                            Delete Product
                        </div>
                        </>}
                        {(i.status == 'rejected') && 
                        <div onClick={() => deleteProduct()} className="button-max" style={{ marginTop: '30px', backgroundColor: 'var(--yellow)' }}>
                            <div className="i fa-solid fa-trash fa-xl" style={{color: 'var(--background)'}}/>
                            Delete Product
                        </div>}
                        </>
                        : 
                        (i.price == 0) ?
                        <div className="button-max" onClick={() => freeDonwload()} style={{ marginTop: '30px', backgroundColor: 'var(--yellow)' }}>
                            <div className="i fa-solid fa-download fa-xl" style={{color: 'var(--background)'}}/>
                            Free download
                        </div>
                        :
                        <div className="button-max" onClick={() => navigate(`/order/${vid}`, {state: i})} style={{ marginTop: '30px', backgroundColor: 'var(--yellow)' }}>
                            <div className="i fa-solid fa-cart-shopping fa-xl" style={{color: 'var(--background)'}}/>
                            Order now
                        </div>
                        }
                        </>
                </div>
            </div>
        </div>
    )
}

export default Details