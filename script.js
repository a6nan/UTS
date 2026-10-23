    const urlParams = new URLSearchParams(window.location.search);
    let namaTamu = urlParams.get('to');

    if (namaTamu) {
        namaTamu = namaTamu.replace(/_/g, ' ');
        

        let tamuAtas = document.getElementById('nama-tamu');
        if (tamuAtas) tamuAtas.innerText = namaTamu;
        

        let tamuBawah = document.getElementById('nama-tamu-bawah');
        if (tamuBawah) tamuBawah.innerText = namaTamu;
    }

    const tanggalAcara = new Date("December 20, 2026 08:00:00").getTime();

    const hitungMundur = setInterval(function() {
        const sekarang = new Date().getTime();
        const selisih = tanggalAcara - sekarang;


        const hari = Math.floor(selisih / (1000 * 60 * 60 * 24));
        const jam = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const menit = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
        const detik = Math.floor((selisih % (1000 * 60)) / 1000);

        document.getElementById("hari").innerText = hari;
        document.getElementById("jam").innerText = jam < 10 ? '0' + jam : jam;
        document.getElementById("menit").innerText = menit < 10 ? '0' + menit : menit;
        document.getElementById("detik").innerText = detik < 10 ? '0' + detik : detik;

        if (selisih < 0) {
            clearInterval(hitungMundur);
            document.getElementById("hari").innerText = "00";
            document.getElementById("jam").innerText = "00";
            document.getElementById("menit").innerText = "00";
            document.getElementById("detik").innerText = "00";
        }
    }, 1000);

    const ucapanInput = document.getElementById('ucapan');
    const charCount = document.getElementById('charCount');
    
    if (ucapanInput && charCount) {
        ucapanInput.addEventListener('input', function() {
            const length = this.value.length;
            charCount.innerText = length + " / 300 karakter";
        });
    }

    function salinTeks() {
        const teks = "Jl. Genteng Kali No. 85, Genteng, Surabaya, East Java";

        navigator.clipboard.writeText(teks).then(() => {
            alert("Alamat berhasil disalin!");
        }).catch(err => {
            console.error("Gagal menyalin alamat: ", err);
        });
    }

    document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nama = document.getElementById('nama').value;
    const hadir = document.querySelector('input[name="hadir"]:checked').value;
    const jumlah = document.getElementById('jumlah').value;
    const ucapan = document.getElementById('ucapan').value;
    const submitButton = this.querySelector('button[type="submit"]');

    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="bi bi-hourglass-split me-2"></i> Mengirim...';
    submitButton.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/api/rsvp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nama, hadir, jumlah, ucapan })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            this.reset(); 
            document.getElementById('charCount').innerText = "0 / 300 karakter";
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Gagal terhubung ke server. Pastikan backend sudah berjalan.');
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
});
    