import React, { useContext, useEffect, useState } from 'react'
import Context from '../../../utils/context'
import Topback from '../../components/topback'
import axios from "axios"

const Store = () => {

    const context = useContext(Context)
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API}/products/contributor/${page}`)
        .then((response) => console.log(response.data))
    }, [])

    return (
        <div className='page-max'>
            <Topback/>
        </div>
    )
}

export default Store