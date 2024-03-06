import Context from "../../utils/context"
import { NavLink } from "react-router-dom"
import { useContext } from "react"
import "../style/sidebar.css"

const Sidebar = () => {

    const context = useContext(Context)

    const hideSidebar = () => {
        if (document.querySelector('.sidebar').classList.contains('show')) {
            document.querySelector('.sidebar').classList.remove('show')
        }
    }

    return (
        <div className="sidebar" onClick={() => hideSidebar()}>
            <div className="nav-logo">
                <img src="/img/stresslo.png" alt="stresslo logo"/>
                <h1>stresslo</h1>
            </div>
            <div className="sideitem">
                <div className="topside">
                    <NavLink className="sidelist" to="/">
                        <i className="fa-solid fa-home fa-xl"/>
                        <div className="sidetext">Home</div>
                    </NavLink>
                    <NavLink className="sidelist" to="/products">
                        <i className="fa-solid fa-layer-group fa-xl"></i>
                        <div className="sidetext">Products</div>
                    </NavLink>
                    {(context.token) ? 
                    <>
                    <NavLink className={a => (a.isActive) ? "sidelist" : "sidelist"} to="/profile">
                        <div className="fa-solid fa-circle-user fa-xl"/>
                        <div className="sidetext" style={{marginLeft: '33px'}}>Account</div>
                    </NavLink>
                    </>
                    : 
                    <NavLink className={a => (a.isActive) ? "sidelist" : "sidelist"} to="/login">
                        <i className="fa-solid fa-right-to-bracket fa-xl"/>
                        <div className="sidetext" style={{marginLeft: '33px'}}>Sign in</div>
                    </NavLink>}
                    {(context.role == 'contributor') && 
                        <NavLink className="sidelist" to="/contributor/store">
                            <i className="fa-solid fa-store fa-lg"></i>
                            <div className="sidetext" style={{marginLeft: '33px'}}>My Store</div>
                        </NavLink>
                    }
                    {(context.role == 'user') && 
                        <NavLink className="sidelist" to="/transaction/history">
                            <i className="fa-solid fa-money-bill-transfer fa-lg"></i>
                            <div className="sidetext" style={{marginLeft: '32px'}}>Transaction</div>
                        </NavLink>
                    }
                </div>

                <div className="botside">
                    <NavLink className={a => (a.isActive) ? "sidelist" : "sidelist"} to="/about">
                        <i className="fa-solid fa-circle-info fa-xl"></i>
                        <div className="sidetext" style={{marginLeft: '20px', fontSize: '0.95rem'}}>Intro & Guides</div>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default Sidebar