import axios from "axios"
import Navbar from "../../components/navbar"
import Content from "../../components/content"
import Sidebar from "../../components/sidebar"
import Context from "../../../utils/context"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../../style/main.css"

const Main = () => {

    const navigate = useNavigate()
    const context = useContext(Context)

    const transaction_mode = localStorage.getItem('transaction_mode')
    const [ data, setData ] = useState([])
    const [ count, setCount ] = useState(0)

    const getTransaction = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/transaction/show`)
            setData(response.data)
            setCount(response.data.length)
            response.data.length === 0 && localStorage.removeItem('transaction_mode')
        } catch (error) {
            localStorage.removeItem('transaction_mode')
            return false;
        }
    }

    useEffect(() => { if (transaction_mode && context.role == 'user') { getTransaction() }
    }, [])

    return (
        <div className="main">
            <Navbar count={count}/>
            <Content data={data} setData={setData} setCount={setCount}/>
            <Sidebar/>
        </div>
    )
}

export default Main