import "../../style/filterbox.css"

const FilterBox = () => {
    return (
        <div className='filter-box'>
            <div onClick={() => { document.querySelector('.filter-box').classList.remove('show') }} className="fa-solid fa-close fa-xl" style={{position : 'absolute', top: '10px', right: '15px', color: 'var(--primary)'}}/>
        </div>
    )
}

export default FilterBox