import {
    ipcaAA,
    ipcaFutureAA,
    selicFutureAA,
    selicMetaAA,
} from "./get_data_from_bacen";
import { formatNumberBrazil } from "./utils";

export async function feedIndicators() {
    try {
        await selicActual();
    } catch (error) {
        console.error("Erro em selicActual:", error);
    }

    try {
        await selicFuture();
    } catch (error) {
        console.error("Erro em selicFuture:", error);
    }

    try {
        await ipcaActual();
    } catch (error) {
        console.error("Erro em ipcaActual:", error);
    }

    try {
        await ipcaFuture();
    } catch (error) {
        console.error("Erro em ipcaFuture:", error);
    }
}

async function selicActual() {
    const indicatorTitle1 = document.querySelector("#indicator-title1");
    const indicatorValue1 = document.querySelector("#indicator-value1");
    const indicatorDate1 = document.querySelector("#indicator-date1");
    const indicator1 = document.querySelector(".indicator1");

    const selicActualData = await selicMetaAA();

    indicator1.classList.remove("fa-solid");
    indicator1.classList.remove("fa-spinner");
    indicator1.classList.remove("fa-spin-pulse");

    indicatorTitle1.innerHTML = `${selicActualData.indicator}:&nbsp`;
    indicatorValue1.innerHTML = `${selicActualData.value.replace(
        ".",
        ","
    )}% <br>`;
    indicatorDate1.innerHTML = selicActualData.dateObtained;
}

async function ipcaActual() {
    const indicatorTitle2 = document.querySelector("#indicator-title2");
    const indicatorValue2 = document.querySelector("#indicator-value2");
    const indicatorDate2 = document.querySelector("#indicator-date2");
    const indicator2 = document.querySelector(".indicator2");

    const ipcaActualData = await ipcaAA();

    indicator2.classList.remove("fa-solid");
    indicator2.classList.remove("fa-spinner");
    indicator2.classList.remove("fa-spin-pulse");
    indicator2.classList.add("border-left");

    indicatorTitle2.innerHTML = `${ipcaActualData.indicator}:&nbsp`;
    indicatorValue2.innerHTML = `${ipcaActualData.value.replace(
        ".",
        ","
    )}% <br>`;
    indicatorDate2.innerHTML = ipcaActualData.dateObtained;
}

async function selicFuture() {
    const indicatorTitle3 = document.querySelector("#indicator-title3");
    const indicatorValue3 = document.querySelector("#indicator-value3");
    const indicatorDate3 = document.querySelector("#indicator-date3");
    const indicator3 = document.querySelector(".indicator3");

    const selicFutureData = await selicFutureAA();

    indicator3.classList.remove("fa-solid");
    indicator3.classList.remove("fa-spinner");
    indicator3.classList.remove("fa-spin-pulse");
    indicator3.classList.add("border-left");

    indicatorTitle3.innerHTML = `${selicFutureData.indicator}:&nbsp`;
    indicatorValue3.innerHTML = `${formatNumberBrazil(
        selicFutureData.value
    )}% <br>`;
    indicatorDate3.innerHTML = selicFutureData.dateObtained;
}

async function ipcaFuture() {
    const indicatorTitle4 = document.querySelector("#indicator-title4");
    const indicatorValue4 = document.querySelector("#indicator-value4");
    const indicator4 = document.querySelector(".indicator4");
    const indicatorDate4 = document.querySelector("#indicator-date4");

    const ipcaFutureData = await ipcaFutureAA();

    indicator4.classList.remove("fa-solid");
    indicator4.classList.remove("fa-spinner");
    indicator4.classList.remove("fa-spin-pulse");
    indicator4.classList.add("border-left");

    indicatorTitle4.innerHTML = `${ipcaFutureData.indicator}:&nbsp`;
    indicatorValue4.innerHTML = `${formatNumberBrazil(
        ipcaFutureData.value
    )}% <br>`;
    indicatorDate4.innerHTML = ipcaFutureData.dateObtained;
}
