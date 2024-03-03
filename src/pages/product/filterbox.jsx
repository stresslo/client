import convertPrice from "../../../utils/price"
import { useEffect, useState } from "react"
import "../../style/filterbox.css"
import axios from "axios"

const FilterBox = ({ filterHistory , setLoading, setUpdate, setData, page, ctg }) => {

    const [forceUpdate, setForceUpdate] = useState(false)

    const [price, setPrice] = useState(filterHistory ? filterHistory.price : 0)
    const [tech, setTech] = useState(filterHistory ? filterHistory.tech : 'all')
    const [pricing, setPricing] = useState(filterHistory ? filterHistory.pricing : 'all')
    const [optprice, setOptprice] =  useState(filterHistory ? filterHistory.optprice : 'all')

    const getFilteredData = async () => {
        const endpoint = `${import.meta.env.VITE_API}/product/filter/${ctg}/${pricing}/${tech}/${price}/${optprice}/${page}`
        if (tech !== "all" || price || pricing !== 'all' || optprice !== 'all') {
            try {
                setLoading(true)
                const response = await axios.get(endpoint)
                localStorage.setItem('filterHistory', JSON.stringify({tech, price, pricing, optprice}))
                setForceUpdate(true)
                setUpdate(true)
                document.querySelector('.filter-box').classList.remove('show')
                setData(response.data)
            } catch (error) {
                return false;
            } finally {
                setLoading(false)
            }
        } else {
            return false;
        }
    }

    useEffect(() => { return () =>  {setForceUpdate(false)} }, [forceUpdate])

    return (
        <div className='filter-box'>
            <div style={{position: 'absolute', top: '30px', right: '20px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap : '10px'}}>
                <div onClick={() => { document.querySelector('.filter-box').classList.remove('show') }} className="fa-solid fa-close fa-2xl" style={{color: 'var(--text)', cursor: 'pointer'}}/>
            </div>
            <div style={{width: '100%', height: 'max-content', marginTop: '20px'}}>
                <div className="itext" style={{fontSize: '1.2rem', color: 'var(--blue)'}}>Pricing</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px 0px', paddingBottom: '35px'}}>
                    <div className="button" style={ pricing === 'all' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--yellow)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => {setPricing('all'); price !== 0 && setPrice(0)}}>All</div>
                    <div className="button" style={ pricing === 'paid' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--oren)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => {setPricing('paid'); setPrice(10000); setOptprice('under')}}>Paid</div>
                    <div className="button" style={ pricing === 'free' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--green)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => {setPricing('free'); price !== 0 && setPrice(0)}}>Free</div>
                </div>
                {(pricing === 'paid') && (
                <>
                <div className="itext" style={{fontSize: '1.2rem', color: 'var(--blue)'}}>Price Range</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px 0'}}>
                    <div className="button" style={ optprice === 'under' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--green)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => setOptprice('under')}>Under</div>
                    <div className="button" style={ optprice === 'above' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--oren)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => setOptprice('above')}>Above</div>
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', paddingBottom: '35px'}}>
                    <input type="range" value={price} min={10000} max={1000000} step={5000} onChange={(e) => setPrice(e.target.value)} style={{width: '400px'}}/>
                    <div className="itext" style={{fontSize: '0.95rem', color: 'var(--blue)'}}>{convertPrice(price)}</div>
                </div>
                </>
                )}
                <div className="itext" style={{fontSize: '1.2rem', color: 'var(--blue)'}}>Framework</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px 0px', paddingBottom: '35px'}}>
                    <div className="button" style={ tech === 'react' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => setTech('react')}>React</div>
                    <div className="button" style={ tech === 'angular' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => setTech('angular')}>Angular</div>
                    <div className="button" style={ tech === 'html' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => setTech('html')}>HTML</div>
                    <div className="button" style={ tech === 'vue' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => setTech('vue')}>Vue</div>
                    <div className="button" style={ tech === 'svelte' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => setTech('svelte')}>Svelte</div>
                    <div className="button" style={ tech === 'next' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => setTech('next')}>Next JS</div>
                    {(tech !== 'all') && 
                        <div className="button" style={{borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--second)'}} onClick={() => setTech('all')}>
                            <div className="fa-solid fa-close fa-lg" />
                        </div>
                    }
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', paddingTop: '20px'}}>
                    {(price || pricing !== 'all' || tech !== 'all' || optprice !== 'all') && (
                    <div className="button-max" style={{borderRadius: '30px'}} onClick={() => {
                        setUpdate(true)
                        setForceUpdate(true)
                        localStorage.removeItem('filterHistory')
                    }}>Reset</div>
                    )}
                    <div onClick={() => getFilteredData()} style={{width: '500px', display: 'flex', gap : '5px'}}>
                        <div className="button-max" style={(tech !== 'all' || price || pricing !== 'all' ) ? {backgroundColor: 'var(--yellow)', borderRadius: '30px'} : { backgroundColor: '#aaa' }}>Apply Filter</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FilterBox