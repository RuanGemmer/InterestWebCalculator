import { convertCBInterest, convertoCBTime } from "./transforms";
import {
    digitFormatToCurrency,
    formatCurrencyToFloat,
    formatPercentage,
    formatToCurrency,
} from "./utils";
import { hasNotEmptyFields } from "./validation";

export function simpleInterst() {
    const initialValue = document.querySelector("#initial-value");
    const interest = document.querySelector("#interest");
    const interestTimeCB = document.querySelector("#interest-time");
    const time = document.querySelector("#time");
    const investedTime = document.querySelector("#invested-time");
    const calculateButton = document.querySelector("#calculate");
    const cleanButton = document.querySelector("#clean");
    const resultsContainer = document.querySelector(".hidden");
    const result0 = document.querySelector("#value-0");
    const result1 = document.querySelector("#value-1");
    const result2 = document.querySelector("#value-2");

    function testEmpty() {
        let hasEmpty = true;
        if (
            !hasNotEmptyFields(
                initialValue,
                "VALOR INICIAL",
                initialValue.value === ""
            )
        ) {
            hasEmpty = false;
        }

        if (
            !hasNotEmptyFields(
                time,
                "PERÍODO",
                time.value === "" || time.value < 0
            )
        ) {
            hasEmpty = false;
        }

        if (
            !hasNotEmptyFields(
                interest,
                "TAXA DE JUROS",
                interest.value === "" ||
                    isNaN(formatCurrencyToFloat(interest.value))
            )
        ) {
            hasEmpty = false;
        }
        return hasEmpty;
    }

    function clearFields() {
        initialValue.value = "";
        interest.value = "";
        interestTimeCB.selectedIndex = 2;
        time.value = "";
        investedTime.selectedIndex = 2;

        resultsContainer.classList.add("yes");
    }

    function calculateSimpleInterest() {
        let interestDecimal = formatCurrencyToFloat(interest.value) / 100;
        let initialValueFloat = formatCurrencyToFloat(initialValue.value);
        let interestPerYear = convertCBInterest(
            interestDecimal,
            interestTimeCB.selectedIndex,
            "simple"
        );
        let timePerYear = convertoCBTime(
            time.value,
            investedTime.selectedIndex
        );

        console.log(initialValueFloat);
        console.log(interestPerYear);
        console.log(timePerYear);
        let interestReceived =
            initialValueFloat * interestPerYear * timePerYear;
        let ammout = Number(initialValueFloat) + Number(interestReceived);

        printResults(ammout, initialValue.value, interestReceived);
    }

    function printResults(ammout, originalValue, interestRecived) {
        result0.innerHTML = formatToCurrency(ammout);
        result1.innerHTML = originalValue;
        result2.innerHTML = formatToCurrency(interestRecived);

        resultsContainer.classList.remove("yes");
        resultsContainer.scrollIntoView({ behavior: "smooth" });
    }

    document.addEventListener("click", (evt) => {
        const el = evt.target;
        if (el.classList.contains("button-primary")) {
            if (testEmpty()) {
                calculateSimpleInterest();
            }
        }

        if (el.classList.contains("button-clean")) {
            clearFields();
        }
    });

    document.addEventListener("input", (evt) => {
        const el = evt.target;
        const currentValue = evt.target.value;

        if (el.classList.contains("initial-value")) {
            evt.target.value = digitFormatToCurrency(currentValue);
        }

        if (el.classList.contains("interest")) {
            evt.target.value = formatPercentage(currentValue);
        }
    });
}
