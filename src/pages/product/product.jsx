import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import convertPrice from "../../../utils/price"
import Handle from "../../../service/handle"
import Swaload from '../../../utils/swaload'
import axios from "axios"
import jwt from "jwt-decode"
import "../../style/product.css"

const Product = () => {
    const navigate = useNavigate()
    const { ctg } = useParams()
    const [ page, setPage ] = useState(1)
    const [ data, setData ] = useState([])
    const [ value, setValue] = useState('')
    const [ status, setStatus ] = useState(200)
    const [ loading, setLoading ] = useState(false)

    const searchProduct = async (e) => {
        e.preventDefault()
        try {
            if (value && value.length >= 3) {
                setLoading(true)
                const response = await axios.get(`${import.meta.env.VITE_API}/search/product/${value}/${page}`)
                setData(response.data)
            }
        } catch (error) {
            setValue('')
            return false;
        } finally {
            setLoading(false)
        }
    }

    const search = {
        show : () => {
            const control = document.getElementById('control')
            const find = document.getElementById('find')
            find.style.display = 'flex'
            control.style.display = 'none'
        },
        hide : () => {
            const control = document.getElementById('control')
            const find = document.getElementById('find')
            control.style.display = 'flex'
            find.style.display = 'none'
        }
    }
    
    const getProducts = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API}/products/${ctg}/${page}`)
            const result = response.data
            const decode = jwt(result)
            decode.data.length != 0 ? setData(decode.data) : setStatus(404)
        }   catch (error) {
            setStatus(error.response ? 404 : 500)
        }
        finally { setLoading(false) }
    }

    useEffect(() => { !value && getProducts() }, [page, value])
    if (status !== 200) return <Handle status={status}/> 

    return (
        <div className='page-max' style={{flexDirection: 'column'}}>
            <div id='snap-container'></div>
                <div className="back" onClick={() => navigate('/')}>
                    <div className="fa-solid fa-arrow-left fa-xl active"></div>
                    <div className="nav-logo"><h1>stresslo</h1></div>
                </div>
            <div className='product-page' style={{paddingBottom: '0', paddingTop: '10px'}}>
                <div id='control' className='form' style={{margin: 'auto'}}>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <div className='button' style={{height: '35px', backgroundColor: 'var(--primary)'}}>
                                <div style={{fontFamily: 'var(--quicksand)', color: 'var(--blue)', fontSize: '1rem'}}>Filter</div>
                                <div className='fa-solid fa-caret-down fa-lg' style={{color: 'var(--blue)'}}></div>
                            </div>
                        </div>
                        <div onClick={() => search.show()} style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'}}>
                            <div className='fa-solid fa-search fa-lg' style={{color: 'var(--text)'}}/>
                            <div style={window.innerWidth >= 500 ? {color: 'var(--text)', fontSize: '1rem', fontFamily: 'var(--poppins)'} : { display: 'none' }}>Search</div>
                        </div>
                    </div>
                </div>
                <form onSubmit={(e) => { searchProduct(e) }} id='find' className='form' style={{margin: 'auto', display: 'none'}}>
                    <div style={{width: '100%', display: 'flex', alignItems: 'center', position: 'relative', gap: '5px'}}>
                        <input type="text" onChange={(e) => setValue(e.target.value)} placeholder='search product' className='search' style={{width: '100%', backgroundColor: 'unset', boxShadow: 'unset', border: '2px solid var(--primary)'}}/>
                        <div onClick={() => search.hide()} className='button' style={{width: '70px', height: '45px', backgroundColor: 'var(--primary)'}}>
                            <div className='fa-solid fa-close fa-xl' style={{color: 'var(--text)'}}/>
                        </div>
                    </div>
                </form>
                <div className='product-container' style={{flexDirection: 'column-reverse', marginTop: '30px'}}>
                    {(loading) ? (
                    <Swaload.Product/>
                    ) : (
                        data.map((i, index) => {
                            return(
                                <div className='product-card' key={index} onClick={() => navigate(`/product/details/${i.vid}`, {state: i})}>
                                    <LazyLoadImage className='product-img' src={(i.img) || ('img/img404.jpg')} effect='blur'/>
                                    <div className='wrapped-text'>
                                        <div className='product-title'>{i.title}</div>
                                        <div style={{ display: 'flex', flexWrap : 'wrap', flexDirection : 'column'}}>
                                            <div className='product-desc'>{i.desc.length >= 35 ? i.desc.substring(0,35) + '...' : i.desc}</div>
                                            <div className='wrapdet' style={{ position: 'unset', marginTop: '15px', marginLeft: '5px', gap: '5px' }}>
                                                <div style={{ backgroundColor: 'var(--background)', width: '95px', height: '30px' }}>{i.tech}</div>
                                                <div style={{ backgroundColor: 'var(--background)', width: '95px', height: '30px'}}>{i.price == 0 ? 'Free' : 'Paid'}</div>
                                             </div>
                                        </div>
                                        <div className='wrapped-details'>
                                            <div className='button price'>{convertPrice(i.price)}</div>
                                            <div style={{ color : 'var(--text)', cursor: 'pointer'}} className='fa-solid fa-cart-plus fa-xl' />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
                {(data.length >= 10) ? 
                    <div style={{ display: 'flex', gap: '20px', marginTop: '50px', alignItems: 'center', justifyContent: 'center' }}>
                        {(page !== 1) && <div className='button' onClick={() => setPage(page -1)} style={{borderRadius: '10px', height : '35px', backgroundColor: 'var(--primary)', color: 'var(--blue)'}}>
                            <h3 style={{fontFamily: 'var(--quicksand)', fontSize: '1.2rem', color: 'var(--blue)'}}>{page -1}</h3>
                            <div className='fa-solid fa-left-long fa-xl'/>
                        </div>}
                        {(page !== 1) && <h3 style={{fontFamily: 'var(--quicksand)', fontSize: '1.2rem', color: 'var(--blue)', margin: '0 10px'}}>{page}</h3>}
                        <div className='button' onClick={() => setPage(page +1)} style={{borderRadius: '10px', height : '35px', backgroundColor: 'var(--primary)', color: 'var(--blue)'}}>
                            <div className='fa-solid fa-right-long fa-xl'/>
                            <h3 style={{fontFamily: 'var(--quicksand)', fontSize: '1.2rem', color: 'var(--blue)'}}>{page +1}</h3>
                        </div>
                    </div>
                :
                <div style={{ display: 'flex', gap: '20px', marginTop: '45px', alignItems: 'center', justifyContent: 'center' }}>
                        {(page === 1) ? 
                        <div className='desc' style={{fontFamily: 'var(--quicksand)',fontSize: '0.85rem', color: 'var(--text)'}}>- already displays all products -</div>
                        :
                        <div className='button' onClick={() => setPage(page -1)} style={{borderRadius: '10px', height : '35px', backgroundColor: 'var(--primary)', color: 'var(--blue)'}}>
                            <h3 style={{fontFamily: 'var(--quicksand)', fontSize: '1.2rem', color: 'var(--blue)'}}>{page -1}</h3>
                            <div className='fa-solid fa-left-long fa-xl'/>
                        </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Product