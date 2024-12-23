async function fetchStrains() {
    try {
        const response = await fetch('https://files.sneaky.sh/files/strains.json');
        if (!response.ok) {
            throw new Error('VPS response bad');
        }
        const strains = await response.json();
        return strains;
    } catch (error) {
        console.error('Failed to fetch strains:', error);
        return [];
    }
}

function renderStrains(filteredStrains) {
    const strainList = document.getElementById("strainList");
    strainList.innerHTML = "";

    if (filteredStrains.length === 0) {
        strainList.innerHTML = "<div class='text-center'>No strains match the selected filter.</div>";
        return;
    }

    filteredStrains.sort((a, b) => b.effects.overall - a.effects.overall);
    filteredStrains.forEach(strain => {
        const strainItem = document.createElement("div");
        strainItem.className = "list-group-item";

        const sanitizedStrainName = strain.name.replace(/\s+/g, '');

        strainItem.innerHTML = `
            <h5>${strain.name}</h5>
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
            <div class="progress-bar bg-${effectValue >= 4 ? 'success' : 'danger'}" role="progressbar" style="width: ${effectValue * 10}%;" aria-valuenow="${effectValue}" aria-valuemin="0" aria-valuemax="10">
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

async function filterStrains(filterType) {
    const strains = await fetchStrains();
    let filteredStrains;
    if (filterType === 'good') {
        filteredStrains = strains.filter(strain => strain.effects.overall > 5);
    } else if (filterType === 'bad') {
        filteredStrains = strains.filter(strain => strain.effects.overall <= 5);
    } else {
        filteredStrains = strains;
    }
    renderStrains(filteredStrains);
}

filterStrains('all');