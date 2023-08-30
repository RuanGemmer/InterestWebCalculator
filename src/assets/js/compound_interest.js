import {
    convertCBInterestToMonth,
    convertoCBTimeToMonth,
    interestCompoundPerMonthToDay,
} from "./transforms";
import { formatCurrencyToFloat, formatToCurrency } from "./utils";
import { hasNotEmptyFields } from "./validation";

export function compoundInterest() {
    const initialValue = document.querySelector("#initial-value");
    const contribution = document.querySelector("#contribution");
    const interest = document.querySelector("#interest");
    const interestTimeCB = document.querySelector("#interest-time");
    const time = document.querySelector("#time");
    const investedTimeCB = document.querySelector("#invested-time");
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

        if (
            !hasNotEmptyFields(
                contribution,
                "APORTE",
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
        investedTimeCB.selectedIndex = 2;
        contribution.value = "";

        resultsContainer.classList.add("yes");
    }

    function calc() {
        let interestDecimal = formatCurrencyToFloat(interest.value) / 100;
        let initialValueFloat = formatCurrencyToFloat(initialValue.value);

        let contributionFloat;
        if (contribution.value === "") {
            contributionFloat = 0;
        } else {
            contributionFloat = formatCurrencyToFloat(contribution.value);
        }

        let interestPerMonth = convertCBInterestToMonth(
            interestDecimal,
            interestTimeCB.selectedIndex
        );
        let timePerMonth = convertoCBTimeToMonth(
            time.value,
            investedTimeCB.selectedIndex
        );

        let ammout = initialValueFloat;

        if (investedTimeCB.selectedIndex === 0) {
            let timePerDay = timePerMonth * 30;
            let contributionFloatPerDay = contributionFloat / 30;
            for (let i = 0; i < timePerDay; i++) {
                ammout *= 1 + interestCompoundPerMonthToDay(interestPerMonth);
                ammout += contributionFloatPerDay;
            }
        } else {
            for (let i = 0; i < timePerMonth; i++) {
                ammout *= 1 + interestPerMonth;
                ammout += contributionFloat;
            }
        }

        let totalContribution =
            initialValueFloat + contributionFloat * timePerMonth;
        let insterestPaid = ammout - totalContribution;

        printResults(ammout, totalContribution, insterestPaid);
    }

    function printResults(total, contributionTotal, insterestPaid) {
        result0.innerHTML = formatToCurrency(total);
        result1.innerHTML = formatToCurrency(contributionTotal);
        result2.innerHTML = formatToCurrency(insterestPaid);

        resultsContainer.classList.remove("yes");
        resultsContainer.scrollIntoView({ behavior: "smooth" });
    }

    function name() {
        return "compoundinterest";
    }

    return {
        testEmpty,
        calc,
        clearFields,
        name,
    };
}
