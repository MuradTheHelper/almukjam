document.addEventListener('DOMContentLoaded', function () {
    const kataInput = document.getElementById('kataInput');
    const suggestions = document.getElementById('suggestions');
    const translateBtn = document.getElementById('translateBtn');

    let words = [];

    fetch('bank_kata.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').slice(1);
            words = rows.map(row => {
                const [no, kataTunggal, artiTunggal, jamakTaksir, artiJamak, contohKalimat, terjemahKalimat] = row.split(',');
                return { kataTunggal, artiTunggal, jamakTaksir, artiJamak, contohKalimat, terjemahKalimat };
            });
        })
        .catch(error => console.error('Error fetching CSV file:', error));

    kataInput.addEventListener('input', function () {
        const query = kataInput.value.trim().toLowerCase();
        suggestions.innerHTML = '';

        if (query.length > 0) {
            const filteredWords = words.filter(word => 
                word.artiTunggal.toLowerCase().startsWith(query) || 
                word.kataTunggal.startsWith(query)
            );
            filteredWords.forEach(word => {
                const suggestionItem = document.createElement('a');
                suggestionItem.classList.add('list-group-item', 'list-group-item-action');
                suggestionItem.textContent = `${word.artiTunggal} (${word.kataTunggal})`;
                suggestionItem.href = '#';
                suggestionItem.addEventListener('click', function (e) {
                    e.preventDefault();
                    kataInput.value = word.artiTunggal;
                    suggestions.innerHTML = '';
                    displayTranslation(word);
                });
                suggestions.appendChild(suggestionItem);
            });
        }
    });

    translateBtn.addEventListener('click', function () {
        const inputKata = kataInput.value.trim().toLowerCase();
        const word = words.find(word => 
            word.artiTunggal.toLowerCase() === inputKata || 
            word.kataTunggal === inputKata
        );
        if (word) {
            displayTranslation(word);
        } else {
            alert('Kata tidak ditemukan dalam bank kata.');
        }
    });

    function displayTranslation(word) {
        document.getElementById('kataTunggal').textContent = word.kataTunggal;
        document.getElementById('artiTunggal').textContent = word.artiTunggal;
        document.getElementById('jamakTaksir').textContent = word.jamakTaksir;
        document.getElementById('artiJamak').textContent = word.artiJamak;
        document.getElementById('contohKalimat').textContent = word.contohKalimat;
        document.getElementById('terjemahKalimat').textContent = word.terjemahKalimat;
    }
});