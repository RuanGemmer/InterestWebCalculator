import { formatCurrencyToFloat } from "./utils";
import { hasNotEmptyFields } from "./validation";

export function cashOrCredit() {
    // User Variables
    const termBuyValue = document.querySelector("#term-purchase");
    const cashBuyValue = document.querySelector("#cash-purchase");
    const installments = document.querySelector("#installments");
    const investmentCB = document.querySelector("#investment");
    const userSelic = document.querySelector("#selic");
    const userSelicTimeCB = document.querySelector("#selic-time");
    const userIpca = document.querySelector("#ipca");
    const userIpcaTimeCB = document.querySelector("#ipca-time");
    const performance = document.querySelector("#performance");
    const performanceTimeCB = document.querySelector("#performance-time");
    const userIncomeTax = document.querySelector("#income-tax");

    // Ellements for manipulation
    const advancedCalcIcon = document.querySelector(
        "#advanced-calculator-icon"
    );
    const advancedCalcDiv = document.querySelector(".hidden-advanced-div");
    const advancedCalcHr = document.querySelector(".hidden-advanced-hr");
    const resultsContainer = document.querySelector(".hidden");

    //Extra validations
    function testEmpty() {
        let hasEmpty = true;
        if (
            !hasNotEmptyFields(
                termBuyValue,
                "VALOR TOTAL DA COMPRA PARCELADA",
                termBuyValue.value === ""
            )
        ) {
            hasEmpty = false;
        }

        if (
            !hasNotEmptyFields(
                cashBuyValue,
                "VALOR DA COMPRA À VISTA",
                cashBuyValue.value === ""
            )
        ) {
            hasEmpty = false;
        }

        if (
            !hasNotEmptyFields(
                installments,
                "N° DE PARCELAS",
                installments.value === "" || installments.value <= 0
            )
        ) {
            hasEmpty = false;
        }

        if (investmentCB.value === "investment-others") {
            if (
                !hasNotEmptyFields(
                    performance,
                    "RENDIMENTO INVESTIMENTOS",
                    performance.value === "" ||
                        isNaN(formatCurrencyToFloat(performance.value))
                )
            ) {
                expandAdvanceCalc();
                hasEmpty = false;
            }

            if (
                !hasNotEmptyFields(
                    userIncomeTax,
                    "RENDIMENTO INVESTIMENTOS",
                    userIncomeTax.value === "" ||
                        isNaN(formatCurrencyToFloat(userIncomeTax.value))
                )
            ) {
                expandAdvanceCalc();
                hasEmpty = false;
            }
        }

        return hasEmpty;
    }

    function collapseAdvanceCalc() {
        advancedCalcIcon.classList.remove("fa-caret-up");
        advancedCalcIcon.classList.add("fa-caret-down");
        advancedCalcDiv.classList.add("yes");
        advancedCalcHr.classList.add("yes");
    }

    function expandAdvanceCalc() {
        advancedCalcIcon.classList.remove("fa-caret-down");
        advancedCalcIcon.classList.add("fa-caret-up");
        advancedCalcDiv.classList.remove("yes");
        advancedCalcHr.classList.remove("yes");
    }

    function closeExpandAdvancedCalc() {
        if (advancedCalcDiv.classList.contains("yes")) {
            expandAdvanceCalc();
        } else {
            collapseAdvanceCalc();
        }
    }

    function othersInvestmentsSelected(selectedOption) {
        if (selectedOption === "investment-others") {
            expandAdvanceCalc();
        }
    }

    function clearFields() {
        termBuyValue.value = "";
        cashBuyValue.value = "";
        installments.value = "";
        investmentCB.selectedIndex = 0;
        userSelic.value = "";
        userSelicTimeCB.selectedIndex = 2;
        userIpca.value = "";
        userIpcaTimeCB.selectedIndex = 2;
        performance.value = "";
        performanceTimeCB.selectedIndex = 2;
        userIncomeTax.value = "";

        collapseAdvanceCalc();
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

    return {
        testEmpty,
        calc,
        clearFields,
        closeExpandAdvancedCalc,
        othersInvestmentsSelected,
    };
}
