import Loading from "../../../utils/loading"
import Swaload from "../../../utils/swaload"
import swalert from "../../../utils/swalert"
import Context from "../../../utils/context"
import Topback from "../../components/topback"
import { useContext, useState } from "react"
import axios from "axios"
import jwt from "jwt-decode"

const Overview = () => {

    const context = useContext(Context)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])

    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/contributor/overview/data/')
            const decode = jwt(response.data)
            setData(decode.data)
        } catch (error) {
            if (error || error.response) swalert(error.response.data, 'info', 300)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-max">
            <Topback/>
            <div className="form" style={{flexDirection: 'column'}}>

            </div>
        </div>
    )
}

export default Overview