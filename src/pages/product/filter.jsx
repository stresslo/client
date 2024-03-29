import convertPrice from "../../../utils/price"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import jwt from "jwt-decode"
import "../../style/filterbox.css"

const FilterBox = ({ filterHistory , setLoading, setUpdate, setData, setPage, page, ctg }) => {

    const navigate = useNavigate()
    const [forceUpdate, setForceUpdate] = useState(false)

    const [price, setPrice] = useState(filterHistory ? filterHistory.price : 0)
    const [tech, setTech] = useState(filterHistory ? filterHistory.tech : 'all')
    const [pricing, setPricing] = useState(filterHistory ? filterHistory.pricing : 'all')
    const [optprice, setOptprice] =  useState(filterHistory ? filterHistory.optprice : 'all')

    const getFilteredData = async () => {
        setPage(1)
        const endpoint = `${import.meta.env.VITE_API}/product/filter/${ctg}/${pricing}/${tech}/${price}/${optprice}/1`
        if (tech !== "all" || price || pricing !== 'all' || optprice !== 'all') {
            try {
                setLoading(true)
                document.querySelector('.filter-box').classList.remove('show')
                localStorage.setItem('filterHistory', JSON.stringify({tech, price, pricing, optprice}))
                const response = await axios.get(endpoint)
                setForceUpdate(true)
                setUpdate(true)
                const decode = jwt(response.data)
                setData(decode.data)
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
            <div style={{position: 'absolute', top: '30px', right: '25px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap : '10px', zIndex: '10'}}>
                <div onClick={() => { document.querySelector('.filter-box').classList.remove('show') }} className="fa-solid fa-close fa-2xl" style={{color: 'var(--text)', cursor: 'pointer'}}/>
            </div>
            <div style={{width: '100%', height: 'max-content', marginTop: '20px'}}>
                <div className="itext" style={{fontSize: '1.2rem', color: 'var(--text)'}}>Pricing</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px 0px', paddingBottom: '35px'}}>
                    <div className="button" style={ pricing === 'all' ? {borderRadius: '10px', width: '85px', height:  '0' , padding: '20px 0',boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: '85px', height: '0', padding: '20px 0', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => {setPricing('all'); price !== 0 && setPrice(0); setOptprice('all')}}>All</div>
                    <div className="button" style={ pricing === 'paid' ? {borderRadius: '10px', width: '85px', height: '0' ,padding: '20px 0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: '85px', height: '0', padding: '20px 0', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => {setPricing('paid'); setPrice(10000); setOptprice('under')}}>Paid</div>
                    <div className="button" style={ pricing === 'free' ? {borderRadius: '10px', width: '85px', height: '0' ,padding: '20px 0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: '85px', height: '0', padding: '20px 0', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => {setPricing('free'); price !== 0 && setPrice(0); setOptprice('all')}}>Free</div>
                </div>
                {(pricing === 'paid') && (
                    <>
                <div className="itext" style={{fontSize: '1.2rem', color: 'var(--text)'}}>Price Range</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px 0'}}>
                    <div className="button" style={ optprice === 'under' ? {borderRadius: '10px', width: '85px', height: '0',padding: '20px 0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: '85px', height: '0', padding: '20px 0', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => {setOptprice('under')}}>Under</div>
                    <div className="button" style={ optprice === 'above' ? {borderRadius: '10px', width: '85px', height: '0',padding: '20px 0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: '85px', height: '0', padding: '20px 0', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => {setOptprice('above')}}>Above</div>
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', paddingBottom: '35px'}}>
                    <input type="range" value={price} min={10000} max={1000000} step={5000} onChange={(e) => setPrice(e.target.value)} style={{width: '400px'}}/>
                    <div className="itext" style={{fontSize: '0.95rem', color: 'var(--text)'}}>{optprice == 'under' ? '<' : '>'} {convertPrice(price)}</div>
                </div>
                </>
                )}
                <>
                <div className="itext" style={{fontSize: '1.2rem', color: 'var(--text)'}}>Category</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px 0px', paddingBottom: '35px'}}>
                    <div className="button" style={ ctg === 'all' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px    ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => ctg !== 'all' && navigate('/product/all')}>All</div>
                    <div className="button" style={ ctg === 'Web' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px   ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => ctg !== 'Web' && navigate('/product/Web')}>Web Template</div>
                    <div className="button" style={ ctg === 'Motion' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px  ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => ctg !== 'Motion' && navigate('/product/Motion')}>Motion Graphic</div>
                    <div className="button" style={ ctg === '3D' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px   ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => ctg !== '3D' && navigate('/product/3D')}>3D</div>
                    <div className="button" style={ ctg === 'Vector' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => ctg !== 'Vector' && navigate('/product/Vector')}>Vector</div>
                </div>
                </>
                {(ctg == 'Web') && <>
                <div className="itext" style={{fontSize: '1.2rem', color: 'var(--text)'}}>Framework</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px 0px', paddingBottom: '35px'}}>
                    <div className="button" style={ tech === 'all' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px    ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => setTech('all')}>All</div>
                    <div className="button" style={ tech === 'html' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px   ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => setTech('html')}>HTML & CSS</div>
                    <div className="button" style={ tech === 'react' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px  ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => setTech('react')}>React JS</div>
                    <div className="button" style={ tech === 'next' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px   ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => setTech('next')}>Next JS</div>
                    <div className="button" style={ tech === 'angular' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => setTech('angular')}>Angular JS</div>
                    <div className="button" style={ tech === 'vue' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px    ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => setTech('vue')}>Vue JS</div>
                    <div className="button" style={ tech === 'svelte' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => setTech('svelte')}>Svelte JS</div>
                </div>
                </>}
                {(ctg == 'Motion') && <>
                <div className="itext" style={{fontSize: '1.2rem', color: 'var(--text)'}}>Software</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px 0px', paddingBottom: '35px'}}>
                    <div className="button" style={ tech === 'all' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px    ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => setTech('all')}>All</div>
                    <div className="button" style={ tech === 'Adobe After Effect' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px   ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => setTech('Adobe After Effect')}>After Effect</div>
                    <div className="button" style={ tech === 'DaVinci Resolve' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px  ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => setTech('DaVinci Resolve')}>DaVinci Resolve</div>
                    <div className="button" style={ tech === 'Blender' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px   ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => setTech('Blender')}>Blender</div>
                    <div className="button" style={ tech === 'Apple Motion' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => setTech('Apple Motion')}>Apple Motion</div>
                    <div className="button" style={ tech === 'Cinema 4D' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px    ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => setTech('Cinema 4D')}>Cinema 4D</div>
                </div>
                </>}
                {(ctg == 'Vector') && <>
                <div className="itext" style={{fontSize: '1.2rem', color: 'var(--text)'}}>Software</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px 0px', paddingBottom: '35px'}}>
                    <div className="button" style={ tech === 'all' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px    ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => setTech('all')}>All</div>
                    <div className="button" style={ tech === 'Adobe Illustration' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px   ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() => setTech('Adobe Illustration')}> Adobe Illustration</div>
                    <div className="button" style={ tech === 'Corel Draw' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px  ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() =>          setTech('Corel Draw')}>         Corel Draw</div>
                    <div className="button" style={ tech === 'Pixelmator Pro' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px   ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() =>     setTech('Pixelmator Pro')}>     Pixelmator Pro</div>
                    <div className="button" style={ tech === 'Affinity Designer' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() =>     setTech('Affinity Designer')}>  Affinity Designer</div>
                </div>
                </>}
                {(ctg == '3D') && <>
                <div className="itext" style={{fontSize: '1.2rem', color: 'var(--text)'}}>Software</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px 0px', paddingBottom: '35px'}}>
                    <div className="button" style={ tech === 'all' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px    ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() =>             setTech('all')}>All</div>
                    <div className="button" style={ tech === 'Sketchup' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px   ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() =>         setTech('Sketchup')}> Sketchup</div>
                    <div className="button" style={ tech === 'Blender' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px  ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() =>           setTech('Blender')}>  Blender</div>
                    <div className="button" style={ tech === 'Autodesk Maya' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px   ', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() =>    setTech('Autodesk Maya')}> Autodesk Maya</div>
                    <div className="button" style={ tech === 'Cinema 4D' ? {borderRadius: '10px', width: 'max-content', padding: '20px 15px', height: '0', boxShadow: 'unset', backgroundColor: 'var(--yellow)', color : 'var(--primary)'} : {borderRadius: '10px', width: 'max-content', height: '0', padding: '20px 15px', boxShadow: 'unset', backgroundColor: 'var(--prime)', color : '#aaa'}} onClick={() =>           setTech('Cinema 4D')}>   Cinema 4D</div>
                </div>
                </>}
                <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', paddingTop: '20px'}}>
                    <div style={{width: '500px', display: 'flex', gap : '5px'}}>
                        {(price || pricing !== 'all' || tech !== 'all' || optprice !== 'all') && (
                        <div className="button-max" style={{borderRadius: '30px', height: '40px'}} onClick={() => {
                            setPrice(0)
                            setTech('all')
                            setPricing('all')
                            setOptprice('all')
                        }}>Reset</div>
                        )}
                        <div className="button-max" onClick={() => getFilteredData()} style={(tech !== 'all' || price || pricing !== 'all' ) ? {backgroundColor: 'var(--yellow)', borderRadius: '30px', height: '40px', color: 'var(--primary)'} : { backgroundColor: '#aaa', height: '40px' , color: 'var(--primary)'}}>Apply</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FilterBox