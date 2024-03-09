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
                <div className="itext">Overview</div>
                {(data) && 
                <div className="overview-card">
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <img onClick={() => navigate('/profile')} src={context.img} style={{cursor: 'pointer', width: '35px', border: '2px solid var(--yellow)', height: '35px', objectFit: 'cover', borderRadius: '50%', boxSizing: 'border-box', boxShadow: 'var(--boxshadow)'}} alt="stresslo account" />
                        <div style={{fontSize: '0.9rem', color: 'var(--yellow)'}}></div>
                    </div>
                    <div style={{fontSize: '1rem', fontFamily: 'var(--poppins)', color: 'var(--text)', marginTop: '10px'}}>Balance : {convertPrice(data.amount)}</div>
                    <div className="button contact">Withdraw</div>
                </div>
                }
            </div>
        </div>
    )
}

export default Overview