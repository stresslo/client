import React, { useContext, useEffect } from 'react'
import Context from '../../../utils/context'
import Topback from '../../components/topback'

const Store = () => {

    const context = useContext(Context)
    useEffect(() => {
        context.axtoken(`${import.meta.env.VITE_API}/products/contributor/${context.vid}`)
        .then((res) => console.log(res))
    }, [])

    return (
        <div className='page-max'>
            <Topback/>
        </div>
    )
}

export default Store