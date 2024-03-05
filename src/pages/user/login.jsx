import axios from "axios"
import Context from "../../../utils/context"
import Loading from "../../../utils/loading"
import swalert from "../../../utils/swalert"
import getvxsrf from '../../../service/getvxsrf'
import { useContext, useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import "../../style/login.css"
import Topback from "../../components/topback"

const Login = () => {
    
    const navigate = useNavigate()
    const context = useContext(Context)
    const refemail = localStorage.getItem('email')

    const [role, setRole]         = useState('user')
    const [url, setUrl]           = useState('')
    const [vxsrf, setVxsrf]       = useState('')
    const [email, setEmail]       = useState((refemail) ? refemail : '')
    const [loading, setLoading]   = useState(false)
    const [password, setPassword] = useState('')

    const handleLogin = async (event) => {
        event.preventDefault()
        localStorage.setItem('email', email)
        try {
            setLoading(true)
            const response = await axios.post(url, { email, password }, { headers: {'xsrf-token' : vxsrf} })
            context.setToken(response.data.token)
            localStorage.removeItem('email')
            localStorage.setItem('role', role)
            localStorage.setItem('transaction_mode', "true")
            navigate('/profile')
        }
        catch (error) {
            swalert("server maintenance!", "error")
            error.response && swalert(error.response.data, "error")  
        }
        finally{setLoading(false)}
    }

    useEffect(() => { getvxsrf().then((result) => setVxsrf(result)) }, [])
    useEffect(() => {
        if (role == 'user') return setUrl(`${import.meta.env.VITE_API}/login`)
        else return setUrl(`${import.meta.env.VITE_API}/login/contributor`)
    }, [role])

    if (loading) return <Loading/>

    return(
        <div className="page">
            <Topback/>
            <div className="login-box">
                <div className="login-top">
                    <h1 className="title"><span>Sign</span> in</h1>
                    <p className="desc">design assets to make your <span>work easier.</span></p>
                </div>
                <form className="login-input" onSubmit={handleLogin}>
                    <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <div className="login-button">
                        <select onChange={(e) => setRole(e.target.value)} style={{width: '120px'}} required>
                            <option value="user">User</option>
                            <option value="contributor">Contributor</option>
                        </select>
                        <button type="submit" className="button" style={{fontFamily : "serif", width : "150px"}}>Sign in</button>
                    </div>
                    <NavLink to='/forgot/password' style={{textDecoration : "none", color : "var(--text)", translate: '0 20px'}}>Forgot password?</NavLink>
                </form>
            </div>
        </div>
    )
    
}

export default Login