import { useNavigate } from "react-router-dom"

const Topback = ({location}) => {

    let navigate = useNavigate()

    return(
        <div className="back" onClick={() => location ? navigate(location) : navigate('/')}>
            <div className="fa-solid fa-arrow-left fa-xl active"></div>
            <div className="nav-logo">
                <h1>stresslo</h1>
            </div>
        </div>
    )
}

export default Topback