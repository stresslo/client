import { useEffect, useState } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { useLocation, useNavigate } from "react-router-dom"
import Topback from "../../components/topback"
import axios from "axios"
import getvxsrf from "../../../service/getvxsrf"
import swalert from "../../../utils/swalert"

const Withdraw = () => {

    const formatPrice = (value) => { return `Rp ${Number(value).toLocaleString('id-ID')}`};
    const navigate = useNavigate()
    const location = useLocation()

    const [state, setState] = useState(location.state)
    const [vxsrf, setVxsrf] = useState('')
    const [amount, setAmount] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const request = () => {
        if (amount && password && confirmPassword) {
            axios.post(`${import.meta.env.VITE_API}/contributor/withdraw/request`,
                {password, confirmPassword, amount : parseInt(amount)},
                {headers: { 'xsrf-token' : vxsrf }}
            )
            .then((response) => swalert(response.data, 'success', 3000))
            .then((res) => res.dismiss && navigate('/contributor/overview'))
            .catch((error) => { return Promise.reject(error) })
        }   else {swalert('please complete your data', 'info', 3000)}
    }

    useEffect(() =>  {
        if (state.withdraw_status != 'requested' && state.amount > 50000) {
            getvxsrf().then((result) => setVxsrf(result))
        }
    }, [])

    if (state.withdraw_status == 'requested' || state.amount < 50000) {
        return (
            <div className="page" style={{flexDirection: 'column', gap: '20px', textAlign: 'center'}}>
                <Topback location={-1}/>
                <LazyLoadImage src="/img/withdraw.png" style={{width: '180px'}}/>
                {(state.withdraw_status == 'requested') && 
                <div style={{marginTop: '30px'}}>
                    <div style={{fontFamily: 'var(--poppins)', fontSize: '1.2rem', color: 'var(--blue)'}}><span>You have </span>made a request</div>
                    <div style={{fontFamily: 'var(--poppins)', fontSize: '0.9rem', color: 'var(--text)', marginTop: '15px'}}>Your request will be processed within 1 - 3 days</div>
                </div>
                }
                {(state.amount < 50000) && 
                <div style={{marginTop: '30px'}}>
                    <div style={{fontFamily: 'var(--poppins)', fontSize: '1.2rem', color: 'var(--blue)'}}><span>Your balance </span>hasn't reached Rp 50.000,-</div>
                    <div style={{fontFamily: 'var(--poppins)', fontSize: '0.9rem', color: 'var(--text)', marginTop: '15px'}}>Let's increase your selling</div>
                </div>
                }
            </div>
        )
    }

    return (
        <div className="page-max" style={{alignItems: 'center', flexDirection: 'column'}}>
            <Topback location={-1}/>
            <LazyLoadImage src="/img/withdraw.png" style={{width: '180px', marginTop: '90px'}}/>
            <div className="form" style={{marginTop: '25px', flexDirection: 'column'}}>
                <div className="input-form">
                    <div>
                        <div>Amount :</div>
                        <input className='productinput' value={amount ? formatPrice(amount) : amount} type="text" placeholder='Rp 0' onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} required/>
                    </div>
                    <div>
                        <div>Password :</div>
                        <input className='productinput' value={password} type="password" placeholder='******' onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    <div>
                        <div>Confirm password :</div>
                        <input className='productinput' value={confirmPassword} type="password" placeholder='******' onChange={(e) => confirmPassword(e.target.value)} required/>
                    </div>
                </div>
                <div className="button-max" style={{backgroundColor: 'var(--yellow)'}}>Withdraw</div>
            </div>
        </div>
    )
}

export default Withdraw