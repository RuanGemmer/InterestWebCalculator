export function selicMetaAA() {
    const url =
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados?formato=json";
    const apiKey = "dsjknverui!@151#54cd@FD";
    requestToApiBacen(url, apiKey, 432, "SELIC ANUAL ATUAL (%) = ");
}

export function cdiAA() {
    const url =
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4389/dados?formato=json";
    const apiKey = "dsjknverui!@151#54cd@FD";
    requestToApiBacen(url, apiKey, 4389, "CDI ANUAL ATUAL (%) = ");
}

export function ipcaAA() {
    const url =
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados?formato=json";
    const apiKey = "dsjknverui!@151#54cd@FD";
    requestToApiBacen(url, apiKey, 13522, "IPCA ATUAL (%) = ");
}

export function selicFutureAA() {
    const url =
        "https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoTop5Anuais?$top=5&$filter=Indicador%20eq%20'Selic'&$orderby=Data%20desc&$format=json&$select=Indicador,Data,DataReferencia,Media";
    const apiKey = "dsjknverui!@151#54cd@FD";
    nextYear_ = nextYear();
    requestToApiFocus(
        url,
        apiKey,
        "432f",
        `SELIC FUTURA PARA O ANO DE ${nextYear_} SEGUNDO FOCUS (%) = `
    );
}

export function ipcaFutureAA() {
    const url =
        "https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoTop5Anuais?$top=5&$filter=Indicador%20eq%20'IPCA'&$orderby=Data%20desc&$format=json&$select=Indicador,Data,DataReferencia,Media";
    const apiKey = "dsjknverui!@151#54cd@FD";
    nextYear_ = nextYear();
    requestToApiFocus(
        url,
        apiKey,
        "432f",
        `IPCA FUTURO PARA O ANO DE ${nextYear_} SEGUNDO FOCUS (%) = `
    );
}

function requestToApiBacen(url, apiKey, cod, name) {
    // Faz uma requisição para a API
    fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            // 'data' agora contém as informações da taxa SELIC
            const rate = data[data.length - 1].valor;

            // Faça algo com a taxa SELIC, como exibi-la na página
            console.log(`${name}${rate}`);
        })
        .catch((error) => {
            console.error("Erro ao obter dados:", error);
            console.log(averageDataBrazil(cod, name));
        });
}

function requestToApiFocus(url, apiKey, cod, name) {
    // Faz uma requisição para a API
    fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            const nextYear_ = nextYear();
            let rate;
            for (let i = 0; i < 5; i++) {
                let objectData = data.value[i];
                if (objectData.DataReferencia === nextYear_.toString()) {
                    rate = objectData.Media;
                }
            }

            console.log(`${name}${rate}`);
        })
        .catch((error) => {
            console.error("Erro ao obter dados:", error);
            console.log(averageDataBrazil(cod, name));
        });
}

function nextYear() {
    const actualDate = new Date();
    const actualYear = actualDate.getFullYear();
    return actualYear + 1;
}

function averageDataBrazil(cod, name) {
    const averageData = [
        { cod: 432, valueData: 8.5 },
        { cod: "432f", valueData: 8.5 },
        { cod: 4389, valueData: 8.4 },
        { cod: 13522, valueData: 7.0 },
    ];

    let valueForCod;
    for (let i of averageData) {
        if (i.cod === cod) {
            valueForCod = i.valueData;
        }
    }

    let strAverage = `(média histórica) ${name}${valueForCod}`;
    return strAverage;
}

ipcaFutureAA();
