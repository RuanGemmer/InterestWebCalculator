import { convertCBInterest, convertoCBTime } from "./transforms";
import { formatCurrencyToFloat, formatToCurrency } from "./utils";
import { hasNotEmptyFields } from "./validation";

export function simpleInterest() {
    const initialValue = document.querySelector("#initial-value");
    const interest = document.querySelector("#interest");
    const interestTimeCB = document.querySelector("#interest-time");
    const time = document.querySelector("#time");
    const investedTime = document.querySelector("#invested-time");
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

    return {
        testEmpty,
        calculateSimpleInterest,
        clearFields,
    };
}
