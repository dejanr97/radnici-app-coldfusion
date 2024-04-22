async function povuciPodatke() {
    try {
        const response = await fetch('http://localhost:8888/radnici-app/radnici-funkcije.cfc?method=prikaz_svih_radnika');
        const data = await response.json(); 
        return data;
    } catch (error) {
        console.error('Greška:', error);
        throw error; 
    }
}

function osvjeziPrikazTablice() {
    const tableBody = document.getElementById('sviRadniciBody');
    tableBody.innerHTML = ''; 

    povuciPodatke().then(rezultat => {
        const radnici = rezultat.DATA; 
        const columns = rezultat.COLUMNS; 
        
        const allColumnsRow = document.getElementById('sveKolone');
        allColumnsRow.innerHTML = ''; 

        columns.forEach(columnName => {
            const th = document.createElement('th');
            th.textContent = columnName;
            allColumnsRow.appendChild(th);
        });
        
        radnici.forEach(radnikData => {
            const row = document.createElement('tr'); 

            radnikData.forEach((podatak, index) => {
                const cell = document.createElement('td'); 
                
                if (index === 4) {
                    const datum = new Date(podatak);
                    const formatiranDatum = datum.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
                    cell.textContent = formatiranDatum;
                } else {
                    cell.textContent = podatak; 
                }

                if (columns[index]) {
                    cell.setAttribute('data-column', columns[index]);
                }

                row.appendChild(cell); 
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Obriši';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', () => {
                const radnikId = radnikData[0]; 
                obrisiRadnika(radnikId);
            });
            row.appendChild(deleteButton);

            
            const editButton = document.createElement('button');
            editButton.textContent = 'Izmijeni';
            editButton.className = 'edit-button';
            editButton.addEventListener('click', () => {
                ukloniFormuZaIzmjenu();

                const form = document.createElement('form');
                form.setAttribute('data-forma', 'izmjena');
                form.addEventListener('submit', (event) => {
                    event.preventDefault(); 

                    const updatedData = {
                        novo_ime: form.elements['ime'].value,
                        novo_prezime: form.elements['prezime'].value,
                        nova_pozicija: form.elements['pozicija'].value,
                        novi_datum_zaposlenja: form.elements['datum_zaposlenja'].value,
                        nova_plata: form.elements['plata'].value
                    };

                    const radnikId = radnikData[0]; 

                    azurirajRadnika(radnikId, updatedData)
                        .then(() => {
                            osvjeziPrikazTablice();
                            form.remove();
                        })
                        .catch(error => {
                            console.error('Greška prilikom ažuriranja radnika:', error);
                            window.alert('Došlo je do greške prilikom ažuriranja radnika.');
                        });
                });

                form.innerHTML = `
                <div style="text-align: right;">
                    <button id="closeFormButton" style="background: yellow; border: none; cursor: pointer;">&#x2715;</button>
                </div>
                ID: <span>${radnikData[0]}</span><br><br>
                Ime: <input type="text" name="ime" value="${radnikData[1]}" required><br>
                Prezime: <input type="text" name="prezime" value="${radnikData[2]}" required><br>
                Pozicija: <input type="text" name="pozicija" value="${radnikData[3]}" required><br>
                Datum zaposlenja: <input type="date" name="datum_zaposlenja" value="${radnikData[4]}" required><br>
                Plata: <input type="text" name="plata" value="${radnikData[5]}" required><br>
                <button type="submit">Sačuvaj izmjene</button>
            `;
            
            const closeFormButton = form.querySelector('#closeFormButton');
            closeFormButton.addEventListener('click', () => {
                form.remove();
            });
            

                document.body.appendChild(form);
            });
            row.appendChild(editButton);

            tableBody.appendChild(row);
        });
    }).catch(error => {
        console.error('Greška prilikom osvježavanja prikaza tablice:', error);
    });
}

function ukloniFormuZaIzmjenu() {
    const formaZaIzmjenu = document.querySelector('form[data-forma="izmjena"]');
    if (formaZaIzmjenu) {
        formaZaIzmjenu.remove();
    }
}

function obrisiRadnika(radnikId) {
    fetch(`http://localhost:8888/radnici-app/radnici-funkcije.cfc?method=obrisi_radnika&radnik_id=${radnikId}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        window.alert('Radnik je uspješno obrisan.');
        osvjeziPrikazTablice(); 
    })
    .catch(error => console.error('Greška:', error));
}


function azurirajRadnika(radnikId, updatedData) {
    const podaciForme = new FormData();
    podaciForme.append('radnik_id', radnikId);
    podaciForme.append('novo_ime', updatedData.novo_ime);
    podaciForme.append('novo_prezime', updatedData.novo_prezime);
    podaciForme.append('nova_pozicija', updatedData.nova_pozicija);
    podaciForme.append('novi_datum_zaposlenja', updatedData.novi_datum_zaposlenja);
    podaciForme.append('nova_plata', updatedData.nova_plata);

    return fetch('http://localhost:8888/radnici-app/radnici-funkcije.cfc?method=azuriraj_radnika', {
        method: 'POST',
        body: podaciForme 
    })
    .then(response => {
        if (response.ok) {
            window.alert('Radnik je uspješno ažuriran.');
            return response.json();
        } else {
            throw new Error('Ažuriranje radnika nije uspjelo.');
        }
    });
}

function kreirajNovogRadnika(podaciForme) {
    return fetch('http://localhost:8888/radnici-app/radnici-funkcije.cfc?method=kreiraj_novog_radnika', {
        method: 'POST',
        body: podaciForme
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        window.alert('Novi radnik je uspješno dodan.');
        osvjeziPrikazTablice(); 
    })
    .catch(error => console.error('Greška:', error));
}

const noviRadnikForma = document.getElementById('noviRadnikForma');
if (noviRadnikForma) {
    noviRadnikForma.addEventListener('submit', function(event) {
        event.preventDefault();
        const podaciForme = new FormData(this); 
        kreirajNovogRadnika(podaciForme);
    });
} else {
    console.error('Element noviRadnikForma nije pronađen.');
}

osvjeziPrikazTablice();
