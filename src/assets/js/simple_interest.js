import { convertCBInterest, convertoCBTime } from "./transforms";

export function simpleInterst() {
    const initialValue = document.querySelector("#initial-value");
    const interest = document.querySelector("#interest");
    const interestTimeCB = document.querySelector("#interest-time");
    const time = document.querySelector("#time");
    const investedTime = document.querySelector("#invested-time");
    const calculateButton = document.querySelector("#calculate");
    const cleanButton = document.querySelector("#clean");

    function clearFields() {
        initialValue.value = "";
        interest.value = "";
        interestTimeCB.selectedIndex = 2;
        time.value = "";
        investedTime.selectedIndex = 2;
    }

    // function dayToYear(days) {
    //     return days / 365.25;
    // }

    // function monthToYear(months) {
    //     return months / 12;
    // }

    // function interestPerDayToYear(interest) {
    //     return (1 + interest) ** 360 - 1;
    // }

    // function interestPerMonthToYear(interest) {
    //     return (1 + interest) ** 12 - 1;
    // }

    // function convertCBInterest(interest, comboBoxIndex) {
    //     if (comboBoxIndex === 0) {
    //         return (interest = interestPerDayToYear(interest));
    //     }
    //     if (comboBoxIndex === 1) {
    //         return (interest = interestPerMonthToYear(interest));
    //     }
    //     return interest;
    // }

    // function convertoCBTime(time, comboBoxIndex) {
    //     if (comboBoxIndex === 0) {
    //         return (time = dayToYear(time));
    //     }
    //     if (comboBoxIndex === 1) {
    //         return (time = monthToYear(time));
    //     }
    //     return time;
    // }

    function calculateSimpleInterest() {
        let interestDecimal = interest.value / 100;
        let interestPerYear = convertCBInterest(
            interestDecimal,
            interestTimeCB.selectedIndex
        );
        let timePerYear = convertoCBTime(
            time.value,
            investedTime.selectedIndex
        );

        let tax = initialValue.value * interestPerYear * timePerYear;
        let amount = Number(initialValue.value) + Number(tax);

        console.log(amount);
    }

    document.addEventListener("click", (evt) => {
        const el = evt.target;
        if (el.classList.contains("button-primary")) {
            calculateSimpleInterest();
        }

        if (el.classList.contains("button-clean")) {
            clearFields();
        }
    });
}

simpleInterst();
