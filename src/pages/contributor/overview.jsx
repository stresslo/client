import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useRef, useState } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component"
import Loading from "../../../utils/loading"
import Swaload from "../../../utils/swaload"
import swalert from "../../../utils/swalert"
import Context from "../../../utils/context"
import Topback from "../../components/topback"
import convertPrice from "../../../utils/price"
import jwt from "jwt-decode"
import axios from "axios"
import "../../style/overview.css"
import getvxsrf from "../../../service/getvxsrf"

const Overview = () => {

    const endpoint = import.meta.env.VITE_API
    const refnumber = useRef(null)
    const context = useContext(Context)
    const navigate = useNavigate()

    const [page, setPage] = useState(1)
    const [products, setProducts] = useState([])
    const [data, setData] = useState('')
    
    const [bank, setBank] = useState('')
    const [rekening, setRekening] = useState('')
    const [editBank, setEditBank] = useState(false)
    const [loading, setLoading] = useState(false)

    const [vxsrf, setVxsrf] = useState('')

    const handle = {
        editBank : () => {
            setEditBank(true)
            const rek_bank = document.getElementById('rek_bank')
            rek_bank.removeAttribute('readonly')
            refnumber.current.focus()
        }
    }

    const update = async () => {
        try {
            const response = await axios.put(`${endpoint}/contributor/update`, {bank, rekening}, {
                headers: {'xsrf-token' : vxsrf}
            })
            swalert(response.data, 'success', 3000)
            .then((res) => res.dismiss && location.reload())
        } catch (error) {
            error || error.response && swalert(error.response.data, 'info', 3000)
        }
    }

    const getYours = async () => {
        if (!context.token && context.role != 'contributor') return swalert('please login to contributor account!', 'info', 3000)
        setLoading(true)
        axios.get(`${endpoint}/products/contributor/${page}`)
        .then(response => {const decode = jwt(response.data); setProducts(decode.data)})
        .catch(error => Promise.reject(error) && setProducts([]))
        .finally(() => setLoading(false))
    }

    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${endpoint}/contributor/overview/data`)
            const decode = jwt(response.data)
            setData(decode.data)
            setBank(decode.data.bank_name)
            setRekening(decode.data.bank_number)
        } catch (error) {
            if (error || error.response) swalert(error.response.data, 'info', 3000)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { !data && getData(); getYours(); getvxsrf().then((result) => setVxsrf(result)) }, [])
    if (loading) return <Loading/>

    return (
        <div className="page-max">
            <Topback/>
            <div className="form" style={{flexDirection: 'column'}}>
                <div className="itext" style={{marginTop: '10px', textAlign: 'center'}}>Balance</div>
                {(data) && 
                <>
                <div className="overview-card" style={{marginTop: '15px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <img src={context.img} style={{cursor: 'pointer', width: '35px', border: '2px solid var(--yellow)', height: '35px', objectFit: 'cover', borderRadius: '50%', boxSizing: 'border-box', boxShadow: 'var(--boxshadow)'}} alt="stresslo account" />
                        <div style={{fontSize: '1.2rem', color: 'var(--text)',}}>{data.username}</div>
                        <div className="overview-status" style={data.status == 'review' ? {color: 'var(--oren)'} : {color : 'var(--green)'}}>{data.status}</div>
                    </div>
                    <div style={{fontSize: '1.4rem', fontFamily: 'var(--poppins)', color: 'var(--yellow)', marginTop: '15px'}}>{convertPrice(data.amount)}</div>
                    <div style={{fontSize: '0.95rem', fontFamily: 'var(--poppins)', color: 'var(--text)', marginTop: '5px'}}>{(data.lastWithdraw ? data.lastWithdraw : 'No withdrawal history')}</div>
                    {(data.status != 'verified') &&
                    <div style={{fontSize: '0.8rem', color: 'var(--yellow)', marginTop: '30px'}}>*Your account is being reviewed by our team.</div>
                    }
                    {(data.status == 'verified') &&
                    <div className="button contact">Withdraw</div>
                    }
                </div>
                <div style={{width: '100%', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', position: 'relative'}}>
                    {(editBank) && 
                        <select style={{position: 'absolute', opacity: '0', left: '0', zIndex: '3', width: '90px', height: '47px'}} value={bank} onChange={(e) => setBank(e.target.value)} required>
                            <option value="" disabled>-- Select Bank --</option>
                            <option value="BCA">BCA</option>
                            <option value="Mandiri">Mandiri</option>
                            <option value="BRI">BRI</option>
                            <option value="BNI">BNI</option>
                        </select>
                    }
                    <div className="button" style={{zIndex: '2', boxShadow: 'var(--boxshadow)',width: '135px', fontSize: '0.95rem', fontFamily: 'var(--quicksand)' ,height: '47px', borderRadius: '10px', backgroundColor: 'var(--primary)', color: 'var(--text)'}}>{bank || 'Bank'}</div>
                    <input ref={refnumber} id="rek_bank" type="text" style={{backgroundColor: 'var(--primary)', zIndex: '2', color: 'var(--text)', fontSize: '0.9rem', cursor: 'text'}} className="button-max" value={rekening} onChange={(e) => setRekening(e.target.value)} placeholder="rekening number" readOnly/>
                    <div style={{color: 'var(--text)', cursor: 'pointer', marginLeft: '10px'}} onClick={() => handle.editBank()} className="fa-solid fa-pen-to-square fa-xl"/>
                </div>
                {(data.bank_name !== bank || data.bank_number !== rekening) &&
                <div style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
                    <div onClick={() => {
                        const rek_bank = document.getElementById('rek_bank')
                        rek_bank.setAttribute('readonly', true)
                        setEditBank(false)
                        setBank(data.bank_name)
                        setRekening(data.bank_number)
                    }} className="button-max" style={{borderRadius: '30px',boxShadow: 'var(--boxshadow)', height: '35px', fontSize: '0.95rem'}}>Cancel</div>
                    <div onClick={() => {update()}} className="button-max" style={{borderRadius: '30px',backgroundColor: 'var(--yellow)', height: '35px', boxShadow: 'var(--boxshadow)', fontSize: '0.95rem'}}>Save change</div>
                </div>
                }
                <div className="itext" style={{marginTop: '50px', textAlign: 'center'}}>Product review</div>
                <div style={{position : 'relative'}}>
                <div onClick={() => navigate('/contributor/store', {state : {prev: location.pathname}})} className="fa-solid fa-maximize fa-xl" style={{color : 'var(--text)', position: 'absolute', top: '-5px', right: '0' }} />
                <div className="overview-product" style={products.length !== 0 ? {marginTop: '20px', height: 'max-content'} : {marginTop: '20px', height: '200px'}}>
                    {(products.length != 0) ? 
                    products.map((i, key) => {
                        return (
                        <div onClick={() => navigate(`/product/details/${i.vid}`, {state: {...i, status : 'active', prev : location.pathname}})} key={key} className="overview-product-card">
                            <LazyLoadImage src={i.img} style={{height: '100px', width: '150px', objectFit: 'cover', borderRadius: '5px'}}/>
                            <div style={{color : 'var(--yellow)', fontSize: '0.9rem'}}>{i.paid} downloaded</div>
                        </div>
                        )
                    }): 
                    <div className="title" style={{fontSize: '0.8rem', margin: 'auto', fontFamily: 'var(--quicksand)'}}>you don't have product data yet.</div>}
                </div>
                <div onClick={() => navigate('/create', { state : {prev : location.pathname} })} className="button-max" style={{marginTop: '10px', backgroundColor: 'var(--yellow)', boxShadow: 'var(--boxshadow)'}}>
                    <div className="fa-solid fa-circle-plus fa-xl" style={{color: 'var(--background)'}}/>
                    create product
                </div>
                </div>
                </>
                }
            </div>
        </div>
    )
}

export default Overview