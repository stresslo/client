import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import convertPrice from "../../../utils/price"
import Handle from "../../../service/handle"
import Swaload from '../../../utils/swaload'
import axios from "axios"
import jwt from "jwt-decode"
import "../../style/product.css"
import FilterBox from './filterbox'

const Product = () => {

    const navigate = useNavigate()
    const inputref = useRef(null)
    const historyPage = JSON.parse(localStorage.getItem('historyPageProduct'))
    const historySearch = localStorage.getItem('search')
    const filter = JSON.parse(localStorage.getItem('filterHistory'))
    const { ctg } = useParams()
    const [ data, setData ] = useState([])
    const [ status, setStatus ] = useState(200)
    const [ update, setUpdate] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const [ message, setMessage] = useState('')
    const [ page, setPage ] = useState(historyPage ? historyPage.page ? parseInt(historyPage.page) : 1 : 1)
    const [ value, setValue] = useState(historySearch ? historySearch : '')
    const [ filterHistory, setFilterHistory ] = useState(filter ?  filter : '')
    
    const searchProduct = async (e) => {
        e && e.preventDefault()
        try {
            if (value && value.length >= 1) {
                setLoading(true)
                localStorage.setItem('search', value)
                const response = await axios.get(`${import.meta.env.VITE_API}/product/search/${value}/${page}`)
                const decode = jwt(response.data)
                !decode.data.length && setMessage(`- no result found for ${value} -`)
                setData(decode.data)
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
            setValue('')
            setMessage('')
        }
    }
    
    const getProducts = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API}/products/${ctg}/${page}`)
            const result = response.data
            const decode = jwt(result)
            if (!decode.data.length && page == 1) return setStatus(404)
            setData(decode.data)
        }   catch (error) {
            setStatus(error.response ? 404 : 500)
        }
        finally { setLoading(false) }
    }

    useEffect(() => { 
        localStorage.setItem('historyPageProduct', JSON.stringify({ page: page || 1 }))
        window.scroll({
            top: 0,
            behavior : 'auto'
        })
        if (value) {
            search.show()
            searchProduct()
        } else if (filterHistory) {
            const endpoint = `${import.meta.env.VITE_API}/product/filter/${ctg}/${filterHistory.pricing}/${filterHistory.tech}/${filterHistory.price}/${filterHistory.optprice}/${page}`
            setLoading(true)
            axios.get(endpoint)
            .then((response) => {const decode = jwt(response.data); setData(decode.data)})
            .catch((error) => { return false; })
            .finally(() => setLoading(false))
        }
    }, [page])

    useEffect(() => {
        if(!value && !filterHistory) {
            getProducts()
        }
    }, [page, value, filterHistory])

    useEffect(() => { 
        if (update) {
            setFilterHistory(filter);
            setUpdate(false) 
        }
    }, [update])

    if (status !== 200) return <Handle status={status}/> 

    return (
        <>
        <FilterBox 
            filterHistory={filterHistory} 
            setLoading={setLoading}
            setUpdate={setUpdate} 
            setPage={setPage}
            setData={setData}
            page={page}
            ctg={ctg}
        />
        <div className='page-max' style={{flexDirection: 'column'}}>
            <div id='snap-container'/>
            <div className='product-page' style={{padding : '0px', marginTop: '0px'}}>
                <div className='product-container' style={{flexDirection: 'column', marginTop: '0'}}>
                    <div className='product-card' style={{height: 'max-content', padding: '0', backgroundColor: 'unset'}}>
                    <div id='control' className='form' style={{margin: 'auto'}}>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <div className='button' style={filterHistory ? {height: '35px', backgroundColor: 'var(--primary)', color: 'var(--yellow)'} : {height: '35px', backgroundColor: 'var(--primary)', color: 'var(--text)'}} onClick={() => {
                                const boxfilter = document.querySelector('.filter-box')
                                boxfilter.classList.contains('show') ? boxfilter.classList.remove('show') : boxfilter.classList.add('show')
                            }}>
                                <div style={{fontFamily: 'var(--quicksand)', fontSize: '1rem'}}>Filter</div>
                                <div className='fa-solid fa-caret-down fa-lg'></div>
                            </div>
                            {(filterHistory) && (
                                <div onClick={() => { setUpdate(true);localStorage.removeItem('historyPageProduct');localStorage.removeItem('filterHistory');location.reload()}} className='fa-solid fa-trash fa-lg' style={{color: 'var(--yellow)', cursor: 'pointer'}}/>
                            )}
                        </div>
                        <div className='button' onClick={() => {search.show(); page !== 1 && setPage(1); inputref.current.focus()}} style={{backgroundColor: 'var(--primary)', height: '35px'}}>
                            <div className='fa-solid fa-search fa-lg' style={{color: 'var(--text)'}}/>
                            <div style={{color: 'var(--text)', fontSize: '1rem', fontFamily: 'var(--poppins)'}}>Find</div>
                        </div>
                    </div>
                    </div>
                    <form onSubmit={(e) => { searchProduct(e) }} id='find' className='form' style={{margin: 'auto', display: 'none'}}>
                        <div style={{width: '100%', display: 'flex', alignItems: 'center', position: 'relative', gap: '5px'}}>
                            <input value={value} ref={inputref} type="text" onChange={(e) => setValue(e.target.value)} placeholder='find product' className='search' style={{width: '100%', backgroundColor: 'unset', boxShadow: 'unset', borderRadius: '0', borderBottom: '1px solid #aaa'}}/>
                            <div onClick={() => {localStorage.removeItem('search'); page !== 1 && setPage(1); search.hide()}} className='button' style={{width: '70px', height: '45px', backgroundColor: 'var(--primary)'}}>
                                <div className='fa-solid fa-close fa-xl' style={{color: 'var(--text)'}}/>
                            </div>
                        </div>
                    </form>
                    </div>
                    {(loading) ? (
                    <Swaload.Product/>
                    ) : (
                        data.map((i, index) => {
                            return(
                                <div className='product-card' key={index} onClick={() => navigate(`/product/details/${i.vid}`, {state: i})}>
                                    <LazyLoadImage className='product-img' src={(i.img) || ('img/img404.jpg')} loading='lazy' alt={`stresslo ${ctg} products`} effect='blur'/>
                                    <div className='wrapped-text'>
                                        <div className='product-title'>{i.title}</div>
                                        <div style={{ display: 'flex', flexWrap : 'wrap', flexDirection : 'column'}}>
                                            <div className='product-desc'>{i.desc.length >= 35 ? i.desc.substring(0,35) + '...' : i.desc}</div>
                                            <div className='wrapdet' style={{ position: 'unset', marginTop: '15px', marginLeft: '5px', gap: '5px' }}>
                                                <div style={{ backgroundColor: 'var(--background)', width: '95px', height: '30px' }}>{i.tech}</div>
                                                {(i.price == 0) ? 
                                                <div style={{ backgroundColor: 'var(--background)', width: '95px', height: '30px', color: 'var(--blue)'}}>Free</div>
                                                : 
                                                <div style={{ backgroundColor: 'var(--background)', width: '95px', height: '30px'}}>Paid</div>
                                                }
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
                        <div className='desc' style={{fontFamily: 'var(--quicksand)',fontSize: '0.85rem', color: 'var(--text)'}}>{message ? message : '- already displays all products -'}</div>
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
        </>
    )
}

export default Product