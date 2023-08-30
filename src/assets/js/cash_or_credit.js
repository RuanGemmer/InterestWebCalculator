import { interestCompoundPerYearToMonth } from "./transforms";
import { formatCurrencyToFloat, getIrpfInterestBrazil } from "./utils";
import { hasNotEmptyFields } from "./validation";
let selicActual;
let ipcaActual;
let selicFuture;
let ipcaFuture;

export function getIndicators(
    actualSelic,
    actualIpca,
    futureSelic,
    futureIpca
) {
    selicActual = actualSelic;
    ipcaActual = actualIpca;
    selicFuture = parseFloat(futureSelic.toFixed(2));
    ipcaFuture = parseFloat(futureIpca.toFixed(2));
}

export function cashOrCredit() {
    // User Variables
    const termBuyValue = document.querySelector("#term-purchase");
    const cashBuyValue = document.querySelector("#cash-purchase");
    const installments = document.querySelector("#installments");
    const investmentCB = document.querySelector("#investment");
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
        userIpca.value = "";
        userIpcaTimeCB.selectedIndex = 1;
        performance.value = "";
        performanceTimeCB.selectedIndex = 1;
        userIncomeTax.value = "";

        collapseAdvanceCalc();
        resultsContainer.classList.add("yes");
    }

    function calc() {
        let termBuyDecimal = formatCurrencyToFloat(termBuyValue.value);
        let cashBuyDecimal = formatCurrencyToFloat(cashBuyValue.value);
        let installmentsDecimal = formatCurrencyToFloat(installments.value);
        let installmentValue = parseFloat(termBuyDecimal / installmentsDecimal);
        realCashRemunerationOnCreditPaid(
            installmentsDecimal,
            installmentValue,
            cashBuyDecimal
        );
        realCashRemunerationOnCashPaid(
            installmentsDecimal,
            termBuyDecimal,
            cashBuyDecimal
        );
        // printResults(ammout, totalContribution, insterestPaid);
    }

    function realCashRemunerationOnCashPaid(
        installments,
        termBuy,
        cashBuyDecimal
    ) {
        let investmentReturn = parseFloat(
            investmentAndFeeReturn(installments).return
        );
        let ransomFee = parseFloat(
            investmentAndFeeReturn(installments).ransomFee
        );
        let diferencePaid = termBuy - cashBuyDecimal;

        let cashAmmout = diferencePaid;
        for (let i = 0; i < installments; i++) {
            let lastAmmout = cashAmmout;
            cashAmmout = parseFloat(lastAmmout * investmentReturn + cashAmmout);
        }

        let totalReturn = cashAmmout - diferencePaid;
        console.log("totalReturn", totalReturn);

        let returnWithFee = totalReturn * ransomFee;
        const cashReturnProportion = 1 + returnWithFee / cashBuyDecimal;
        const inflationProportion = (1 + inflationMonth()) ** installments;

        let realReturn =
            (cashReturnProportion / inflationProportion - 1) * diferencePaid;
        console.log("realReturn", realReturn);
    }

    function realCashRemunerationOnCreditPaid(
        installments,
        installmentValue,
        cashBuyDecimal
    ) {
        let investmentReturn = parseFloat(
            investmentAndFeeReturn(installments).return
        );
        let ransomFee = parseFloat(
            investmentAndFeeReturn(installments).ransomFee
        );

        let totalReturn = 0;
        let cashAmmout = cashBuyDecimal;
        for (let i = 0; i < installments; i++) {
            let lastAmmout = cashAmmout;
            cashAmmout = parseFloat(
                lastAmmout * investmentReturn + (cashAmmout - installmentValue)
            );
            if (cashAmmout - lastAmmout + installmentValue > 0) {
                totalReturn += cashAmmout - lastAmmout + installmentValue;
            }
        }

        let returnWithFee = totalReturn * ransomFee;
        const cashReturnProportion = 1 + returnWithFee / cashBuyDecimal;
        const inflationProportion = (1 + inflationMonth()) ** installments;

        let realReturn =
            (cashReturnProportion / inflationProportion - 1) * cashBuyDecimal;
        console.log("realReturn", realReturn);
    }

    function inflationMonth() {
        let inflationMonth = 0;
        if (investmentCB.value === "investment-others") {
            if (userIpcaTimeCB.value === "ipca-time-year") {
                inflationMonth = interestCompoundPerYearToMonth(
                    formatCurrencyToFloat(userIpca.value) / 100
                );
            }
            inflationMonth = formatCurrencyToFloat(userIpca.value) / 100;
        } else {
            const inflationActualMonth = interestCompoundPerYearToMonth(
                ipcaActual / 100
            );

            inflationMonth = inflationActualMonth;
        }

        return parseFloat(inflationMonth);
    }

    function investmentAndFeeReturn(installments) {
        const selicMetaActualMonth = interestCompoundPerYearToMonth(
            selicActual / 100
        );
        const selicOverActualMonth = interestCompoundPerYearToMonth(
            (selicActual - 0.1) / 100
        );

        if (investmentCB.value === "investment-none") {
            return { return: 0, ransomFee: 1 };
        }
        if (investmentCB.value === "investment-savings") {
            if (selicMetaActualMonth <= 0.085) {
                return { return: 0.005, ransomFee: 1 };
            }
            return { return: selicOverActualMonth * 0.7, ransomFee: 1 };
        }
        if (investmentCB.value === "investment-selic") {
            return {
                return: selicOverActualMonth,
                ransomFee: getIrpfInterestBrazil(installments),
            };
        }
        if (investmentCB.value === "investment-80-cdi") {
            return {
                return: selicOverActualMonth * 0.8,
                ransomFee: getIrpfInterestBrazil(installments),
            };
        }
        if (investmentCB.value === "investment-90-cdi") {
            return {
                return: selicOverActualMonth * 0.9,
                ransomFee: getIrpfInterestBrazil(installments),
            };
        }
        if (investmentCB.value === "investment-100-cdi") {
            return {
                return: selicOverActualMonth,
                ransomFee: getIrpfInterestBrazil(installments),
            };
        }
        if (investmentCB.value === "investment-110-cdi") {
            return {
                return: selicOverActualMonth * 1.1,
                ransomFee: getIrpfInterestBrazil(installments),
            };
        }
        if (investmentCB.value === "investment-others") {
            let performanceMonth =
                formatCurrencyToFloat(performance.value) / 100;
            if (performanceTimeCB.selectedIndex === 1) {
                performanceMonth = interestCompoundPerYearToMonth(
                    formatCurrencyToFloat(performance.value) / 100
                );
            }

            let incomeTaxValue =
                formatCurrencyToFloat(userIncomeTax.value) / 100;

            return { return: performanceMonth, ransomFee: incomeTaxValue };
        }
    }

    function printResults(total, contributionTotal, insterestPaid) {
        result0.innerHTML = formatToCurrency(total);
        result1.innerHTML = formatToCurrency(contributionTotal);
        result2.innerHTML = formatToCurrency(insterestPaid);

        resultsContainer.classList.remove("yes");
        resultsContainer.scrollIntoView({ behavior: "smooth" });
    }

    function addLoaders() {
        const indicator1 = document.querySelector(".indicator1");
        const indicator2 = document.querySelector(".indicator2");
        const indicator3 = document.querySelector(".indicator3");
        const indicator4 = document.querySelector(".indicator4");

        indicator1.classList.add("fa-solid");
        indicator1.classList.add("fa-spinner");
        indicator1.classList.add("fa-spin-pulse");

        indicator2.classList.add("fa-solid");
        indicator2.classList.add("fa-spinner");
        indicator2.classList.add("fa-spin-pulse");

        indicator3.classList.add("fa-solid");
        indicator3.classList.add("fa-spinner");
        indicator3.classList.add("fa-spin-pulse");

        indicator4.classList.add("fa-solid");
        indicator4.classList.add("fa-spinner");
        indicator4.classList.add("fa-spin-pulse");
    }

    return {
        testEmpty,
        calc,
        clearFields,
        closeExpandAdvancedCalc,
        othersInvestmentsSelected,
        addLoaders,
    };
}
