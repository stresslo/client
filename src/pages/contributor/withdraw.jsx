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
    const [error, setError] = useState('')
    const [vxsrf, setVxsrf] = useState('')
    const [amount, setAmount] = useState('0')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    console.log(amount, parseInt(amount))

    const request = () => {
        axios.post(`${import.meta.env.VITE_API}/contributor/withdraw/request`,
            {password, confirmPassword, amount : parseInt(amount)},
            {headers: { 'xsrf-token' : vxsrf }}
        )
        .then((response) => swalert(response.data, 'success', 3000))
        .then((res) => res.dismiss && navigate('/contributor/overview'))
        .catch((error) => error.response ? setError(error.response.data) : () => { return Promise.reject(error) })
    }

    useEffect(() => getvxsrf().then((result) => setVxsrf(result)), [])

    return (
        <div className="page-max" style={{alignItems: 'center', flexDirection: 'column'}}>
            <Topback location={-1}/>
            <LazyLoadImage src="/img/withdraw.png" style={{width: '250px', marginTop: '70px'}}/>
            <div className="form" style={{marginTop: '20px', flexDirection: 'column'}}>
                <div className="input-form">
                    <div>
                        <div>Amount :</div>
                        <input className='productinput' value={amount ? formatPrice(amount) : amount} type="password" placeholder='Rp 0' onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} required/>
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