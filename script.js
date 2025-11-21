const API_BASE = "https://1l9i4o6pbj.execute-api.eu-north-1.amazonaws.com/coins";

const container = document.getElementById("cryptoContainer");
const searchInput = document.getElementById("searchInput");

let allCoins = []; // Store the fetched data globally

async function fetchCrypto() {
    // Request more data to make the tracker more useful
    const res = await fetch(`${API_BASE}?vs_currency=usd&per_page=20`); 
    allCoins = await res.json();
    renderCoins(allCoins);
}

function formatLargeNumber(number) {
    // Helper function to format Volume and Market Cap numbers
    return number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).replace('$', ''); // Remove the dollar sign for a cleaner look, as we add it in the template
}

function renderCoins(coinsToRender) {
    container.innerHTML = coinsToRender
        .map(c => {
            const changeClass = c.price_change_percentage_24h >= 0 ? "change-positive" : "change-negative";
            const changeSign = c.price_change_percentage_24h >= 0 ? "+" : "";

            return `
            <div class="crypto-row">
                <div class="col-name">
                    <img src="${c.image}" alt="${c.name}" />
                    <span>${c.name}</span>
                </div>

                <div class="col-symbol">${c.symbol.toUpperCase()}</div>

                <div class="col-price">$${c.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</div>

                <div class="col-change ${changeClass}">
                    ${changeSign}${c.price_change_percentage_24h.toFixed(2)}%
                </div>
                
                <div class="col-volume">$${formatLargeNumber(c.total_volume)}</div>
                
                <div class="col-mktcap">$${formatLargeNumber(c.market_cap)}</div>
            </div>`;
        })
        .join("");
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    // Filter the original list of coins based on name or symbol
    const filteredCoins = allCoins.filter(c => 
        c.name.toLowerCase().includes(searchTerm) || 
        c.symbol.toLowerCase().includes(searchTerm)
    );

    renderCoins(filteredCoins);
}

// Attach the search listener to the input field
searchInput.addEventListener('keyup', handleSearch);

// Initial load
fetchCrypto();