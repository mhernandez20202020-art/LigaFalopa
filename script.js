document.addEventListener('DOMContentLoaded', () => {
    // 1. CONFIGURACIÓN DE FIREBASE
    // Este es tu objeto de configuración personal
    const firebaseConfig = {
        apiKey: "AIzaSyCzI8Hww5Ph9K7gVlrQSqbh-fqpf7jpjh0",
        authDomain: "ligafalopa.firebaseapp.com",
        databaseURL: "https://ligafalopa-default-rtdb.firebaseio.com",
        projectId: "ligafalopa",
        storageBucket: "ligafalopa.appspot.com", // Corregí el dominio a .appspot.com que es el estándar
        messagingSenderId: "459689709646",
        appId: "1:459689709646:web:13fed8cf46d40a09e2b31f",
        measurementId: "G-EGQKRTEKJW"
    };

    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // 2. SELECTORES DE ELEMENTOS HTML
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

    let gymData = []; // Esta variable ahora se llenará desde Firebase

    // 3. FUNCIÓN PARA CARGAR DATOS DESDE FIREBASE
    async function loadDataAndSetupPage() {
        try {
            const snapshot = await db.collection('gimnasios').get();
            gymData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (gymData.length > 0) {
                populateGymSelector();
                displayGeneralTable();
            } else {
                console.log("No se encontraron gimnasios en la base de datos.");
                gymName.textContent = "No hay datos"; // Mensaje para el usuario
            }
        } catch (error) {
            console.error("Error cargando datos desde Firebase: ", error);
            gymName.textContent = "Error al cargar";
        }
    }

    // 4. FUNCIÓN PARA ACTUALIZAR DATOS EN FIREBASE
    async function updateChallengerResult(gymId, challengerIndex, newResult) {
        const gymToUpdate = gymData.find(g => g.id === gymId);
        if (!gymToUpdate) return;

        gymToUpdate.retadores[challengerIndex].resultado = newResult;

        try {
            const gymRef = db.collection('gimnasios').doc(gymId);
            await gymRef.update({
                retadores: gymToUpdate.retadores
            });
            console.log("Resultado actualizado en Firebase!");
            // Volvemos a dibujar la tabla general para que refleje el cambio de medallas
            displayGeneralTable();
        } catch (error) {
            console.error("Error actualizando en Firebase: ", error);
        }
    }

    // 5. FUNCIONES PARA MANEJAR LA INTERFAZ DE USUARIO (UI)
    function calculateChallengerData() {
        const challengerSummary = {};
        gymData.forEach(gym => {
            if (gym.retadores) {
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
            }
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
        gymSelector.innerHTML = ''; // Limpiar opciones anteriores
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
            medalName.textContent = selectedGym.medalla.nombre;

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

                const options = ['Victoria', 'Derrota', 'N/A'];
                options.forEach(optValue => {
                    const option = document.createElement('option');
                    option.value = optValue;
                    option.textContent = optValue;
                    if (retador.resultado === optValue) {
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
                    const challengerIndex = parseInt(event.target.dataset.challengerIndex, 10);
                    setColor(event.target);
                    updateChallengerResult(gymId, challengerIndex, selectedValue);
                });

                li.appendChild(select);
                challengersList.appendChild(li);
            });
        }
    }

    // 6. INICIO DE LA APLICACIÓN
    loadDataAndSetupPage();

    gymSelector.addEventListener('change', (event) => {
        if (event.target.value === 'general') {
            displayGeneralTable();
        } else {
            displayGymInfo(event.target.value);
        }
    });
});
