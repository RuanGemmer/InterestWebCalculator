import { saveHistoric } from "./historic";
import { convertCBInterestToYear, convertoCBTimeToYear } from "./transforms";
import {
    formatCurrencyToFloat,
    formatNumberBrazil,
    formatToCurrency,
    getActualDateAndTimeBrazil,
} from "./utils";
import { hasNotEmptyFields } from "./validation";

export function totalBuy() {
    const initialValue = document.querySelector("#initial-value");
    const interest = document.querySelector("#interest");
    const interestTimeCB = document.querySelector("#interest-time");
    const time = document.querySelector("#time");
    const investedTime = document.querySelector("#invested-time");
    const installmentTime = document.querySelector("#installment-time");
    const resultsContainer = document.querySelector(".hidden");
    const result0 = document.querySelector("#value-0");
    const result1 = document.querySelector("#value-1");
    const result2 = document.querySelector("#value-2");
    const result3 = document.querySelector("#value-3");

    function testEmpty() {
        let hasEmpty = true;
        if (
            !hasNotEmptyFields(
                initialValue,
                "VALOR À VISTA DA COMPRA",
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

    function calc() {
        let interestDecimal = formatCurrencyToFloat(interest.value) / 100;
        let initialValueFloat = formatCurrencyToFloat(initialValue.value);
        let interestPerYear = convertCBInterestToYear(
            interestDecimal,
            interestTimeCB.selectedIndex,
            "compound"
        );
        let timePerYear = convertoCBTimeToYear(
            time.value,
            investedTime.selectedIndex
        );

        let interestTax = (1 + interestPerYear) ** timePerYear;
        let ammout = Number(initialValueFloat) * Number(interestTax);
        let installment = ammout / time.value;
        let insterestPaid = ammout - initialValueFloat;
        let percent = (ammout / initialValueFloat - 1) * 100;

        printResults(ammout, installment, insterestPaid, percent);
        saveHistoricCalc(
            interestPerYear,
            ammout,
            installment,
            insterestPaid,
            percent
        );
    }

    function printResults(total, installment, insterestPaid, percent) {
        installmentTime.innerHTML = investedTime.value;
        result0.innerHTML = formatToCurrency(total);
        result1.innerHTML = formatToCurrency(installment);
        result2.innerHTML = formatToCurrency(insterestPaid);
        result3.innerHTML = formatNumberBrazil(percent);

        resultsContainer.classList.remove("yes");
        resultsContainer.scrollIntoView({ behavior: "smooth" });
    }

    function saveHistoricCalc(
        interestPerYear,
        ammout,
        installment,
        insterestPaid,
        percent
    ) {
        saveHistoric(
            name(),
            getActualDateAndTimeBrazil(),
            `R$ ${initialValue.value}`,
            `${formatNumberBrazil(interestPerYear * 100)}%`,
            `${time.value} ${investedTime.value}`,
            `R$ ${formatToCurrency(ammout)}`,
            `R$ ${formatToCurrency(installment)} ao ${investedTime.value}`,
            `R$ ${formatToCurrency(insterestPaid)}`,
            `${formatNumberBrazil(percent)}%`
        );
    }

    function name() {
        return "totalbuy";
    }
    return {
        testEmpty,
        calc,
        clearFields,
        name,
    };
}
