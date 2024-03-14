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
                <LazyLoadImage src={data.img} width={150} height={150} style={{borderRadius: '50%', objectFit: 'cover', boxSizing: 'border-box', marginTop: '30px'}}/>
                <div className='itext' style={{marginTop: '5px', fontSize: '1.2rem'}}>{data.username}</div>
                <div className='button-max' style={{backgroundColor: 'var(--primary)', boxShadow: 'var(--boxshadow)', marginTop: '30px', borderRadius: '30px', fontSize: '1rem'}}>
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