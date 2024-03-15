import { LazyLoadImage } from "react-lazy-load-image-component"
import { useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import stresslo from "../../data/stresslo"
import products from "../../data/product"
import swalert from "../../utils/swalert"
import Context from "../../utils/context"
import about from "../../data/about"
import axios from "axios"
import "../style/content.css"

const Content = ({data, setData, setCount}) => {

    const path = location.pathname
    const navigate = useNavigate()
    const context = useContext(Context)
    const [query, setQuery] = useState('')

    const deleteNotification = async (id) => {
        try {
            context.setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API}/transaction/delete/${id}`)
            setData((prev) => {
                const update = prev.filter((data) => data.order_id !== id)
                setCount(update.length)
                return update
            })
            swalert(response.data, "success", 1200)
        } catch (error) {
            if (error || error.response) {
                swalert(error.response.data, "error", 1200)
            }
        } finally {
            context.setLoading(false)
        }
    }

    return (
        <div className="content">
            <div className="snap-container"></div>
            <div className="grep"/>
            <div className="notification-panel">
                {(!data.length) ? 
                    <div className="notification-wrap" style={{ justifyContent: 'center', height: '100%'}}>
                        <div>No recent notification.</div>
                    </div>
                :
                    <div className="notification-wrap" style={{ justifyContent: 'unset' }}>
                        {data.map((i, k) => {
                            return (
                                <div className="notification-box" key={k}>
                                    <LazyLoadImage src="/img/stresslo.png" className="nimg" style={{width: '30px'}} effect="blur" alt="stresslo logo"/>
                                    <div onClick={() => navigate(`/transaction/result/${i.order_id}`)} className="text-container" style={{ padding: '0', margin: '0', gap: '4px', width: '90%', cursor: 'pointer' }}>
                                        <div className="text">{i.transaction_status == "settlement" ? 'success' : i.transaction_status} transaction</div>
                                        <p style={{ fontSize: '0.8rem' }}><span style={{fontFamily: 'var(--poppins)'}}>Order ID : {i.order_id}</span></p>
                                    </div>
                                    <div className="close" onClick={() => deleteNotification(i.order_id)}>
                                        <div className="fa-solid fa-close fa-xl" style={{color: 'var(--second)'}}/>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
            {(path == '/') && 
            <div>
                {(context.token) ? 
                <div className="developer">
                    {(window.innerWidth <= 550) && 
                    <img onClick={() => navigate('/profile')} src={context.img} style={{position: 'absolute', cursor: 'pointer', top: '15px', right: '15px', width: '35px', border: '2px solid var(--yellow)', height: '35px', objectFit: 'cover', borderRadius: '50%', boxSizing: 'border-box', boxShadow: 'var(--boxshadow)'}} alt="stresslo account" />
                    }
                    <img id="paimg" src="/img/greet.webp" className="dimasputra" alt="stresslo greeting" />
                    <div className="text-wrapper">
                    <div>Hi {context.username.split(' ')[0]}!,</div>
                    <div>Welcome back.</div>
                    <div className="button contact" onClick={() => context.role == 'contributor' ? navigate('/contributor/overview') : navigate('/profile')}>{context.role == 'user' ? 'Profile' : `Overview`}</div>
                </div>
                </div>
                : 
                <>
                <form className="form" style={{margin: '0px auto'}} onSubmit={(e) => {
                    e.preventDefault()
                    localStorage.setItem('search', query)
                    navigate('/product/all')
                }}>
                    <div className="input-form">
                        <div>
                            <div>Search</div>
                            <input type="text" placeholder="find any products" onChange={(e) => setQuery(e.target.value)}/>
                        </div>
                    </div>
                </form>
                <div className="developer" style={{marginTop: '80px'}}>
                    <img id="paimg" src="/img/greet.webp" className="dimasputra" alt="stresslo greeting" />
                    <div className="text-wrapper">
                    <h1>Welcome to stresslo</h1>
                    <div>Let's explore with us.</div>
                    <div className="button contact" onClick={() => navigate('/register')}>Sign up</div>
                    </div>
                </div>
                </>
                }
                {(stresslo.map((i,k) => {
                return(
                    <div className="service" style={{paddingTop: "40px"}} key={k}>
                        <h1 className="itext"><span>{i.ctg}</span> stresslo</h1>
                        {i.data.map((p, l) => 
                            <div className="sbox" key={l} onClick={() => {p.ctg && navigate(`/product/${p.ctg}`)}} style={{borderRight : `2px solid ${p.color}`}}>
                                <div className="image-container" style={{backgroundColor : `${p.color}`}}>
                                    {p.img && <LazyLoadImage src={p.img} className="simg" style={{width: '60px'}} effect="blur" alt="stresslo service logo"/>}
                                </div>
                                <div className="text-container">
                                    <h3>{p.title}</h3>
                                    <p>{p.text}</p>
                                    <div className="wrapdet">{p.pricing && p.pricing.map((s, l) => {return(<div key={l}>{s}</div>)})}</div>
                                </div>
                            </div>
                        )}
                    </div>)
                }))}
            </div>
            }
            {(path == '/about') &&
            <div>
                {(about.map((i,k) => {
                return(
                    <div className="service" style={{paddingTop: '20px'}} key={k}>
                        <h1 className="itext"><span>{i.ctg}</span> {i.ctg == 'trouble on' ? 'stresslo ?' : i.ctg == 'Contributor' ? 'Guidelines' : 'stresslo'}</h1>
                        {i.data.map((p, l) => 
                            <div className="sbox" key={l} onClick={() => { if (p.link) { window.location.href = p.link } }} style={{borderRight : `2px solid ${p.color}`}}>
                                <div className="image-container" style={{backgroundColor : `${p.color}`}}>
                                    {p.img && <LazyLoadImage src={p.img} className="simg" style={{width: '50px'}} effect="blur" alt="stresslo about logo"/>}
                                </div>
                                <div className="text-container">
                                    <h3>{p.title}</h3>
                                    <p>{p.text}</p>
                                    <div className="wrapdet">{p.pricing && p.pricing.map((s, l) => {return(<div key={l}>{s}</div>)})}</div>
                                </div>
                            </div>
                        )}
                    </div>)
            }))}
            </div>
            }
            {(path == '/products') && 
            <div>
                <div className="developer">
                <img id="paimg" src="/img/cont.webp" alt="stresslo contributor" className="dimasputra"/> 
                <div className="text-wrapper">
                <h1>Become a contributor</h1>
                <div>Sell your best work</div>
                <div onClick={() => navigate('/contributor/guidelines')} className="button contact">Get started</div>
                </div>
                </div>
                {(products.map((i,k) => {
                    return(
                        <div className="service" style={{paddingTop: "40px"}} key={k}>
                            <h1 className="itext"><span>{i.ctg && i.ctg}</span> Categories</h1>
                            {i.data.map((p, l) => 
                                <div className="sbox" key={l} onClick={() => navigate(`/product/${p.ctg}`)}  style={{borderRight : `2px solid ${p.color}`}}>
                                    <div className="image-container" style={{backgroundColor : `${p.color}`}}>
                                        {p.img && <LazyLoadImage src={p.img} alt="stresslo product logo" className="simg" effect="blur"/>}
                                    </div>
                                    <div className="text-container">
                                        <h3>{p.title}</h3>
                                        <p>{p.text}</p>
                                        <div className="wrapdet">{p.pricing && p.pricing.map((s, l) => {return(<div key={l}>{s}</div>)})}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }))}
            </div>
            }
            <p style={{textAlign: 'center', color: 'var(--text)', fontSize: '0.8rem', marginTop: '30px', fontFamily: 'var(--quicksand)'}}>Copyright © 2024 stresslo, VX platform.</p>
        </div>
    )
}

export default Content