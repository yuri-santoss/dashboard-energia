const channelID = 3178835;
const apiURL = `https://api.thingspeak.com/channels/${channelID}/feeds.json?results=1`;

let potenciaChart, correnteChart, consumoChart;

// Configuração base dos gráficos
function createChart(ctx, label, color) {
    return new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: color,
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 0
            }]
        },
        options: {
            animation: false,
            scales: {
                x: { display: false },
                y: { beginAtZero: true }
            }
        }
    });
}

// Criar charts
window.onload = () => {
    potenciaChart = createChart(document.getElementById("chartPotencia"), "Potência (W)", "#ff5050");
    correnteChart = createChart(document.getElementById("chartCorrente"), "Corrente (A)", "#50aaff");
    consumoChart  = createChart(document.getElementById("chartConsumo"),  "Consumo (kWh)", "#00ffae");

    atualizarDashboard();
    setInterval(atualizarDashboard, 5000);
};

async function atualizarDashboard() {
    try {
        const resposta = await fetch(apiURL);
        const dados = await resposta.json();
        const feed = dados.feeds[0];

        const potencia = parseFloat(feed.field1);
        const consumo  = parseFloat(feed.field2);
        const corrente = parseFloat(feed.field3);
        const tensao   = parseFloat(feed.field4);

        document.getElementById("potencia").innerText = potencia + " W";
        document.getElementById("consumo").innerText  = consumo  + " kWh";
        document.getElementById("corrente").innerText = corrente + " A";
        document.getElementById("tensao").innerText   = tensao   + " V";

        // Alimentar gráficos
        addData(potenciaChart, potencia);
        addData(correnteChart, corrente);
        addData(consumoChart,  consumo);

    } catch (e) {
        console.log("Erro:", e);
    }
}

function addData(chart, value) {
    chart.data.labels.push("");
    chart.data.datasets[0].data.push(value);

    if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    chart.update();
}
