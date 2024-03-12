import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LazyLoadImage } from "react-lazy-load-image-component"
import convertPrice from '../../../utils/price'
import getvxsrf from "../../../service/getvxsrf"
import Topback from '../../components/topback'
import Loading from "../../../utils/loading"
import swalert from "../../../utils/swalert"
import Context from '../../../utils/context'
import Swal from 'sweetalert2'
import axios from "axios"
import "../../style/create.css"

const EditProduct = () => {
  const context = useContext(Context)
  const navigate = useNavigate()
  const fileref = useRef(null)
  const imgref = useRef(null)
  const location = useLocation()
  const prevData = location.state

  const formatPrice = (value) => { return `Rp ${Number(value).toLocaleString('id-ID')}`};
  const [loading, setLoading] = useState(false)

  const [vxsrf, setVxsrf] = useState('')
  
  const [image, setImage] = useState((prevData) ? prevData.img : '')
  const [file, setFile] = useState((prevData) ? prevData.file : '')
  const [vid, setVid] = useState((prevData) ? prevData.vid : '')
  const [ctg, setCtg] = useState((prevData) ? prevData.ctg : '')
  const [tech, setTech] = useState((prevData) ? prevData.tech : '')
  const [desc, setDesc] = useState((prevData) ? prevData.desc : '')
  const [link, setLink] = useState((prevData) ? prevData.link : '')
  const [title, setTitle] = useState((prevData) ? prevData.title : '')
  const [price, setPrice] = useState((prevData) ? prevData.price : '')
  const [format, setFormat] = useState((prevData) ? prevData.format : '')

  const editProduct = async () => {
    if (!context.role || context.role !== 'contributor') {
        swalert('please login to your contributor account', 'info', 3000)
    }
    if (
        file && 
        title && 
        image && 
        desc && 
        price >= 0 && 
        (ctg !== 'web' || (ctg === 'web' && tech)) && 
        (ctg !== 'web' || (ctg === 'web' && link))) {
        Swal.fire({
            icon: 'info',
            text : 'are you sure want update this product?, your request will be reviewed again.',
            confirmButtonText : 'Update & review',
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
                    const endpoint = prevData.status == 'active' ? `${import.meta.env.VITE_API}/edit/product` : `${import.meta.env.VITE_API}/edit/pending/product`
                    const intPrice = parseInt(price, 10)
                    if (isNaN(intPrice) || intPrice < 0) return swalert('please input a valid price!', 'info', 3000)
                    setLoading(true)
                    let formData = new FormData()
                    formData.append('vid', vid);
                    formData.append('ctg', ctg);
                    formData.append('img', image);
                    formData.append('desc', desc);
                    formData.append('link', link);
                    formData.append('file', file);
                    formData.append('tech', tech);
                    formData.append('title', title);
                    formData.append('format', format);
                    formData.append('price', intPrice);
                    const response = await axios.post(endpoint,formData, {
                      headers: {"Content-Type": 'multipart/form-data', "xsrf-token" : vxsrf}
                    })
                    swalert(response.data, "success", 5000)
                    .then((res) => { if(res.dismiss) {window.location.href = '/contributor/store'} })
                } catch (error) {
                    swalert("server maintenance!", "error", 3000)
                    if (error.response) { swalert(error.response.data, "error", 3000) }
                } finally { setLoading(false) }
            }
        })
    } else {
      swalert("please complete the form data!", "error", false)
    }
  }

  useEffect(() => { getvxsrf().then((data) => setVxsrf(data)) }, [])
  if (loading) return <Loading/>

  return (
    <div className='page-max' style={{gap:'30px', paddingBottom: '5px'}}>
     <Topback location={-1}/>
      <div className='form'>
        <div className='input-form'>
          <div>
            <div>Title :</div>
            <input className='productinput' value={title} type="text" placeholder='e.g. company profile' onChange={(e) => setTitle(e.target.value)} required/>
          </div>
          <div>
            <div>Description :</div>
            <input className='productinput' value={desc} type="text" placeholder='e.g. modern company web.....' onChange={(e) => setDesc(e.target.value)} required/>
          </div>
          <div>
            <div>Price :</div>
            <input className='productinput' value={price >= 0 ? formatPrice(price) : price} type="text" placeholder='e.g. 350000' onChange={(e) => { setPrice(e.target.value.replace(/\D/g, ''))}} required/>
          </div>
          <div>
              <div>Category :</div>
              <select style={{width: '100%', textAlign: 'center'}} value={ctg} onChange={(e) => setCtg(e.target.value)} required>
                <option value="">-- SELECT CATEGORY --</option>
                <option value="Web">Web</option>
                <option value="3D">3D</option>
                <option value="Motion">Motion</option>
                <option value="Vector">Vector</option>
              </select>
          </div>
          {(ctg == 'Web') && 
          <>
            <div>
                <div>Framework :</div>
                <select style={{width: '100%'}} value={tech} onChange={(e) => setTech(e.target.value)} required>
                  <option value="">-- SELECT FRAMEWORK --</option>
                  <option value="html & css">HTML & CSS</option>
                  <option value="Angular">Angular JS</option>
                  <option value="Svelte">Svelte JS</option>
                  <option value="React">React JS</option>
                  <option value="Next">Next JS</option>
                  <option value="Vue">Vue JS</option>
                </select>
            </div>
            <div>
              <div>Link Preview :</div>
              <input className='productinput' value={link} type="text" placeholder='e.g. https://my-website.com' onChange={(e) => setLink(e.target.value)} required/>
            </div>
          </>
          }
          {(ctg === 'Motion') &&
          <>
            <div>
                <div>Software :</div>
                <select style={{width: '100%'}} value={tech} onChange={(e) => setTech(e.target.value)} required>
                  <option value="">-- SELECT SOFTWARE --</option>
                  <option value="Adobe After Effect">Adobe After Effect</option>
                  <option value="DaVinci Resolve">DaVinci Resolve</option>
                  <option value="Blender">Blender</option>
                  <option value="Apple Motion">Apple Motion</option>
                  <option value="Cinema 4D">Cinema 4D</option>
                  <option value="Other">Other</option>
                </select>
            </div>
            <div>
                <div>Format : </div>
                <select style={{width: '100%'}} value={format} onChange={(e) => setFormat(e.target.value)} required>
                  <option value="">-- SELECT FORMAT --</option>
                  <option value=".aep">.aep</option>
                  <option value=".drp">.drp</option>
                  <option value=".blend">.blend</option>
                  <option value=".motn">.motn</option>
                  <option value=".c4d">.c4d</option>
                  <option value="Other">Other</option>
                </select>
            </div>
          </>
          }
          {(ctg === 'Vector') &&
          <>
            <div>
                <div>Software :</div>
                <select style={{width: '100%'}} value={tech} onChange={(e) => setTech(e.target.value)} required>
                  <option value="">-- SELECT SOFTWARE --</option>
                  <option value="Adobe Illustration">Adobe Illustration</option>
                  <option value="Corel Draw">Corel Draw</option>
                  <option value="Pixelmator Pro">Pixelmator Pro</option>
                  <option value="Affinity Designer">Affinity Designer</option>
                  <option value="Other">Other</option>
                </select>
            </div>
            <div>
                <div>Format : </div>
                <select style={{width: '100%'}} value={format} onChange={(e) => setFormat(e.target.value)} required>
                  <option value="">-- SELECT FORMAT --</option>
                  <option value=".ai">.ai</option>
                  <option value=".cdr">.cdr</option>
                  <option value=".psd">.psd</option>
                  <option value=".eps">.eps</option>
                  <option value=".svg">.svg</option>
                  <option value=".afdesign">.afdesign</option>
                  <option value="Other">Other</option>
                </select>
            </div>
          </>
          }
          {(ctg === '3D') &&
          <>
            <div>
                <div>Software :</div>
                <select style={{width: '100%'}} value={tech} onChange={(e) => setTech(e.target.value)} required>
                  <option value="">-- SELECT SOFTWARE --</option>
                  <option value="Sketchup">SketchUp</option>
                  <option value="Blender">Blender</option>
                  <option value="Autodesk Maya">Autodesk Maya</option>
                  <option value="Cinema 4D">Cinema 4D</option>
                  <option value="Other">Other</option>
                </select>
            </div>
            <div>
                <div>Format : </div>
                <select style={{width: '100%'}} value={format} onChange={(e) => setFormat(e.target.value)} required>
                  <option value="">-- SELECT FORMAT --</option>
                  <option value=".skp">.skp</option>
                  <option value=".ma">.ma</option>
                  <option value=".mb">.mb</option>
                  <option value=".blend">.blend</option>
                  <option value=".c4d">.c4d</option>
                  <option value="Other">Other</option>
                </select>
            </div>
          </>
          }
          <div className='wrap-file'>
            <div>
              <div>Image : </div>
              <div className='prevfile' onClick={() => imgref.current.click()}>
                <div className={(image) ? 'fa-solid fa-check fa-xl' : 'fa-solid fa-image fa-xl'} style={{color: '#aaa', fontSize: '2rem'}}/>
                <div style={{ color: '#aaa', fontSize: '0.7rem' }}>{'(JPEG, JPG, PNG, MP4)'}</div>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} ref={imgref} style={{display:'none'}}/>
                <div style={{ color: '#aaa', fontSize: '0.95rem' }}>{`Max size: 10 Mb (Landscape)`}</div>
              </div>
            </div>
            <div>
              <div>File : </div>
              <div className='prevfile' onClick={() => fileref.current.click()}>
                <div className={(file) ? 'fa-solid fa-check fa-xl' : 'fa-solid fa-file fa-xl'} style={{color: '#aaa', fontSize: '2rem'}}/>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} ref={fileref} style={{display:'none'}}/>
                <div style={{ color: '#aaa', fontSize: '0.7rem' }}>{'(ZIP, RAR)'}</div>
                <div style={{ color: '#aaa', fontSize: '0.95rem' }}>Max size: 20 Mb</div>
              </div>
            </div>
            <div className='button-max' onClick={() => editProduct()} style={(file && title && image && desc && price >= 0 && ctg && tech) ? {backgroundColor: 'var(--yellow)', marginTop: '50px'} : {backgroundColor: '#aaa', marginTop: '50px'}}>Update change</div>
            </div>
          </div>
        <div className='prev-form'>
          <div className='itext'>Preview</div>
          <div className='product-card'>
            <LazyLoadImage className='product-img' src={(image) ? (image !== prevData.img) ? URL.createObjectURL(image) : (image) : '/img/dpi.jpg'} loading='lazy' effect='blur'/>
            <div className="wrapped-text">
              <div className='product-title'>{(title) ? title : 'Untitled'}</div>
              <div className='product-desc'>{(desc) ? (desc.length >= 30) ? desc.substring(0,30) + "..." : desc : 'no description available'}</div>
              <div className="wrapped-details">
              <div className='button price'>{convertPrice(price)}</div>
              <div style={{ color : 'var(--text)', cursor: 'pointer'}} className='fa-solid fa-cart-plus fa-xl' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProduct;