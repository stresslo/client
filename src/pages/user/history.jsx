import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import convertPrice from "../../../utils/price"
import Topback from "../../components/topback"
import swalert from "../../../utils/swalert"
import Swaload from "../../../utils/swaload"
import jwt from "jwt-decode"
import moment from "moment"
import axios from "axios"
import "../../style/history.css"

const History = () => {

    const navigate = useNavigate()
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API}/transaction/history/${page}`)
            const decode = jwt(response.data)
            if (decode.data.length !== 0) {
                setData(decode.data)
                let plus = 0
                decode.data.forEach(index => {
                    plus += index.product_amount
                })
                setTotal(plus)
            }
        } catch (error) {
            if (error || error.response) {
                swalert(error.response.data || "Forbidden request", 'error', 2000)
            }
        } finally {setLoading(false)}
    }

    useEffect(() => {getData()}, [page])

    return (
        <div className="page-max">
            <Topback/>
            <div className="form" style={{marginTop: '70px'}}>
                <div className="product-container">
                {(data.length >= 10) ? 
                    <div style={{ display: 'flex', gap: '20px', marginTop: '50px', alignItems: 'center', justifyContent: 'center' }}>
                        {(page !== 1) && <div className='button' onClick={() => setPage(page -1)} style={{borderRadius: '10px', height : '35px', backgroundColor: 'var(--primary)', color: 'var(--blue)'}}>
                            <h3 style={{fontFamily: 'var(--quicksand)', fontSize: '1.2rem', color: 'var(--blue)'}}>{page -1}</h3>
                            <div className='fa-solid fa-left-long fa-xl'/>
                        </div>}
                        {(page !== 1) && <h3 style={{fontFamily: 'var(--quicksand)', fontSize: '1.2rem', color: 'var(--blue)', margin: '0 10px'}}>{page}</h3>}
                        <div className='button' onClick={() => setPage(page +1)} style={{borderRadius: '10px', height : '35px', backgroundColor: 'var(--primary)', color: 'var(--blue)'}}>
                            <div className='fa-solid fa-right-long fa-xl'/>
                            <h3 style={{fontFamily: 'var(--quicksand)', fontSize: '1.2rem', color: 'var(--blue)'}}>{page +1}</h3>
                        </div>
                    </div>
                :
                <div style={{ display: 'flex', gap: '20px', marginTop: '45px', alignItems: 'center', justifyContent: 'center' }}>
                        {(page === 1) ? 
                        <div className='desc' style={{fontFamily: 'var(--quicksand)',fontSize: '0.85rem', color: 'var(--text)'}}>- already displays all transaction -</div>
                        :
                        <div className='button' onClick={() => setPage(page -1)} style={{borderRadius: '10px', height : '35px', backgroundColor: 'var(--primary)', color: 'var(--blue)'}}>
                            <h3 style={{fontFamily: 'var(--quicksand)', fontSize: '1.2rem', color: 'var(--blue)'}}>{page -1}</h3>
                            <div className='fa-solid fa-left-long fa-xl'/>
                        </div>
                        }
                    </div>
                }
                </div>
                <div className="input-form" style={{marginTop: '40px', flexDirection: 'column'}}>
                    {loading ? (<Swaload.Transaction/>) : 
                        data.length !== 0 && data.map((i, k) => {
                            const now = moment(i.updatedAt)
                            const date = now.isSame(moment(), 'day') ? "Today" : now.subtract(1, 'days').isSame(moment(), 'day') ? "Yesterday" : now.format("MMM DD, YYYY");
                            const time = moment.utc(i.updatedAt).utcOffset("+07:00").format("HH:mm A")
                            return (
                            <div className="box-history" key={k} onClick={() => navigate(`/transaction/result/${i.order_id}`, {state: i})}>
                                <div className="itext" style={{color: 'var(--yellow)'}}>{convertPrice(i.product_amount)}</div>
                                <div className="itext" style={{fontFamily: 'var(--quicksand)', fontSize: '1.1rem', translate: '0 -5px'}}> <span>Order ID</span> : {i.order_id}</div>
                                <div className= "badge" style={{position: 'absolute', bottom: '0', left: '15px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    <div className="fa-solid fa-circle-check fa-lg" style={{color: 'var(--blue)'}}/>
                                    <div className="desc" style={{color: 'var(--blue)', fontFamily: 'var(--quicksand)', fontSize: '0.9rem'}}>{date} {time}</div>
                                </div>
                            </div>
                            )
                        })
                    }
                </div>
                <div style={{fontSize: '1.1rem', fontFamily: 'var(--quicksand)', color: 'var(--blue)', textAlign: 'center'}}>Total of expenses : {convertPrice(total)}</div>
                <div className="title" style={{textAlign: 'center'}}><span>Order</span> History</div>
            </div>
        </div>
    )
}

export default History