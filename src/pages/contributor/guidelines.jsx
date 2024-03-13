import React, { useState } from 'react'
import Topback from '../../components/topback';

const Guidelines = () => {

    const [language, setLanguage] = useState('english')
    const accepted = () => {
        localStorage.setItem('accept', 'accept')
        location.href = '/register'
    }

    return (
        <div className='page-max'>
            <Topback location={-1}/>
            {(language == 'english') ? 
            <div className='form' style={{flexDirection: 'column', textAlign: 'left', fontFamily: 'var(--poppins)', color: 'var(--text)', fontSize: '0.75rem', gap: '20px', marginTop: '70px'}}>
                <div onClick={() => setLanguage('indonesia')} style={{cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem'}}>
                    <div className='fa-solid fa-language fa-xl'></div>
                    <div style={{color: 'var(--text)', fontFamily: 'var(--poppins)', fontSize: '1rem'}}>Bahasa Indonesia</div>
                </div>

                <h1><span>Welcome to </span> the stresslo <span>Contributor</span> Community!</h1>
                <p style={{translate: '0 -5px'}}>
                Thank you for your interest in contributing to stresslo. To ensure a fair and transparent experience for all contributors, please review and adhere to the following guidelines:
                </p>
        
                <h2 style={{marginTop: '20px'}}>1. <span>Content</span> Contribution:</h2>
                <ul>
                <li>Your submitted content should be original, non-copyright infringing, and relevant to the project's topic.</li>
                <li>Avoid content that is offensive, discriminatory, or violates ethical standards.</li>
                </ul>
        
                <h2>2. <span>Revenue</span> Sharing:</h2>
                <ul>
                <li>Contributors will receive 90% of the total revenue generated from the sale of their content.</li>
                <li>We reserve 10% of the total sales as a contribution for project support and development.</li>
                </ul>
        
                <h2>3. <span>Pay</span>ment:</h2>
                <ul>
                <li>Contributor payments will be processed regularly according to the established schedule.</li>
                <li>Ensure that your payment information is valid to receive compensation.</li>
                </ul>
        
                <h2>4. <span>Content</span> Quality:</h2>
                <ul>
                <li>Submitted content should meet the established quality standards of the project.</li>
                <li>Content not meeting the criteria may be rejected or requested for revision.</li>
                </ul>
        
                <h2>5. <span>Payment</span> Verification:</h2>
                <ul>
                <li>Contributors have access to sales and earnings reports through their personal dashboard.</li>
                <li>All payment transparency and information will be detailed for contributors.</li>
                </ul>
        
                <h2>6. <span>Recognition</span> and Awards:</h2>
                <ul>
                <li>Outstanding and consistent contributors will receive recognition and awards within the community.</li>
                <li>Decisions on awards will be based on contribution quantity and quality.</li>
                </ul>
        
                <h2>7. <span>Changes</span> to Terms:</h2>
                <ul>
                <li>These terms and conditions may be updated over time to ensure fairness and alignment with project developments.</li>
                <li>Contributors will be notified of significant policy changes.</li>
                </ul>
        
                <h2 style={{marginTop: '20px'}}> <span>Questions</span> and Assistance:</h2>
                <p>
                If you have any questions or need assistance, please contact our project management team.
                </p>
        
                <p>Thank you for being part of our community and contributing to the success of stresslo!</p>
                <p style={{marginTop: '20px'}}> <span>*I agree to the terms and conditions.</span> </p>
                <div onClick={() => accepted()} className='button-max' style={{backgroundColor: 'var(--yellow)'}}>Agree & Continue</div>
            </div> :
                <div className='form' style={{flexDirection: 'column', textAlign: 'left', fontFamily: 'var(--poppins)', color: 'var(--text)', fontSize: '0.75rem', gap: '20px', marginTop: '70px'}}>
                <div onClick={() => setLanguage('english')} style={{cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem'}}>
                    <div className='fa-solid fa-language fa-xl'></div>
                    <div style={{color: 'var(--text)', fontFamily: 'var(--poppins)', fontSize: '1rem'}}>English</div>
                </div>

                <h1><span>Selamat datang di </span>Komunitas <span>Contributor stresslo</span>!</h1>
                <p style={{translate: '0 -5px'}}>
                Terima kasih atas minat Anda untuk berkontribusi pada stresslo. Untuk memastikan pengalaman yang adil dan transparan bagi semua kontributor, silakan tinjau dan patuhi pedoman berikut:
                </p>
            
                <h2 style={{marginTop: '20px'}}>1. <span>Kontribusi</span> Konten</h2>
                <ul>
                <li>Konten yang Anda kirimkan harus asli, tidak melanggar hak cipta, dan relevan dengan topik proyek.</li>
                <li>Hindari konten yang bersifat ofensif, diskriminatif, atau melanggar standar etika.</li>
                </ul>
            
                <h2>2. <span>Bagi Hasil</span> Pendapatan:</h2>
                <ul>
                <li>Kontributor akan menerima 90% dari total pendapatan yang dihasilkan dari penjualan kontennya.</li>
                <li>Kami menyisihkan 10% dari penjualan total sebagai kontribusi untuk dukungan proyek dan pengembangan stresslo.</li>
                </ul>
            
                <h2>3. <span>Pembayaran:</span></h2>
                <ul>
                <li>Pembayaran kepada kontributor akan diproses secara teratur sesuai dengan jadwal yang telah ditetapkan.</li>
                <li>Pastikan informasi pembayaran Anda valid untuk menerima kompensasi.</li>
                </ul>
            
                <h2>4. <span>Kualitas</span> Konten:</h2>
                <ul>
                <li>Konten yang diajukan harus memenuhi standar kualitas yang telah ditetapkan oleh proyek.</li>
                <li>Konten yang tidak memenuhi kriteria dapat ditolak atau diminta untuk direvisi.</li>
                </ul>
            
                <h2>5. <span>Verifikasi</span> Pembayaran:</h2>
                <ul>
                <li>Kontributor memiliki akses ke laporan penjualan dan pendapatan melalui dasbor pribadi mereka.</li>
                <li>Semua transparansi pembayaran dan informasi akan dijelaskan secara rinci untuk kontributor.</li>
                </ul>
            
                <h2>6. <span>Penghargaan</span> dan Pengakuan:</h2>
                <ul>
                <li>Kontributor yang berprestasi dan konsisten akan menerima penghargaan dan pengakuan dalam komunitas.</li>
                <li>Keputusan tentang penghargaan akan didasarkan pada kuantitas dan kualitas kontribusi.</li>
                </ul>
            
                <h2>7. <span>Perubahan</span> pada Ketentuan:</h2>
                <ul>
                <li>Ketentuan dan syarat ini dapat diperbarui dari waktu ke waktu untuk memastikan keadilan dan kesesuaian dengan perkembangan proyek.</li>
                <li>Kontributor akan diberitahu tentang perubahan kebijakan yang signifikan.</li>
                </ul>
            
                <h2 style={{marginTop: '20px'}}> <span>Pertanyaan</span> dan Bantuan:</h2>
                <p>
                Jika Anda memiliki pertanyaan atau membutuhkan bantuan, silakan hubungi tim manajemen proyek kami.
                </p>
            
                <p>Terima kasih telah menjadi bagian dari komunitas kami dan berkontribusi pada kesuksesan stresslo</p>
                <p style={{marginTop: '20px'}}> <span>*saya menyetujui syarat dan ketentuan.</span> </p>
                <div onClick={() => accepted()} className='button-max' style={{backgroundColor: 'var(--yellow)'}}>Setuju & Lanjutkan</div>
                </div>
            }
      </div>
    )
}

export default Guidelines;