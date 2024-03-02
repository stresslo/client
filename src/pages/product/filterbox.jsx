import { useState } from "react"
import "../../style/filterbox.css"

const FilterBox = () => {

    const [tech, setTech] = useState('')
    const [pricing, setPricing] = useState('')

    return (
        <div className='filter-box'>
            <div onClick={() => { document.querySelector('.filter-box').classList.remove('show') }} className="fa-solid fa-close fa-xl" style={{position : 'absolute', top: '25px', right: '20px', color: 'var(--text)', cursor: 'pointer'}}/>
            <div style={{width: '100%', height: 'max-content', overflow: 'hidden scroll'}}>
                <div className="itext" style={{fontSize: '1.2rem', color: 'var(--blue)'}}>Pricing</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px 0px', paddingBottom: '30px'}}>
                    <div className="button" style={ tech === 'free' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--green)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => setTech('free')}>Free</div>
                    <div className="button" style={ tech === 'paid' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--oren)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => setTech('paid')}>Paid</div>
                </div>
                {(pricing === 'paid') && (
                <>
                <div className="itext" style={{fontSize: '1.2rem', color: 'var(--blue)'}}>Price Range</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px 0px', paddingBottom: '30px'}}>
                    <input type="range" min={0} max={100} step={1} style={{width: '400px'}}/>
                </div>
                </>
                )}
                <div className="itext" style={{fontSize: '1.2rem', color: 'var(--blue)'}}>Framework</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px 0px', paddingBottom: '30px'}}>
                    <div className="button" style={ tech === 'react' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => setTech('react')}>React</div>
                    <div className="button" style={ tech === 'angular' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => setTech('angular')}>Angular</div>
                    <div className="button" style={ tech === 'html' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => setTech('html')}>HTML</div>
                    <div className="button" style={ tech === 'vue' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => setTech('vue')}>Vue</div>
                    <div className="button" style={ tech === 'svelte' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => setTech('svelte')}>Svelte</div>
                    <div className="button" style={ tech === 'next' ? {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'} : {borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'unset', border: '1px solid var(--blue)', color : 'var(--blue)'}} onClick={() => setTech('next')}>Next JS</div>
                </div>
            </div>
        </div>
    )
}

export default FilterBox