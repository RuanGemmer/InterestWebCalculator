import { convertDateToBrazil, getActualDateBrazil, getNextYear } from "./utils";

export function selicMetaAA() {
    const url =
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados?formato=json";
    const apiKey = "dsjknverui!@151#54cd@FD";
    return requestToApiBacen(url, apiKey, 432, "SELIC");
}

export function ipcaAA() {
    const url =
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados?formato=json";
    const apiKey = "dsjknverui!@151#54cd@FD";
    return requestToApiBacen(url, apiKey, 13522, "IPCA");
}

export function selicFutureAA() {
    const url =
        "https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoTop5Anuais?$top=5&$filter=Indicador%20eq%20'Selic'&$orderby=Data%20desc&$format=json&$select=Indicador,Data,DataReferencia,Media";
    const apiKey = "dsjknverui!@151#54cd@FD";
    return requestToApiFocus(url, apiKey, "432f", `SELIC F`);
}

export function ipcaFutureAA() {
    const url =
        "https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoTop5Anuais?$top=5&$filter=Indicador%20eq%20'IPCA'&$orderby=Data%20desc&$format=json&$select=Indicador,Data,DataReferencia,Media";
    const apiKey = "dsjknverui!@151#54cd@FD";
    let back = requestToApiFocus(url, apiKey, "13522f", `IPCA F`);
    console.log("back2", back);
    return back;
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
            let actualDate = getActualDateBrazil();
            const actualYear = getNextYear() - 1;

            let back = convertDatasToObject(name, rate, actualDate, actualYear);
            return back;
        })
        .catch((error) => {
            console.error("Erro ao obter dados:", error);
            return averageDataBrazil(cod, name);
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
            const nextYear = getNextYear();
            let rate;
            let previsionDate;
            for (let i = 0; i < 5; i++) {
                let objectData = data.value[i];
                if (objectData.DataReferencia === nextYear.toString()) {
                    rate = objectData.Media;
                    previsionDate = convertDateToBrazil(objectData.Data);
                }
            }

            let back = convertDatasToObject(
                name,
                rate,
                previsionDate,
                nextYear
            );
            return back;
        })
        .catch((error) => {
            console.error("Erro ao obter dados:", error);
            return averageDataBrazil(cod, name);
        });
}

function averageDataBrazil(cod, name) {
    const averageData = [
        { cod: 432, valueData: 8.5 },
        { cod: "432f", valueData: 8.5 },
        { cod: 4389, valueData: 8.4 },
        { cod: 13522, valueData: 7.0 },
        { cod: "13522f", valueData: 7.0 },
    ];

    let valueForCod;
    for (let i of averageData) {
        if (i.cod === cod) {
            valueForCod = i.valueData;
        }
    }
    let actualDate = getActualDateBrazil();

    if (name[name.length - 1] === "F") {
        name = `${name.substring(0, name.length - 1)} M`;
    }
    return convertDatasToObject(name, valueForCod, "Média BR", "Média BR");
}

function convertDatasToObject(indicator, value, dateObtained, dateReference) {
    let object = { indicator, value, dateObtained, dateReference };
    console.log("object", object);
    return object;
}
