import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { LazyLoadImage } from "react-lazy-load-image-component"
import Topback from "../../components/topback"
import Loading from "../../../utils/loading"
import axios from "axios"
import jwt from "jwt-decode"

const Public = () => {

    const { vid } = useParams();
    const location = useLocation()
    const navigate = useNavigate()
    const url = `${import.meta.env.VITE_API}`
    const formatNumber = (number) => {return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");}
    
    const [data, setData] = useState('')
    const [product, setProduct] = useState([])
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
        if (!vid) return navigate('/')
        if (vid) {
            setLoading(true)
            axios.get(`${url}/contributor/profile/${vid}`)
            .then((response) => { const decode = jwt(response.data); setData(decode.data); setProduct(decode.data.product) })
            .catch((error) => { return Promise.reject(error) })
            .finally(() => setLoading(false))
        }
    }, [])

    if (loading) return <Loading/>

    return (
        <div className='page-max'>
            <div className="back" onClick={() => location ? navigate(location.state.prev, { state: { ...location.state, prev: `/product/${location.state.ctg}`  } }) : navigate('/')}>
                <div className="fa-solid fa-arrow-left fa-xl active"></div>
                <div className="nav-logo">
                    <h1>stresslo</h1>
                </div>
            </div>
            {(data) && 
            <div className='form' style={{flexDirection: 'column', marginTop: '80px'}}>
                <LazyLoadImage src={data.img || '/img/dui.jpg'} width={125} height={125} style={{borderRadius: '50%', objectFit: 'cover', boxSizing: 'border-box', marginTop: '50px', margin: 'auto'}}/>
                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '5px'}}>
                    <div className='itext' style={{marginTop: '5px', fontSize: '1.4rem'}}>{data.username}</div>
                    <div style={{color: 'var(--blue)', backgroundColor: 'var(--primary)'}} className='overview-status'>{formatNumber(data.points)} Points</div>
                </div>
                <div className='button-max' style={{backgroundColor: 'var(--background)', width: '90%', boxShadow: 'var(--boxshadow)', borderRadius: '30px', fontSize: '0.9rem', margin: '20px auto'}}>
                    <div style={
                        data.badge == 'Top contributor' ? { color: 'var(--green)' } :
                        data.badge == 'Superstar' ? { color: 'var(--yellow)' } :
                        { color: 'var(--blue)' }
                    }>{!data.badge.includes('contributor') ? `${data.badge} contributor` : `${data.badge}`}</div>
                </div>
                <div className='itext' style={{marginTop: '15px', textAlign: 'left'}}> <span>More</span> products </div>
                <div className="overview-product" style={product.length !== 0 ? {marginTop: '10px', height: '250px', flexWrap: 'wrap', flexDirection: 'column', overflow: 'hidden scroll'} : {marginTop: '10px', height: '200px'}}>
                        {(product.length != 0) ? 
                        product.map((i, key) => {
                            const titleSort = i.title.length >= 12 ? i.title.substring(0,12) + '...' : i.title
                            return (
                            <div onClick={() => navigate(`/product/details/${i.vid}`, {state: {...i, prev : location.pathname}})} key={key} className="overview-product-card">
                                <LazyLoadImage src={i.img} style={{height: '100px', width: '150px', objectFit: 'cover', borderRadius: '5px'}}/>
                                <div style={{color : 'var(--yellow)', fontSize: '0.9rem', textAlign: 'left'}}>{titleSort}</div>
                            </div>
                            )
                        }): 
                        <div className="title" style={{fontSize: '0.8rem', margin: 'auto', fontFamily: 'var(--quicksand)', textShadow: 'unset'}}>Contributor don't have product yet.</div>}
                    </div>  
            </div>
            }
        </div>
    )
}

export default Public;