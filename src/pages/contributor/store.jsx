import React, { useContext, useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component' 
import { useLocation, useNavigate } from 'react-router-dom'
import Swaload from '../../../utils/swaload'
import Context from '../../../utils/context'
import Topback from '../../components/topback'
import convertPrice from "../../../utils/price"
import swalert from "../../../utils/swalert"
import jwt from "jwt-decode"
import moment from "moment"
import axios from "axios"

const Store = () => {

    const location = useLocation()
    const navigate = useNavigate()
    const context = useContext(Context)
    const statusHistory = localStorage.getItem('statusHistory')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(statusHistory ? statusHistory : 'active')
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)

    const endpoint = () => {
        let url = `${import.meta.env.VITE_API}`
        if (status == 'active') url += `/products/contributor/${page}`
        if (status == 'pending') url += `/products/contributor/pending/${page}`
        if (status == 'rejected') url += `/products/contributor/rejected/${page}`
        return url;
    }

    const getYours = async () => {
        if (!context.token && context.role != 'contributor') return swalert('please login to contributor account!', 'info', 3000)
        setLoading(true)
        axios.get(endpoint())
        .then(response => {const decode = jwt(response.data); setData(decode.data)})
        .catch(error => Promise.reject(error) && setData([]))
        .finally(() => setLoading(false))
    }

    useEffect(() => { getYours(); localStorage.setItem('statusHistory', status) }, [page, status])

    return (
        <div className='page-max'>
            <Topback location={location.state ? location.state.prev : '/'}/>
            <div onClick={() => navigate('/create')} style={{position: 'fixed', bottom: '30px', right: '20px', color: 'var(--yellow)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', zIndex: '10'}}>
                <div style={{fontSize: '1rem', fontFamily: 'var(--poppins)'}}>Create</div>
                <div className='fa-solid fa-circle-plus fa-2xl'/>
            </div>
            <div className='product-page' style={{paddingBottom: '0', marginTop: '30px'}}>
                <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '50px'}}>
                    <div className='itext' style={{color: 'var(--yellow)'}}>Status</div>
                    <div style={{marginTop: '5px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontFamily: 'var(--quicksand)'}}>
                        <div className='button' onClick={() => setStatus('active')} style={ status == 'active' ? {backgroundColor: 'var(--primary)', height: '35px', color: 'var(--green)', fontSize: '0.8rem'} : {backgroundColor: 'unset', height: '35px', color: 'var(--text)', fontSize: '0.8rem'}}>Active</div>
                        <div className='button' onClick={() => setStatus('pending')} style={status == 'pending' ? {backgroundColor: 'var(--primary)', height: '35px', color: 'var(--blue)', fontSize: '0.8rem'} : {backgroundColor: 'unset', height: '35px', color: 'var(--text)', fontSize: '0.8rem'}}>Pending</div>
                        <div className='button' onClick={() => setStatus('rejected')} style={status == 'rejected' ? {backgroundColor: 'var(--primary)', height: '35px', color: 'var(--oren)', fontSize: '0.8rem'} : {backgroundColor: 'unset', height: '35px', color: 'var(--text)', fontSize: '0.8rem'}}>Rejected</div>
                    </div>
                </div>
                <div className='product-container' style={{flexDirection: 'column'}}>
                    {(loading) ? (
                    <Swaload.Product/>
                    ) : (
                        data && data.map((i, index) => {
                            return(
                                <div className='product-card' key={index} onClick={() => navigate(`/product/details/${i.vid}`, {state: {...i, status : status, prev : location.pathname}})}>
                                    <LazyLoadImage className='product-img' src={(i.img) || ('img/img404.jpg')} effect='blur'/>
                                    <div className='wrapped-text'>
                                        <div className='product-title'>{i.title}</div>
                                        <div style={{ display: 'flex', flexWrap : 'wrap', flexDirection : 'column'}}>
                                            <div className='product-desc' style={{color: 'var(--blue)',fontFamily: 'var(--quicksand)', fontSize: '0.9rem'}}>{moment.utc(i.createdAt).utcOffset('+07:00').format('MMMM DD, YYYY \t HH:mm A')}</div>
                                            <div className='wrapdet' style={{ position: 'unset', marginTop: '15px', marginLeft: '5px', gap: '5px' }}>
                                                <div style={{ backgroundColor: 'var(--background)', width: '95px', height: '30px', color: 'var(--blue)' }}>{status}</div>
                                                {(status === 'active') && <div style={{ backgroundColor: 'var(--background)', width: '95px', height: '30px', color: 'var(--blue)' }}><i className='fa-solid fa-circle-check fa-lg'/></div>}
                                                {(status === 'pending') && <div style={{ backgroundColor: 'var(--background)', width: '95px', height: '30px', color: 'var(--blue)' }}><i className='fa-solid fa-clock fa-lg'/></div>}
                                                {(status === 'rejected') && <div style={{ backgroundColor: 'var(--background)', width: '95px', height: '30px', color: 'var(--blue)' }}><i className='fa-solid fa-circle-xmark fa-lg'/></div>}
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
                    {(page !== 1) && 
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