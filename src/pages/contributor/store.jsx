import React, { useContext, useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component' 
import { useNavigate } from 'react-router-dom'
import Swaload from '../../../utils/swaload'
import Context from '../../../utils/context'
import Topback from '../../components/topback'
import convertPrice from "../../../utils/price"
import moment from "moment"
import axios from "axios"

const Store = () => {

    const navigate = useNavigate()
    const context = useContext(Context)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)

    const getYours = async () => {
        setLoading(true)
        axios.get(`${import.meta.env.VITE_API}/products/contributor/${page}`)
        .then(response => setData(response.data))
        .catch(error => Promise.reject(error))
        .finally(() => setLoading(false))
    }

    useEffect(() => { getYours() }, [page])

    return (
        <div className='page-max'>
            <Topback/>
            <div className='product-page' style={{paddingBottom: '0'}}>
                <div className='product-container' style={{flexDirection: 'column-reverse'}}>
                    <input type="text" className='search'/>
                    {(loading) ? (
                    <Swaload.Product/>
                    ) : (
                        data && data.map((i, index) => {
                            return(
                                <div className='product-card' key={index} onClick={() => navigate(`/product/details/${i.vid}`, {state: i})}>
                                    <LazyLoadImage className='product-img' src={(i.img) || ('img/img404.jpg')} effect='blur'/>
                                    <div className='wrapped-text'>
                                        <div className='product-title'>{i.title}</div>
                                        <div style={{ display: 'flex', flexWrap : 'wrap', flexDirection : 'column'}}>
                                            <div className='product-desc' style={{color: 'var(--blue)'}}>Verified : {moment.utc(i.createdAt).utcOffset('+07:00').format('MMMM DD, YYYY \t HH.mm A')}</div>
                                            <div className='wrapdet' style={{ position: 'unset', marginTop: '15px', marginLeft: '5px', gap: '5px' }}>
                                                <div style={{ backgroundColor: 'var(--background)', width: '95px', height: '30px', color: 'var(--blue)' }}>active</div>
                                                <div style={{ backgroundColor: 'var(--background)', width: '95px', height: '30px', color: 'var(--blue)' }}><i className='fa-solid fa-circle-check fa-lg'/></div>
                                             </div>
                                        </div>
                                        <div className='wrapped-details'>
                                            <div className='button price'>{convertPrice(i.price)}</div>
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
                        <div className='desc' style={{fontFamily: 'var(--quicksand)',fontSize: '0.85rem', color: 'var(--text)'}}>- already displays your products -</div>
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

export default Store