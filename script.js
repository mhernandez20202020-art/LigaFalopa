document.addEventListener('DOMContentLoaded', () => {
    // CORRECCIÓN: Nombres de archivo actualizados sin espacios.
    const data = {
      "gimnasios": [
        {
          "id": "tierra",
          "nombre": "Gimnasio de Victor Hugo",
          "tipo": "Tierra",
          "lider": { "nombre": "Tasa", "foto": "images/Foto Lider Tierra.png" },
          "medalla": { "nombre": "Medalla Tierra", "foto": "images/Medalla tierra.png" },
          "equipo": [
            { "nombre": "Donphan", "nivel": 100, "imagen": "https://img.pokemondb.net/sprites/home/normal/donphan.png" },
            { "nombre": "Piloswine", "nivel": 100, "imagen": "https://img.pokemondb.net/sprites/home/normal/piloswine.png" },
            { "nombre": "Marowak", "nivel": 100, "imagen": "https://img.pokemondb.net/sprites/home/normal/marowak.png" },
            { "nombre": "Quagsire", "nivel": 100, "imagen": "https://img.pokemondb.net/sprites/home/normal/quagsire.png" },
            { "nombre": "Skarmory", "nivel": 100, "imagen": "https://img.pokemondb.net/sprites/home/normal/skarmory.png" },
            { "nombre": "Exeggutor", "nivel": 100, "imagen": "https://img.pokemondb.net/sprites/home/normal/exeggutor.png" }
          ],
          "arena": { "foto": "images/Foto Amigable.jpg" }, 
          "retadores": [
            { "nombre": "Bestia", "resultado": "N/A" },
            { "nombre": "Marito", "resultado": "N/A" },
            { "nombre": "Rufa", "resultado": "N/A" },
            { "nombre": "Tasa", "resultado": "N/A" },
            { "nombre": "Pepa", "resultado": "N/A" },
            { "nombre": "Fer", "resultado": "N/A" },
            { "nombre": "Bully", "resultado": "N/A" },
            { "nombre": "Quaso", "resultado": "N/A" },
            { "nombre": "Manu", "resultado": "N/A" },
            { "nombre": "Vago", "resultado": "N/A" },
            { "nombre": "Pappo", "resultado": "Victoria" },
            { "nombre": "Tuerca", "resultado": "N/A" }
          ]
        },
        
      ]
    };

    // --- Element Selectors ---
    const gymSelector = document.getElementById('gym-selector');
    const gymBanner = document.getElementById('gym-banner');
    const leaderPhoto = document.getElementById('leader-photo');
    const leaderName = document.getElementById('leader-name');
    const gymName = document.getElementById('gym-name');
    const medalPhoto = document.getElementById('medal-photo');
    const medalName = document.getElementById('medal-name');
    const medalInfo = document.querySelector('.medal-info'); 
    
    const generalTableSection = document.getElementById('general-table-section');
    const challengerSummaryGrid = document.getElementById('challenger-summary-grid');
    const gymViewSection = document.getElementById('gym-view-section');

    const pokemonGrid = document.getElementById('pokemon-grid');
    const challengersList = document.getElementById('challengers-list');

    const gymData = data.gimnasios;

    function calculateChallengerData() {
        const challengerSummary = {};

        gymData.forEach(gym => {
            gym.retadores.forEach(retador => {
                if (!challengerSummary[retador.nombre]) {
                    challengerSummary[retador.nombre] = {
                        wins: 0,
                        medals: []
                    };
                }
                if (retador.resultado === 'Victoria') {
                    challengerSummary[retador.nombre].wins++;
                    challengerSummary[retador.nombre].medals.push(gym.medalla.foto);
                }
            });
        });
        return challengerSummary;
    }

    function displayGeneralTable() {
        generalTableSection.style.display = 'block';
        gymViewSection.style.display = 'none';
        
        leaderPhoto.style.display = 'none';
        leaderName.style.display = 'none';
        medalPhoto.style.display = 'none';
        medalName.style.display = 'none';
        gymName.textContent = 'Tabla General';
        gymBanner.style.backgroundImage = 'none';
        gymBanner.style.backgroundColor = 'white';


        const challengerData = calculateChallengerData();
        challengerSummaryGrid.innerHTML = ''; 

        const sortedChallengers = Object.entries(challengerData)
            .sort(([, a], [, b]) => b.wins - a.wins);

        sortedChallengers.forEach(([name, data]) => {
            const card = document.createElement('div');
            card.className = 'challenger-summary-card';

            const nameEl = document.createElement('h4');
            nameEl.textContent = name;

            const winsEl = document.createElement('p');
            winsEl.textContent = `Medallas: ${data.wins}`;

            const medalsContainer = document.createElement('div');
            medalsContainer.className = 'medals-container';
            data.medals.forEach(medalSrc => {
                const medalImg = document.createElement('img');
                medalImg.src = medalSrc;
                medalImg.alt = 'Medalla';
                medalImg.className = 'summary-medal-img';
                medalsContainer.appendChild(medalImg);
            });

            card.appendChild(nameEl);
            card.appendChild(winsEl);
            card.appendChild(medalsContainer);
            challengerSummaryGrid.appendChild(card);
        });
    }

    function populateGymSelector() {
        const defaultOption = document.createElement('option');
        defaultOption.value = 'general';
        defaultOption.textContent = 'Tabla General';
        gymSelector.appendChild(defaultOption);

        gymData.forEach(gym => {
            const option = document.createElement('option');
            option.value = gym.id;
            option.textContent = gym.nombre;
            gymSelector.appendChild(option);
        });
    }

    function displayGymInfo(gymId) {
        generalTableSection.style.display = 'none';
        gymViewSection.style.display = 'block';

        leaderPhoto.style.display = 'block';
        leaderName.style.display = 'block';
        medalPhoto.style.display = 'block';
        medalName.style.display = 'block'; 
        gymBanner.style.backgroundColor = '';

        const selectedGym = gymData.find(gym => gym.id === gymId);

        if (selectedGym) {
            gymBanner.style.backgroundImage = `url(${selectedGym.arena.foto})`;
            leaderPhoto.src = selectedGym.lider.foto;
            leaderName.textContent = selectedGym.lider.nombre;
            gymName.textContent = selectedGym.nombre;
            medalPhoto.src = selectedGym.medalla.foto;

            const inlineMedalImg = document.createElement('img');
            inlineMedalImg.src = 'images/TIERRA.png'; 
            inlineMedalImg.alt = selectedGym.medalla.nombre;
            inlineMedalImg.className = 'inline-medal-icon';
            
            medalInfo.innerHTML = ''; 

            const medalImagesContainer = document.createElement('div');
            medalImagesContainer.className = 'medal-images-container';

            medalImagesContainer.appendChild(medalPhoto); 
            medalImagesContainer.appendChild(inlineMedalImg);
            medalInfo.appendChild(medalImagesContainer);
            
            medalName.textContent = selectedGym.medalla.nombre;
            medalInfo.appendChild(medalName);

            pokemonGrid.innerHTML = '';
            selectedGym.equipo.forEach(pokemon => {
                const card = document.createElement('div');
                card.className = 'pokemon-card';
                const nameEl = document.createElement('h4');
                nameEl.textContent = pokemon.nombre;
                const imgEl = document.createElement('img');
                imgEl.src = pokemon.imagen;
                imgEl.alt = pokemon.nombre;
                const levelEl = document.createElement('p');
                levelEl.textContent = `Nv. ${pokemon.nivel}`;
                card.appendChild(nameEl);
                card.appendChild(imgEl);
                card.appendChild(levelEl);
                pokemonGrid.appendChild(card);
            });

            challengersList.innerHTML = '';
            selectedGym.retadores.forEach((retador, index) => {
                const li = document.createElement('li');
                li.textContent = `${retador.nombre}`;
                const select = document.createElement('select');
                select.className = 'challenger-result-selector';
                select.dataset.challengerIndex = index;
                const options = [
                    { value: 'Victoria', text: 'Victoria' },
                    { value: 'Derrota', text: 'Derrota' },
                    { value: 'N/A', text: 'N/A' }
                ];
                options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.textContent = opt.text;
                    if (retador.resultado === opt.value) {
                        option.selected = true;
                    }
                    select.appendChild(option);
                });
                const setColor = (selectElement) => {
                    const selectedValue = selectElement.value;
                    selectElement.classList.remove('victoria', 'derrota', 'na');
                    if (selectedValue === 'Victoria') {
                        selectElement.classList.add('victoria');
                    } else if (selectedValue === 'Derrota') {
                        selectElement.classList.add('derrota');
                    } else {
                        selectElement.classList.add('na');
                    }
                };
                setColor(select);
                select.addEventListener('change', (event) => {
                    const selectedValue = event.target.value;
                    const challengerIndex = event.target.dataset.challengerIndex;
                    selectedGym.retadores[challengerIndex].resultado = selectedValue;
                    setColor(event.target);
                });
                li.appendChild(select);
                challengersList.appendChild(li);
            });
        }
    }

    // --- Initial Setup ---
    populateGymSelector();
    displayGeneralTable(); 

    // --- Event Listener ---
    gymSelector.addEventListener('change', (event) => {
        if (event.target.value === 'general') {
            displayGeneralTable();
        } else {
            displayGymInfo(event.target.value);
        }
    });
});
