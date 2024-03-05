import { useNavigate, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Loading from "../../../utils/loading"
import swalert from '../../../utils/swalert'
import getvxsrf from '../../../service/getvxsrf'
import axios from "axios"
import "../../style/login.css"
import Topback from '../../components/topback'


const Register = () => {

    const navigate = useNavigate()

    const [url, setUrl] = useState('')
    const [role, setRole] = useState('user')
    const [vxsrf, setVxsrf] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const createUser = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await axios.post(url,
            {email, username, password}, {headers: { "xsrf-token" : vxsrf }})
            localStorage.setItem('register_mode_user', JSON.stringify({ email, username, password }))
            swalert(response.data, "success", 7000)
            .then((res) => {if (res.dismiss) {location.href = '/confirm/user'}})
        } 
        catch (error) {
            swalert(error.response.data, "error", 5000)
        }
        finally {setLoading(false)}
    }

    useEffect(() => {
        if (role == 'user') return setUrl(`${import.meta.env.VITE_API}/register`)
        else return setUrl(`${import.meta.env.VITE_API}/register`)
    }, [role])
    useEffect(() => { getvxsrf().then((result) => setVxsrf(result)) }, [])
    if (loading) return <Loading/>

    return (
        <div className="page">
            <Topback/>
            <div className="login-box">
                <div className="login-top">
                    <h1 className="title"><span>Regis</span>ter</h1>
                    <p className="desc">design assets to make your <span>work easier.</span></p>
                </div>
                <form onSubmit={createUser} className="login-input">
                    <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <input type="text" placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)} required/>
                    <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <div className="login-button">
                        <select onChange={(e) => setRole(e.target.value)} style={{width: '120px'}} required>
                            <option value="user">User</option>
                            <option value="contributor">Contributor</option>
                        </select>
                        <button type="submit" className="button" style={{fontFamily : "serif", width : "150px"}}>Create</button>
                    </div>
                    <NavLink to='/login' style={{textDecoration : "none", color : "var(--text)", translate: '0 20px'}}>Have an account</NavLink>
                </form>
            </div>
        </div>
    )
}

export default Register