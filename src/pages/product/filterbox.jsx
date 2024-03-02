import "../../style/filterbox.css"

const FilterBox = () => {
    return (
        <div className='filter-box'>
            <div onClick={() => { document.querySelector('.filter-box').classList.remove('show') }} className="fa-solid fa-close fa-xl" style={{position : 'absolute', top: '25px', right: '20px', color: 'var(--text)', cursor: 'pointer'}}/>
            <div style={{width: '100%', height: 'max-content', overflow: 'hidden scroll'}}>
                <div className="itext" style={{fontSize: '1rem'}}>Framework</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px 0px'}}>
                    <div className="button" style={{borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'}}>React</div>
                    <div className="button" style={{borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'}}>Angular</div>
                    <div className="button" style={{borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'}}>HTML</div>
                    <div className="button" style={{borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'}}>Vue</div>
                    <div className="button" style={{borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'}}>Svelte</div>
                    <div className="button" style={{borderRadius: '5px', width: '90px', height: '35px', boxShadow: 'unset', backgroundColor: 'var(--background)', color : 'var(--blue)'}}>Next JS</div>
                </div>
            </div>
        </div>
    )
}

export default FilterBox