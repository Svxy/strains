const strains = [
    {
        name: "Bruce Banner",
        origin: "Heaven on Earth",
        effects: {
            overall: 10,
            relaxation: 10,
            Appetite: 10,
            focus: 10,
            creativity: 10,
            anxiety: 0,
            depression: 0,
            sociability: 10
        }
    },
    {
        name: "Fruit Roll-Up",
        origin: "Seafoam Dispensary",
        effects: {
            overall: 9,
            relaxation: 7,
            Appetite: 3,
            focus: 5,
            creativity: 6,
            anxiety: 1,
            depression: 0,
            sociability: 5
        }
    },
    {
        name: "Black Phoenix",
        origin: "Seafoam Dispensary",
        effects: {
            overall: 7,
            relaxation: 5,
            Appetite: 5,
            focus: 6,
            creativity: 6,
            anxiety: 1,
            depression: 0,
            sociability: 4
        }
    }
];

function renderStrains(filteredStrains) {
    const strainList = document.getElementById("strainList");
    strainList.innerHTML = "";

    if (filteredStrains.length === 0) {
        strainList.innerHTML = "<div class='text-center'>No strains match the selected filter.</div>";
        return;
    }

    filteredStrains.forEach(strain => {
        const strainItem = document.createElement("div");
        strainItem.className = "list-group-item";

        const sanitizedStrainName = strain.name.replace(/\s+/g, '');

        strainItem.innerHTML = `
            <h5>${strain.name} (${strain.origin})</h5>
            ${renderEffect("Overall", strain.effects.overall)}
            <button class="btn btn-secondary" type="button" data-toggle="collapse" data-target="#details-${sanitizedStrainName}" aria-expanded="false" aria-controls="details-${sanitizedStrainName}">
                Show Effects
            </button>
            <div class="collapse" id="details-${sanitizedStrainName}">
                ${renderEffectsDetails(strain.effects)}
            </div>
        `;

        strainList.appendChild(strainItem);
    });
}

function renderEffect(effectName, effectValue) {
    return `
        <div class="mb-2">${effectName}</div>
        <div class="progress mb-2">
            <div class="progress-bar bg-success" role="progressbar" style="width: ${effectValue * 10}%;" aria-valuenow="${effectValue}" aria-valuemin="0" aria-valuemax="10">
                ${effectValue}/10
            </div>
        </div>
    `;
}

function renderEffectsDetails(effects) {
    return `
        ${Object.entries(effects).filter(([effectName]) => effectName !== 'overall').map(([effectName, effectValue]) => 
            renderEffect(effectName.charAt(0).toUpperCase() + effectName.slice(1), effectValue)).join('')}
    `;
}

function filterStrains(filterType) {
    let filteredStrains;
    if (filterType === 'good') {
        filteredStrains = strains.filter(strain => {
            return Object.values(strain.effects).some(effect => effect >= 7);
        });
    } else if (filterType === 'bad') {
        filteredStrains = strains.filter(strain => {
            return Object.values(strain.effects).every(effect => effect < 4);
        });
    } else {
        filteredStrains = strains;
    }
    renderStrains(filteredStrains);
}

renderStrains(strains);