import Loading from "../../../utils/loading"
import Swaload from "../../../utils/swaload"
import swalert from "../../../utils/swalert"
import Context from "../../../utils/context"
import Topback from "../../components/topback"
import convertPrice from "../../../utils/price"
import { useContext, useEffect, useRef, useState } from "react"
import jwt from "jwt-decode"
import axios from "axios"
import "../../style/overview.css"

const Overview = () => {

    const endpoint = import.meta.env.VITE_API
    const context = useContext(Context)
    const bankref = useRef(null)
    const [data, setData] = useState('')
    const [loading, setLoading] = useState(false)

    const [bank, setBank] = useState(data.bank_name || '')
    const [rekening, setRekening] = useState(data.bank_number || '')

    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${endpoint}/contributor/overview/data`)
            const decode = jwt(response.data)
            setData(decode.data)
        } catch (error) {
            if (error || error.response) swalert(error.response.data, 'info', 3000)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { !data && getData() }, [])

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
                <div style={{width: '100%', display: 'flex', gap: '10px', marginTop: '10px'}}>
                    <select ref={bankref} style={{position: 'absolute', opacity: '0', left: '0', zIndex: '0'}} value={bank} onChange={(e) => setBank(e.target.value)} required>
                        <option value="" disabled>-- Select Bank --</option>
                        <option value="BCA">BCA</option>
                        <option value="Mandiri">Mandiri</option>
                        <option value="BRI">BRI</option>
                        <option value="BNI">BNI</option>
                    </select>
                    <div onClick={() => bankref.current.click()} className="button" style={{zIndex: '2', boxShadow: 'var(--boxshadow)',width: '110px', fontSize: '0.95rem', fontFamily: 'var(--quicksand)' ,height: '47px', borderRadius: '10px', backgroundColor: 'var(--primary)', color: 'var(--text)'}}>{data.bank_name || 'Bank'}</div>
                    <input type="text" style={{backgroundColor: 'var(--primary)', zIndex: '2', color: 'var(--text)', fontSize: '0.9rem', cursor: 'text'}} className="button-max" value={rekening} onChange={(e) => setRekening(e.target.value)} placeholder="rekening number"/>
                </div>
                </>
                }
            </div>
        </div>
    )
}

export default Overview