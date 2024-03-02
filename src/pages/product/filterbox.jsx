import "../../style/filterbox.css"

const FilterBox = () => {
    return (
        <div className='filter-box'>
            <div onClick={() => { document.querySelector('.filter-box').classList.remove('show') }} className="fa-solid fa-close fa-xl" style={{position : 'absolute', top: '25px', right: '20px', color: 'var(--text)', cursor: 'pointer'}}/>
            <div style={{width: '100%', height: 'max-content', overflow: 'hidden scroll'}}>
                <div className="itext" style={{fontSize: '1rem'}}>Framework</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                    <div className="button" style={{borderRadius: '10px', width: '80px', backgroundColor: '#aaa'}}>React</div>
                    <div className="button" style={{borderRadius: '10px', width: '80px', backgroundColor: '#aaa'}}>Angular</div>
                    <div className="button" style={{borderRadius: '10px', width: '80px', backgroundColor: '#aaa'}}>Html & CSS</div>
                    <div className="button" style={{borderRadius: '10px', width: '80px', backgroundColor: '#aaa'}}>Vue</div>
                    <div className="button" style={{borderRadius: '10px', width: '80px', backgroundColor: '#aaa'}}>Svelte</div>
                    <div className="button" style={{borderRadius: '10px', width: '80px', backgroundColor: '#aaa'}}>Next JS</div>
                </div>
            </div>
        </div>
    )
}

export default FilterBox