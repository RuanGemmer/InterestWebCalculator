let id = 0;
nextId();

export function saveHistoric(...args) {
    let dataHistoric = [];
    let lastCalc = [id, ...args];
    id++;

    if (localStorage.getItem("historic") != null) {
        const dataJson = localStorage.getItem("historic");
        let dataList = JSON.parse(dataJson);

        console.log("lastCalc[1]", lastCalc[1]);
        mantainFiveCalcs(lastCalc[1], dataList);

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

function mantainFiveCalcs(pageName, dataList) {
    let countHistorical = 0;
    let minimunIdCount;
    for (let i of dataList) {
        if (i[1] === pageName) {
            countHistorical++;
            console.log("countHistorical", countHistorical);
            console.log("i[0]", i[0]);
            if (i[0] < minimunIdCount || minimunIdCount === undefined) {
                minimunIdCount = i[0];
                console.log("minimunIdCount", minimunIdCount);
            }
        }
    }

    if (countHistorical >= 5) {
        for (let i of dataList) {
            if (i[0] === minimunIdCount) {
                console.log("aqui");
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

function getHistoric() {
    const objetoSalvo = JSON.parse(localStorage.getItem("historic"));
    console.log(objetoSalvo);
}

export function closeHistoric() {
    const historic = document.querySelector(".historic-container");
    historic.classList.add("hidden");
}

export function openHistoric() {
    const historic = document.querySelector(".historic-container");
    historic.classList.remove("hidden");
}
