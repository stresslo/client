import { useEffect, useState } from "react"
import "../../style/filterbox.css"
import convertPrice from "../../../utils/price"

const FilterBox = ({ setUpdate }) => {

    const filterHistory = JSON.parse(localStorage.getItem('filterHistory'))
    const [forceUpdate, setForceUpdate] = useState(false)

    const [tech, setTech] = useState(filterHistory ? filterHistory.tech : '')
    const [price, setPrice] = useState(filterHistory ? filterHistory.price : 0)
    const [pricing, setPricing] = useState(filterHistory ? filterHistory.pricing : '')
    const [optprice, setOptprice] =  useState(filterHistory ? filterHistory.optprice : '')

    const getFilteredData = async () => {
        localStorage.setItem('filterHistory', JSON.stringify({tech, price, pricing, optprice}))
        setForceUpdate(true)
    }

    useEffect(() => { return () => {
        setUpdate(false)
        setForceUpdate(false)
    } 
    }, [forceUpdate])

    return (
        <div className='filter-box'>
            <div onClick={() => { document.querySelector('.filter-box').classList.remove('show') }} className="fa-solid fa-close fa-2xl" style={{position : 'absolute', top: '30px', right: '20px', color: 'var(--text)', cursor: 'pointer'}}/>
            <div style={{width: '100%', height: 'max-content', marginTop: '10px'}}>
                <div className="itext" style={{fontSize: '1.2rem', color: 'var(--blue)'}}>Pricing</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px 0px', paddingBottom: '35px'}}>
                    <div className="button" style={ pricing === 'free' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--green)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => {setPricing('free'); price !== 0 && setPrice(0)}}>Free</div>
                    <div className="button" style={ pricing === 'paid' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--oren)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => {setPricing('paid'); setPrice(10000)}}>Paid</div>
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
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', paddingTop: '30px'}}>
                    <div onClick={() => getFilteredData()} style={{width: '500px'}}><div className="button-max" style={(tech || price || pricing ) ? {backgroundColor: 'var(--yellow)'} : { backgroundColor: '#aaa' }}>Apply Filter</div></div>
                </div>
            </div>
        </div>
    )
}

export default FilterBox