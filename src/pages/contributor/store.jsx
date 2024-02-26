import React, { useContext, useEffect, useState } from 'react'
import Context from '../../../utils/context'
import Topback from '../../components/topback'
import axios from "axios"

const Store = () => {

    const context = useContext(Context)
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API}/contributor/all/products`)
        .then((response) => console.log(response.data))
    }, [])

    return (
        <div className='page-max'>
            <Topback/>
        </div>
    )
}

export default Store