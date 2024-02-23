const form = document.querySelector(".search-form");
const resultDiv = document.querySelector(".result");

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const word = form.querySelector(".search-box").value;
    await getWordInfo(word);
});

const getWordInfo = async (word) => {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        if (data && data[0]) {
            const meanings = data[0].meanings[0];
            const definitions = meanings.definitions[0];

            // Build HTML content using template literals
            resultDiv.innerHTML = `
                <h2><strong>Word:</strong> ${data[0].word}</h2>
                <p class="partOfSpeech">${meanings.partOfSpeech}</p>
                <p><strong>Meaning:</strong> ${definitions.definition === undefined ? "Not Found" : definitions.definition}</p>
                <p><strong>Example:</strong> ${definitions.example !== undefined ? definitions.example : "Not Available"}</p>
                <p><strong>Antonyms:</strong> ${buildAntonymsList(definitions.antonyms)}</p>
                <div><a  href="${data[0].sourceUrls}" target="_blank">Read More</a></div>
            `;
        } else {
            resultDiv.innerHTML = "<p>Word not found.</p>";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        resultDiv.innerHTML = "<p>Sorry, the word could not be found.</p>";
    }
};

// Helper function to build an unordered list from an array
const buildAntonymsList = (antonyms) => {
    if (antonyms.length === 0) {
        return '<span>Not found</span>';
    }

    const antonymsList = antonyms.map(antonym => `<li>${antonym}</li>`).join('');
    return `<ul>${antonymsList}</ul>`;
};
