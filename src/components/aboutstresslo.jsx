import Topback from "./topback"
import { useState } from "react"

const AboutStresslo = () => {
    const [language, setLanguage] = useState('english')

    return (
        <div className='page-max'>
            <Topback location={-1}/>
            {(language == 'english') ? 
            <div className='form' style={{flexDirection: 'column', textAlign: 'left', fontFamily: 'var(--poppins)', color: 'var(--text)', fontSize: '0.75rem', gap: '20px', marginTop: '70px'}}>
                <div onClick={() => setLanguage('indonesia')} style={{cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem'}}>
                    <div className='fa-solid fa-language fa-xl'></div>
                    <div style={{color: 'var(--text)', fontFamily: 'var(--poppins)', fontSize: '1rem'}}>Bahasa Indonesia</div>
                </div>

                <h1><span>Welcome to StressLo</span> - Your <span>Inspiration</span> in Every <span>Design!</span></h1>
                <p style={{translate: '0 -5px'}}>
                    StressLo is here as your creative partner to rejuvenate and bring fresh inspiration to every design project. We understand that in the creative world, there are times when ideas seem to run dry, and stress begins to creep in. That's why we're here, to bring a new spirit and help you overcome creative stress.
                </p>

                <h2 style={{marginTop: '10px'}}> <span>Our</span> Mission:</h2>
                <p>
                    Understand and meet your creative needs by providing a diverse range of high-quality design assets, from graphics and templates to design elements that can add a new dimension to every project.
                </p>

                <h2><span>Our</span> Services:</h2>
                <ul>
                    <li><strong>Wide Collection of Design Assets:</strong> Discover thousands of unique design elements to bring new inspiration to your work. From illustrations to mockups, we've got it all!</li>
                    <li><strong>Personalization Solutions:</strong> Our creative team is ready to assist you in customizing design assets according to your project needs and aesthetic preferences.</li>
                    <li><strong>Special Packages for Teams and Developers:</strong> We understand the challenges faced by creative teams and developers. Get special packages with exclusive benefits to enhance your project completion.</li>
                    <li><strong>Regular Inspiration:</strong> Connect with our creative community and receive regular inspiration to keep your creativity fresh.</li>
                </ul>

                <p>
                    Join StressLo and discover new inspiration. With StressLo, you don't need to feel trapped in creative stress. Make each project a new adventure full of inspiration. With us, you get not only design assets but also a partner who understands the struggles and provides inspiring solutions.
                </p>

                <p>
                    Rediscover the joy of creating with StressLo - where every pixel tells your unique story!
                </p>
            </div> :
                <div className='form' style={{flexDirection: 'column', textAlign: 'left', fontFamily: 'var(--poppins)', color: 'var(--text)', fontSize: '0.75rem', gap: '20px', marginTop: '70px'}}>
                <div onClick={() => setLanguage('english')} style={{cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem'}}>
                  <div className='fa-solid fa-language fa-xl'></div>
                  <div style={{color: 'var(--text)', fontFamily: 'var(--poppins)', fontSize: '1rem'}}>English</div>
                </div>
              
                <h1><span>Selamat Datang di StressLo</span> - Inspirasi Anda dalam Setiap <span>Desain!</span></h1>
                <p style={{translate: '0 -5px'}}>
                  StressLo hadir sebagai mitra kreatif Anda untuk meremajakan dan memberikan inspirasi baru pada setiap proyek desain Anda. Kami memahami bahwa dalam dunia kreatif, ada saat-saat di mana ide tampaknya mengalami kekeringan, dan stres mulai menyelinap. Inilah mengapa kami ada di sini, untuk membawa semangat baru dan membantu Anda mengatasi stres dalam berkarya.
                </p>
              
                <h2 style={{marginTop: '10px'}}> <span>Misi</span> Kami:</h2>
                <p>
                  Memahami dan memenuhi kebutuhan kreatif Anda dengan menyediakan beragam aset desain berkualitas tinggi, mulai dari grafis dan template hingga elemen desain yang dapat memberikan dimensi baru pada setiap proyek.
                </p>
              
                <h2><span>Layanan</span> Kami:</h2>
                <ul>
                  <li><strong>Koleksi Luas Aset Desain:</strong> Temukan ribuan elemen desain unik untuk memberikan inspirasi baru pada karya Anda. Dari ilustrasi hingga mockup, kami punya semuanya!</li>
                  <li><strong>Solusi Personalisasi:</strong> Tim kreatif kami siap membantu Anda menyesuaikan aset desain sesuai dengan kebutuhan proyek dan preferensi estetika Anda.</li>
                  <li><strong>Paket Khusus untuk Tim dan Developer:</strong> Kami memahami tantangan yang dihadapi oleh tim dan developer kreatif. Dapatkan paket spesial dengan keuntungan eksklusif untuk meningkatkan penyelesaian proyek Anda.</li>
                  <li><strong>Inspirasi Berkala:</strong> Terhubung dengan komunitas kreatif kami dan terima inspirasi reguler untuk menjaga kreativitas Anda tetap segar.</li>
                </ul>
              
                <p>
                  Bergabunglah dengan StressLo dan temukan inspirasi baru. Dengan StressLo, Anda tidak perlu merasa terjebak dalam stres kreatif. Jadikan setiap proyek Anda sebagai petualangan baru yang penuh inspirasi. Bersama kami, Anda tidak hanya mendapatkan aset desain tetapi juga mitra yang memahami perjuangan dan memberikan solusi yang menginspirasi.
                </p>
              
                <p>
                  Temukan kembali kegembiraan dalam berkarya dengan StressLo - tempat di mana setiap piksel menceritakan kisah unik Anda!
                </p>
              </div>
            }
      </div>
    )
}

export default AboutStresslo