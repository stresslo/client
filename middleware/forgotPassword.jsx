import { useEffect, useState } from "react"
import Topback from "../src/components/topback"
import getvxsrf from "../service/getvxsrf"
import axios from "axios"
import swalert from "../utils/swalert"
import { useNavigate, useParams } from "react-router-dom"
import Loading from "../utils/loading"

const Forgot = {
    requset : () => {
        const navigate = useNavigate()
        const endpoint = `${import.meta.env.VITE_API}`
        const [loading, setLoading] = useState(false)
        const [role, setRole] = useState('user')
        const [email, setEmail] = useState('')
        const [vxsrf, setVxsrf] = useState('')

        useEffect(() => { getvxsrf().then((result) => setVxsrf(result)) }, [])

        const makeRequest = async (e) => {
            e.preventDefault()
            try {
                setLoading(true)
                const response = await axios.post(`${endpoint}/forgot/password/${role}`, {email}, { headers: {'xsrf-token' : vxsrf} })
                swalert(response.data, 'success', 3000)
                .then((res) => res.dismiss && navigate(`/confirm/forgot/password/${role}`))
            } catch (error) {
                if (error || error.response) {
                    swalert(error.response.data, 'info', 2000)
                    return false;
                }
            } finally {
                setLoading(false)
            }
        }

        if (loading) return <Loading/>

        return (
            <div className="page">
                <Topback/>
                <form className="form" onSubmit={makeRequest} style={{ textAlign: 'center', gap: '50px' }}>
                    <div style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
                        <select onChange={(e) => setRole(e.target.value)} style={{width: '120px'}} required>
                            <option value="user">User</option>
                            <option value="contributor">Contributor</option>
                        </select>
                        <button className="button" type="submit">Confirm</button>
                    </div>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="input your email" required/>
                    <div>
                        <div className="title">Forgot <span>Password</span></div>
                        <div className="desc" style={{ fontFamily: 'var(--quicksand)', fontSize: '0.9rem', marginTop: '7px', letterSpacing: '1px' }}>make sure your email is active and can receive message from our team</div>
                    </div>
                </form>
            </div>
        )
    },

    confirm : () => {

        const endpoint = import.meta.env.VITE_API
        const navigate = useNavigate()
        const {role} = useParams()

        const [url, setUrl] = useState(`${endpoint}/confirm/forgot/password${role}`)
        const [otp, setOTP] = useState('')
        const [vxsrf, setVxsrf] = useState('')
        const [password, setPassword] = useState('')
        const [confirmPassword, setConfirmPassword] = useState('')
        const [loading, setLoading] = useState(false)

        const changePassword = async (e) => {
            e.preventDefault()
            try {
                setLoading(true)
                const response = await axios.post(url, { password, confirmPassword, otp }, { headers: {'xsrf-token' : vxsrf} })
                swalert(response.data, 'success', 3000)
                .then((res) => res.dismiss && navigate('/login'))
            } catch (error) {
                if (error || error.response) {
                    swalert(error.response.data, 'info', 3000)
                    return false;
                }
            } finally {
                setLoading(false)
            }
        }

        useEffect(() => { getvxsrf().then((result) => setVxsrf(result)) }, [])

        if (loading) return <Loading/>

        return (
            <div className="page">
                <Topback/>
                <div className="login-box">
                    <div className="login-top">
                        <h1 className="title"><span>Change</span> Password</h1>
                        <div className="desc" style={{ fontFamily: 'var(--quicksand)', fontSize: '0.9rem', marginTop: '7px', letterSpacing: '1px' }}>make sure your data is filled in correctly and appropriately</div>
                    </div>
                    <form onSubmit={changePassword} className="login-input">
                        <input type="text" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        <input type="text" placeholder='confirm password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                        <input type="text" placeholder="OTP" value={otp} onChange={(e) => setOTP(e.target.value)} required/>
                        <div className="login-button">
                            <button className="button" type="submit" style={{fontFamily : "serif", width : "150px"}}>Confirm</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Forgot;