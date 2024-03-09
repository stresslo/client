import Loading from "../../../utils/loading"
import Swaload from "../../../utils/swaload"
import swalert from "../../../utils/swalert"
import Context from "../../../utils/context"
import Topback from "../../components/topback"
import convertPrice from "../../../utils/price"
import { useContext, useEffect, useState } from "react"
import jwt from "jwt-decode"
import axios from "axios"
import "../../style/overview.css"

const Overview = () => {

    const endpoint = import.meta.env.VITE_API
    const context = useContext(Context)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState('')

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
                <div className="itext" style={{marginTop: '10px', textAlign: 'center'}}>Overview</div>
                {(data) && 
                <div className="overview-card" style={{marginTop: '15px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <img src={context.img} style={{cursor: 'pointer', width: '35px', border: '2px solid var(--yellow)', height: '35px', objectFit: 'cover', borderRadius: '50%', boxSizing: 'border-box', boxShadow: 'var(--boxshadow)'}} alt="stresslo account" />
                        <div style={{fontSize: '1.2rem', color: 'var(--yellow)',}}>{data.username}</div>
                        <div className="overview-status" style={data.status == 'review' ? {color: 'var(--oren)'} : {color : 'var(--green)'}}>{data.status}</div>
                    </div>
                    <div style={{fontSize: '1.2rem', fontFamily: 'var(--poppins)', color: 'var(--text)', marginTop: '15px'}}>Balance : {convertPrice(data.amount)}</div>
                    <div style={{fontSize: '0.95rem', fontFamily: 'var(--poppins)', color: 'var(--text)', marginTop: '5px'}}>{(data.lastWithdraw ? data.lastWithdraw : 'No withdrawal history')}</div>
                    {(data.status != 'verified') &&
                    <div style={{fontSize: '0.8rem', color: 'var(--yellow)', marginTop: '30px'}}>*data is incomplete, please complete your data</div>
                    }
                    {(data.status == 'verified') &&
                    <div className="button contact">Withdraw</div>
                    }
                </div>
                }
            </div>
        </div>
    )
}

export default Overview