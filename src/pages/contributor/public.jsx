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
            <div className='form' style={{flexDirection: 'column'}}>
                <LazyLoadImage src={data.img} width={100} height={100} style={{borderRadius: '50%', objectFit: 'cover', boxSizing: 'border-box'}}/>
                <div className='itext'>{data.username}</div>
            </div>
            }
        </div>
    )
}

export default Public;