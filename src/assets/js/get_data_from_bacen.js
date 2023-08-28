import { convertDateToBrazil, getActualDateBrazil, getNextYear } from "./utils";

export async function selicMetaAA() {
    const url =
        "https://corsproxy.io/?https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados?formato=json";

    try {
        let back = await requestToApiBacen(url, 432, "SELIC");
        return back;
    } catch (error) {
        console.error("Erro:", error);
        return averageDataBrazil(432, "SELIC");
    }
}

export async function ipcaAA() {
    const url =
        "https://corsproxy.io/?https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados?formato=json";

    try {
        let back = await requestToApiBacen(url, 13522, "IPCA");
        return back;
    } catch (error) {
        console.error("Erro:", error);
        return averageDataBrazil(13522, "IPCA");
    }
}

export async function selicFutureAA() {
    const url =
        "https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoTop5Anuais?$top=5&$filter=Indicador%20eq%20'Selic'&$orderby=Data%20desc&$format=json&$select=Indicador,Data,DataReferencia,Media";
    const apiKey = "dsjknverui!@151#54cd@FD";
    try {
        let back = await requestToApiFocus(url, apiKey, "432f", `*SELIC F`);
        return back;
    } catch (error) {
        console.error("Erro:", error);
        return averageDataBrazil("432f", `SELIC F`);
    }
}

export async function ipcaFutureAA() {
    const url =
        "https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoTop5Anuais?$top=5&$filter=Indicador%20eq%20'IPCA'&$orderby=Data%20desc&$format=json&$select=Indicador,Data,DataReferencia,Media";
    const apiKey = "dsjknverui!@151#54cd@FD";
    try {
        let back = await requestToApiFocus(url, apiKey, "13522f", `*IPCA F`);
        return back;
    } catch (error) {
        console.error("Erro:", error);
        return averageDataBrazil("13522f", "IPCA F");
    }
}

async function requestToApiBacen(url, cod, name) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
        });
        const data = await response.json();

        const rate = data[data.length - 1].valor;
        let actualDate = getActualDateBrazil();
        const actualYear = getNextYear() - 1;

        let back = convertDatasToObject(name, rate, actualDate, actualYear);
        return back;
    } catch (error) {
        console.error("Erro ao obter dados:", error);
        return averageDataBrazil(cod, name);
    }
}

async function requestToApiFocus(url, apiKey, cod, name) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });
        const data = await response.json();

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

        let back = convertDatasToObject(name, rate, previsionDate, nextYear);
        return back;
    } catch (error) {
        console.error("Erro ao obter dados:", error);
        return averageDataBrazil(cod, name);
    }
}

export function averageDataBrazil(cod, name) {
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
    return object;
}
