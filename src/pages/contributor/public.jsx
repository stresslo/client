import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { LazyLoadImage } from "react-lazy-load-image-component"
import Topback from "../../components/topback"
import Loading from "../../../utils/loading"
import axios from "axios"
import jwt from "jwt-decode"

const Public = () => {

    const { vid } = useParams();
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
            <Topback location={-1}/>
            {(data) && 
            <div className='form' style={{flexDirection: 'column', alignItems: 'center'}}>
                <LazyLoadImage src={data.img || '/img/dui.jpg'} width={125} height={125} style={{borderRadius: '50%', objectFit: 'cover', boxSizing: 'border-box', marginTop: '30px'}}/>
                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '5px'}}>
                    <div className='itext' style={{marginTop: '5px', fontSize: '1.4rem'}}>{data.username}</div>
                    <div style={{color: 'var(--blue)', backgroundColor: 'var(--primary)'}} className='overview-status'>{formatNumber(data.points)} Points</div>
                </div>
                <div className='button-max' style={{backgroundColor: 'var(--background)', width: '90%', boxShadow: 'var(--boxshadow)', marginTop: '30px', borderRadius: '30px', fontSize: '0.9rem'}}>
                    <div style={
                        data.badge == 'Top contributor' ? { color: 'var(--green)' } :
                        data.badge == 'Expert' ? { color: 'var(--oren)' } :
                        data.badge == 'Superstar' ? { color: 'var(--yellow)' } :
                        { color: 'var(--blue)' }
                    }>{!data.badge.includes('contributor') ? `${data.badge} contributor` : `${data.badge}`}</div>
                </div>
            </div>
            }
        </div>
    )
}

export default Public;