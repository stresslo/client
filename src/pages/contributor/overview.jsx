import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useRef, useState } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component"
import Loading from "../../../utils/loading"
import Swaload from "../../../utils/swaload"
import swalert from "../../../utils/swalert"
import Context from "../../../utils/context"
import Topback from "../../components/topback"
import convertPrice from "../../../utils/price"
import getvxsrf from "../../../service/getvxsrf"
import Swal from "sweetalert2"
import jwt from "jwt-decode"
import axios from "axios"
import "../../style/overview.css"

const Overview = () => {

    const vid = localStorage.getItem('vid')
    const endpoint = import.meta.env.VITE_API
    const refnumber = useRef(null)
    const context = useContext(Context)
    const navigate = useNavigate()

    const [page, setPage] = useState(1)
    const [withdraw, setWithdraw] = useState([])
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

    const logo = () => {
        if (bank == 'BCA') return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/2560px-Bank_Central_Asia.svg.png'
        if (bank == 'BRI') return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Logo_BRI.png/1200px-Logo_BRI.png'
        if (bank == 'BNI') return 'https://www.pikpng.com/pngl/b/489-4896877_logo-bank-bni-png-bank-negara-indonesia-clipart.png'
        if (bank == 'Mandiri') return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/2560px-Bank_Mandiri_logo_2016.svg.png'
    }

    const update = async () => {
        Swal.fire({
            icon: 'info',
            text : 'are you sure ?, your account will be reviewed again.',
            confirmButtonText : 'Update & review',
            showDenyButton: true,
            focusConfirm: false,
            focusDeny : false,
            reverseButtons : true,
            denyButtonText : 'Cancel',
            background : 'var(--primary)',
            color : 'var(--blue)',
            customClass : { container: 'alertext' },
            allowOutsideClick: false
        })
        .then(async (res) => {
            if (res.isConfirmed) {
                try {
                    const response = await axios.put(`${endpoint}/contributor/update`, {bank, rekening}, {
                        headers: {'xsrf-token' : vxsrf}
                    })
                    swalert(response.data, 'success', 3000)
                    .then((res) => res.dismiss && location.reload())
                } catch (error) {
                    error || error.response && swalert(error.response.data, 'info', 3000)
                }
            } else {
                const rek_bank = document.getElementById('rek_bank')
                rek_bank.setAttribute('readonly', true)
                setEditBank(false)
                setBank(data.bank_name)
                setRekening(data.bank_number)
            }
        })
    }

    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${endpoint}/contributor/overview/data/${vid}`)
            const decode = jwt(response.data)
            setData(decode.data)
            setBank(decode.data.bank_name)
            setProducts(decode.data.product)
            setWithdraw(decode.data.withdraw)
            setRekening(decode.data.bank_number)
        } catch (error) {
            return Promise.reject(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!vid) return navigate('/')
        !data && getData() 
        getvxsrf().then((result) => setVxsrf(result)) 
    }, [])
    if (loading) return <Loading/>

    return (
        <div className="page-max">
            <Topback/>
            <div className="form" style={{flexDirection: 'column'}}>
                {(data) && 
                <>
                <div className="itext" style={{marginTop: '10px'}}>Balance</div>
                <div style={{position: 'relative'}}>
                    {(!editBank) ? 
                        <div style={{color: 'var(--text)', cursor: 'pointer', position: 'absolute', top: '-5px', right: '0'}} onClick={() => handle.editBank()} className="fa-solid fa-pen-to-square fa-xl"/>
                        :
                        <div style={{color: 'var(--text)', cursor: 'pointer', position: 'absolute', top: '-5px', right: '0'}} onClick={() => {
                            const rek_bank = document.getElementById('rek_bank')
                            rek_bank.setAttribute('readonly', true)
                            setEditBank(false)
                            setBank(data.bank_name)
                            setRekening(data.bank_number)
                        }} className="fa-solid fa-circle-xmark fa-xl"/>
                    }
                    <div className="overview-card" style={{marginTop: '25px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <img src={context.img} style={{cursor: 'pointer', width: '35px', border: '2px solid var(--yellow)', height: '35px', objectFit: 'cover', borderRadius: '50%', boxSizing: 'border-box', boxShadow: 'var(--boxshadow)'}} alt="stresslo account" />
                            <div style={{fontSize: '1.2rem', color: 'var(--text)',}}>{data.username}</div>
                            <div className="overview-status" style={data.status == 'review' ? {color: 'var(--oren)'} : {color : 'var(--green)'}}>{data.status}</div>
                        </div>
                        <div style={{fontSize: '1.4rem', fontFamily: 'var(--poppins)', color: 'var(--yellow)', marginTop: '15px'}}>{convertPrice(data.amount)}</div>
                        <div style={{fontSize: '0.95rem', fontFamily: 'var(--poppins)', color: 'var(--text)', marginTop: '5px'}}>{(data.last_withdraw ? `Last withdraw : ${data.last_withdraw}` : 'No withdrawal history')}</div>
                        {(data.status != 'verified' && !data.bank_name || !data.bank_number) &&
                        <div style={{fontSize: '0.8rem', color: 'var(--yellow)', marginTop: '30px'}}>*Please complete your data.</div>
                        }
                        {(data.status != 'verified' && data.bank_name && data.bank_number) &&
                        <div style={{fontSize: '0.8rem', color: 'var(--yellow)', marginTop: '30px'}}>*Your account is being reviewed by our team.</div>
                        }
                        {(data.status == 'verified') &&
                        <div className="button contact" onClick={() => navigate('/contributor/withdraw', { state: data })}>Withdraw</div>
                        }
                    </div>
                </div>
                <div style={{width: '100%', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', position: 'relative'}}>
                    {(editBank) && 
                        <select style={{position: 'absolute', opacity: '0', left: '0', zIndex: '3', width: '90px', height: '43px'}} value={bank} onChange={(e) => setBank(e.target.value)} required>
                            <option value="" disabled>-- Select Bank --</option>
                            <option value="BCA">BCA</option>
                            <option value="Mandiri">Mandiri</option>
                            <option value="BRI">BRI</option>
                            <option value="BNI">BNI</option>
                        </select>
                    }
                    <div className="button" style={{zIndex: '2', boxShadow: 'var(--boxshadow)',width: '145px', fontSize: '0.95rem', fontFamily: 'var(--quicksand)' ,height: '43px', borderRadius: '10px', backgroundColor: 'var(--text)', color: 'var(--background)'}}>
                        {(!bank) ? 
                        <LazyLoadImage loading="lazy" effect="blur" width={26} src={'/img/bank.png'}/>
                        :
                        <LazyLoadImage loading="lazy" effect="blur" width={50} src={logo()}/>
                        }
                    </div>
                    <input ref={refnumber} id="rek_bank" type="text" style={{backgroundColor: 'var(--text)', zIndex: '2', height:'43px', color: 'var(--background)', fontSize: '0.9rem', cursor: 'text'}} className="button-max" value={rekening}  onChange={(e) => setRekening(e.target.value)} placeholder="rekening number" readOnly/>
                </div>
                {(data.bank_name !== bank || data.bank_number !== rekening) &&
                <div style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
                    <div onClick={() => {
                        const rek_bank = document.getElementById('rek_bank')
                        rek_bank.setAttribute('readonly', true)
                        setEditBank(false)
                        setBank(data.bank_name)
                        setRekening(data.bank_number)
                    }} className="button-max" style={{borderRadius: '30px',boxShadow: 'var(--boxshadow)', height: '35px', fontSize: '0.8rem'}}>Cancel</div>
                    <div onClick={() => {update()}} className="button-max" style={{borderRadius: '30px',backgroundColor: 'var(--yellow)', height: '35px', boxShadow: 'var(--boxshadow)', fontSize: '0.8rem'}}>Update</div>
                </div>
                }
                <div className="itext" style={{marginTop: '50px'}}>Product</div>
                <div style={{position : 'relative'}}>
                    <div onClick={() => navigate('/contributor/store', {state : {prev: location.pathname}})} style={{color : 'var(--text)', fontFamily: 'var(--poppins)', fontSize: '0.8rem', position: 'absolute', top: '-5px', right: '5px', cursor: 'pointer' }}>See all</div>
                    <div className="overview-product" style={products.length !== 0 ? {marginTop: '25px', height: '200px'} : {marginTop: '25px', height: '200px'}}>
                        {(products.length != 0) ? 
                        products.map((i, key) => {
                            return (
                            <div onClick={() => navigate(`/product/details/${i.vid}`, {state: {...i, status : 'active', prev : location.pathname}})} key={key} className="overview-product-card">
                                <LazyLoadImage src={i.img} style={{height: '100px', width: '150px', objectFit: 'cover', borderRadius: '5px'}}/>
                                <div style={{color : 'var(--yellow)', fontSize: '0.9rem', textAlign: 'center'}}>{i.paid} download</div>
                            </div>
                            )
                        }): 
                        <div className="title" style={{fontSize: '0.8rem', margin: 'auto', fontFamily: 'var(--quicksand)', textShadow: 'unset'}}>You don't have active product yet.</div>}
                    </div>
                    <div className="overview-product" style={{flexDirection: 'column', marginTop: '10px'}}>
                        <div style={{fontFamily: 'var(--poppins)', color: 'var(--text)', fontSize: '0.9rem'}}><span>Total product : </span> {data.total_product}</div>
                        <div style={{fontFamily: 'var(--poppins)', color: 'var(--text)', fontSize: '0.9rem'}}><span>Total pending : </span> {data.total_pending}</div>
                        <div style={{fontFamily: 'var(--poppins)', color: 'var(--text)', fontSize: '0.9rem'}}><span>Total downloaded : </span> {data.total_paid}</div>
                    </div>
                    <div onClick={() => navigate('/create', { state : {prev : location.pathname} })} className="button-max" style={{marginTop: '20px', backgroundColor: 'var(--yellow)', boxShadow: 'var(--boxshadow)'}}>
                        <div className="fa-solid fa-circle-plus fa-xl" style={{color: 'var(--background)'}}/>
                        create product
                    </div>
                </div>
                <div className="itext" style={{marginTop: '50px'}}>Withdraw history</div>
                <div style={{position : 'relative'}}>
                    <div style={{color : 'var(--text)', fontFamily: 'var(--poppins)', fontSize: '0.8rem', position: 'absolute', top: '-5px', right: '5px', cursor: 'pointer' }}>See all</div>
                    <div className="overview-product" style={withdraw.length !== 0 ? {marginTop: '25px', height: '200px', overflow: 'hidden scroll', flexDirection: 'column', flexWrap: 'unset', gap: '10px', padding: '10px 20px'} : {marginTop: '25px', height: '200px'}}>
                        {(withdraw.length != 0) ? 
                        withdraw.map((i, key) => {
                            return (
                            <div key={key} style={{width: '100%', height: 'max-content', backgroundColor: 'var(--primary)', boxShadow: 'var(--boxshadow)', borderRadius: '5px', padding: '10px', boxSizing: 'border-box'}}>
                                <div style={{color : 'var(--yellow)', fontSize: '1rem', fontFamily: 'var(--poppins)'}}>{convertPrice(i.total)}</div>
                                <div style={{color : 'var(--blue)', fontSize: '0.8rem', fontFamily: 'var(--poppins)'}}>{i.date} {i.time}</div>
                                <div className="overview-status" style={{color: 'var(--green)', marginTop: '15px', width: 'max-content'}}>success</div>
                            </div>
                            )
                        }): 
                        <div className="title" style={{fontSize: '0.8rem', margin: 'auto', fontFamily: 'var(--quicksand)', textShadow: 'unset'}}>No withdrawal history.</div>}
                    </div>
                    <div className="overview-product" style={{flexDirection: 'column', marginTop: '10px'}}>
                        <div style={{fontFamily: 'var(--poppins)', color: 'var(--text)', fontSize: '0.9rem'}}> <span>Total income : </span> {convertPrice(data.total_income)}</div>
                        <div style={{fontFamily: 'var(--poppins)', color: 'var(--text)', fontSize: '0.9rem'}}> <span>Current balance : </span> {convertPrice(data.amount)}</div>
                    </div>
                </div>
                </>
                }
            </div>
        </div>
    )
}

export default Overview