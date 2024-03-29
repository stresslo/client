import { useContext, useRef, useState, useEffect } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useNavigate } from 'react-router-dom'
import getvxsrf from '../../../service/getvxsrf'
import Context from '../../../utils/context'
import Loading from "../../../utils/loading"
import swalert from '../../../utils/swalert'
import axios from "axios"
import Swal from 'sweetalert2'
import Topback from '../../components/topback'

const Profile = () => {

    const navigate = useNavigate()
    const inputref = useRef(null)
    const context = useContext(Context)
    const url = import.meta.env.VITE_API

    const [file, setFile] = useState(null)
    const [email, setEmail] = useState('')
    const [vxsrf, setVxsrf] = useState('')
    const [loading, setLoading] = useState(false)

    const logout = async() => {
        const filterUrl = context.role == 'contributor' ? `${url}/logout/contributor` : `${url}/logout`
        Swal.fire({
            icon: 'info',
            text : 'are you sure want to logout?',
            confirmButtonText : 'Logout',
            showDenyButton: true,
            focusConfirm: false,
            focusDeny : false,
            reverseButtons : true,
            denyButtonText : 'Cancel',
            background : 'var(--primary)',
            color : 'var(--blue)',
            customClass : { container: 'alertext' }
        })
        .then(async (res) => {
            if (res.isConfirmed) {
                try {
                    setLoading(true)
                    const response = await axios.get(filterUrl)
                    context.setToken('')
                    localStorage.removeItem('role')
                    swalert(response.data, "success", 3000)
                    .then((res) =>  { if(res.dismiss) { location.href = '/' } })
                } 
                catch (error) {{error.response && console.log(error.response.data)}}
                finally{setLoading(false)}
            }
        })
    }

    const updateImage = async() => {
        const filterUrl = context.role == 'contributor' ? `${url}/contributor/update` : `${url}/user/update`
        try {
            let formData = new FormData();
            formData.append('img', file);
            setLoading(true)
            const response = await axios.put(filterUrl, formData, {
                headers : {"Content-Type" : "multipart/form-data", "xsrf-token" : vxsrf}, 
                withCredentials : true
            })
            swalert(response.data, 'success', 6000)
            .then((res) => res.dismiss && location.reload())
        } 
        catch (error) {
            if (error || error.response) {
                swalert(error.response.data, "error", 2000)
            }
        }
        finally {setLoading(false)}
    }

    useEffect(() => { 
        context.role == 'contributor' && localStorage.removeItem('transaction_mode')
        getvxsrf().then((result) => setVxsrf(result)) 
    }, [])
    if (loading) return <Loading/>

    return (
        <>
        <div className='page' style={{flexDirection: 'column', gap : '10px'}}>
            <Topback/>
            <div style={{position: 'relative'}}>
                <div onClick={() => inputref.current.click()} style={{position: 'absolute', top: '-10px', right : '-10px', color: 'var(--text)', cursor: 'pointer'}} className='fa-solid fa-pen-to-square fa-lg'/>
                <img onClick={() => inputref.current.click()} src={(file) ? URL.createObjectURL(file) : context.img} style={{borderRadius : '50%', width: '155px', height: '155px', objectFit: 'cover', border: '1.5px solid var(--yellow)', boxShadow: 'var(--boxshadow)', cursor : 'pointer'}}/>
            </div>
            <div className='title'>{context.username}</div>
            <form style={{display: 'flex', alignItems: "center", flexDirection: 'column', position: 'relative'}}>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} ref={inputref} style={{display: 'none'}}/>
                <input id='changemail' type="text" style={{width : '300px'}} placeholder={context.email} readOnly/>
                {(file || email) ? <button style={{margin: '30px 0'}} onClick={() => updateImage()} className='button'>update</button> : 
                <div style={{margin: '30px 0', display: 'flex', gap: '20px'}}>
                    {(context.role == 'contributor') ? 
                        <div className='button' onClick={() => navigate('/contributor/overview')}><i style={{cursor: 'pointer'}} className='fa-solid fa-chart-line fa-xl'/></div>
                        :
                        <div className='button' onClick={() => navigate('/transaction/history')}><i style={{cursor: 'pointer'}} className='fa-solid fa-money-bill-transfer fa-xl'/></div>
                    }
                    <div className='button' onClick={logout}><i className='fa-solid fa-right-from-bracket fa-xl'/></div>
                </div>}  
            </form>
        </div>
        </>
    )
}

export default Profile;