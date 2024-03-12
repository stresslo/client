import { useLocation } from "react-router-dom"
import Topback from "../../components/topback"

const Withdraw = () => {

    const location = useLocation()
    console.log(location.state)

    return (
        <div className="page-max">
            <Topback location={-1}/>
        </div>
    )
}

export default Withdraw