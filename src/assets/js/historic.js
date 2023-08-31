let id = 0;
const numberMaxOfRegisters = 10;
nextId();

export function saveHistoric(...args) {
    let dataHistoric = [];
    let lastCalc = [id, ...args];
    id++;

    if (localStorage.getItem("historic") != null) {
        const dataJson = localStorage.getItem("historic");
        let dataList = JSON.parse(dataJson);

        mantainMaxRegistersCalcs(lastCalc[1], dataList);

        for (let i of dataList) {
            let obj = [];
            for (let j of i) {
                obj.push(j);
            }
            dataHistoric.push(obj);
        }
    }

    dataHistoric.push(lastCalc);
    const data = JSON.stringify(dataHistoric);
    localStorage.setItem("historic", data);
}

function mantainMaxRegistersCalcs(pageName, dataList) {
    let countHistorical = 0;
    let minimunIdCount;
    for (let i of dataList) {
        if (i[1] === pageName) {
            countHistorical++;
            if (i[0] < minimunIdCount || minimunIdCount === undefined) {
                minimunIdCount = i[0];
            }
        }
    }

    if (countHistorical >= numberMaxOfRegisters) {
        for (let i of dataList) {
            if (i[0] === minimunIdCount) {
                dataList.splice(i - 1, 1);
            }
        }
    }
}

function nextId() {
    if (localStorage.getItem("historic") != null) {
        const dataJson = localStorage.getItem("historic");
        const dataList = JSON.parse(dataJson);

        for (let i of dataList) {
            if (i[0] >= id) {
                id = i[0] + 1;
            }
        }
    }
}

function getHistoric(pageName) {
    let dataPrint = [];

    if (localStorage.getItem("historic") != null) {
        const dataJson = localStorage.getItem("historic");
        let dataList = JSON.parse(dataJson);

        for (let i of dataList) {
            if (i[1] === pageName) {
                dataPrint.push(i);
            }
        }
    }
    return dataPrint;
}

function printHistoric(dataToPrint) {
    let table = document.querySelector("#historic-table");

    if (dataToPrint.length === 0) {
        const tableContainer = document.querySelector(
            ".historic-table-container"
        );
        let newDiv = document.createElement("div");
        newDiv.textContent = "Sem histórico";
        newDiv.classList.add("no-table-data");

        tableContainer.appendChild(newDiv);

        return;
    }

    //Create row
    for (let i = dataToPrint.length - 1; i >= 0; i--) {
        let newRow = table.insertRow();

        //Create and feed cells
        for (let j = 0; j < dataToPrint[i].length; j++) {
            if (j === 1) {
                continue;
            }
            let newCell = newRow.insertCell();
            newCell.innerHTML = dataToPrint[i][j];
        }
    }
}

function clearTableOnClose() {
    let table = document.querySelector("#historic-table");
    let rows = table.getElementsByTagName("tr");
    const tableContainer = document.querySelector(".historic-table-container");
    const noTableDataDiv = tableContainer.querySelector(".no-table-data");

    if (noTableDataDiv !== null) {
        noTableDataDiv.remove();
    }

    if (rows.length > 1) {
        for (var i = rows.length - 1; i > 0; i--) {
            table.deleteRow(i);
        }
    }
}

export function clearHistoric(pageName) {
    let hasHistoric = false;
    if (localStorage.getItem("historic") != null) {
        let dataHistoric = [];
        const dataJson = localStorage.getItem("historic");
        let dataList = JSON.parse(dataJson);

        for (let i of dataList) {
            if (i[1] === pageName) {
                hasHistoric = true;
                continue;
            }
            let obj = [];
            for (let j of i) {
                obj.push(j);
            }
            dataHistoric.push(obj);
        }

        if (dataHistoric.length != 0) {
            const data = JSON.stringify(dataHistoric);
            localStorage.setItem("historic", data);
        } else {
            localStorage.removeItem("historic");
        }

        clearTableOnClose();
        printHistoric(getHistoric(pageName));
    }

    if (hasHistoric === false) {
        return alert("Sem histórico para limpar!");
    }
}

export function closeHistoric() {
    const historic = document.querySelector(".historic-container");
    historic.classList.add("hidden");
    clearTableOnClose();
}

export function openHistoric(pageName) {
    const historic = document.querySelector(".historic-container");
    historic.classList.remove("hidden");
    printHistoric(getHistoric(pageName));
}
