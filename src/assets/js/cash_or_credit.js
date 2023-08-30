import { interestCompoundPerYearToMonth } from "./transforms";
import {
    formatCurrencyToFloat,
    formatNumberBrazil,
    formatToCurrency,
    getIrpfInterestBrazil,
} from "./utils";
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
    const result0 = document.querySelector("#value-0");
    const result1 = document.querySelector("#value-1");
    const result2 = document.querySelector("#value-2");
    const result3 = document.querySelector("#value-3");
    const result4 = document.querySelector("#value-4");

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

    function investmentsSelected(selectedOption) {
        if (selectedOption === "investment-others") {
            expandAdvanceCalc();
            userIncomeTax.disabled = false;
            performance.disabled = false;
            performanceTimeCB.disabled = false;
            userIpca.disabled = false;
            userIpcaTimeCB.disabled = false;
        } else {
            userIncomeTax.disabled = true;
            performance.disabled = true;
            performanceTimeCB.disabled = true;
            userIpca.disabled = true;
            userIpcaTimeCB.disabled = true;
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
        const termBuyDecimal = formatCurrencyToFloat(termBuyValue.value);
        const cashBuyDecimal = formatCurrencyToFloat(cashBuyValue.value);
        const installmentsDecimal = formatCurrencyToFloat(installments.value);
        const installmentValue = parseFloat(
            termBuyDecimal / installmentsDecimal
        );
        const remunerationOnCreditPaid = realCashRemunerationOnCreditPaid(
            installmentsDecimal,
            installmentValue,
            cashBuyDecimal
        );
        const remunerationOnCashPaid = realCashRemunerationOnCashPaid(
            installmentsDecimal,
            termBuyDecimal,
            cashBuyDecimal
        );

        const totalCashBuy = cashBuyDecimal - remunerationOnCashPaid;
        const totalTermBuy = termBuyDecimal - remunerationOnCreditPaid;
        if (totalCashBuy < totalTermBuy) {
            return printResults(
                totalCashBuy,
                totalTermBuy,
                remunerationOnCashPaid,
                remunerationOnCreditPaid,
                "À VISTA"
            );
        }
        return printResults(
            totalCashBuy,
            totalTermBuy,
            remunerationOnCashPaid,
            remunerationOnCreditPaid,
            "PARCELADO"
        );
    }

    function printResults(
        totalCash,
        totalTerm,
        cashRemuneration,
        termRemuneration,
        finalResult
    ) {
        result0.innerHTML = formatToCurrency(totalCash);
        result1.innerHTML = formatToCurrency(totalTerm);
        result2.innerHTML = formatToCurrency(cashRemuneration);
        result3.innerHTML = formatToCurrency(termRemuneration);
        result4.innerHTML = finalResult;

        resultsContainer.classList.remove("yes");
        resultsContainer.scrollIntoView({ behavior: "smooth" });
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
        const diferencePaid = parseFloat(termBuy - cashBuyDecimal);

        let cashAmmout = diferencePaid;
        for (let i = 0; i < installments; i++) {
            cashAmmout = parseFloat(cashAmmout * investmentReturn + cashAmmout);
        }

        let totalReturn = parseFloat(cashAmmout - diferencePaid);
        console.log("DIFERENCE totalReturn", totalReturn);
        console.log("DIFERENCE fee", ransomFee);

        let returnWithFee = totalReturn * ransomFee;
        const cashReturnProportion = 1 + returnWithFee / diferencePaid;
        const inflationProportion = (1 + inflationMonth()) ** installments;

        let realReturn =
            (cashReturnProportion / inflationProportion - 1) * diferencePaid;
        console.log("DIFERENCE realReturn", realReturn);
        return realReturn;
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
        let cashAmmout = [cashBuyDecimal];
        for (let i = 0; i < installments; i++) {
            cashAmmout.push(
                parseFloat(
                    cashAmmout[cashAmmout.length - 1] * investmentReturn +
                        (cashAmmout[cashAmmout.length - 1] - installmentValue)
                )
            );
            if (
                cashAmmout[cashAmmout.length - 1] -
                    cashAmmout[cashAmmout.length - 2] +
                    installmentValue >
                0
            ) {
                totalReturn +=
                    cashAmmout[cashAmmout.length - 1] -
                    cashAmmout[cashAmmout.length - 2] +
                    installmentValue;
            }
        }

        console.log("PARCELADO totalReturn", totalReturn);
        console.log("PARCELADO fee", ransomFee);

        let returnWithFee = totalReturn * ransomFee;
        const cashReturnProportion = 1 + returnWithFee / cashBuyDecimal;
        const inflationProportion = (1 + inflationMonth()) ** installments;

        let realReturn =
            (cashReturnProportion / inflationProportion - 1) * cashBuyDecimal;
        console.log("PARCELADO realReturn", realReturn);
        return realReturn;
    }

    function inflationMonth() {
        let inflationMonth = 0;
        if (investmentCB.value === "investment-others") {
            if (userIpca.value == "") {
                userIpca.value = formatNumberBrazil(ipcaActual);
                userIpcaTimeCB.selectedIndex = 1;
            }
            if (userIpcaTimeCB.value === "ipca-time-year") {
                inflationMonth = interestCompoundPerYearToMonth(
                    formatCurrencyToFloat(userIpca.value) / 100
                );
                console.log("inflationMonth", inflationMonth);
            } else {
                inflationMonth = formatCurrencyToFloat(userIpca.value) / 100;
            }
        } else {
            const inflationActualMonth = interestCompoundPerYearToMonth(
                ipcaActual / 100
            );

            inflationMonth = inflationActualMonth;
        }

        console.log("inflationMonth", inflationMonth);
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
                1 - formatCurrencyToFloat(userIncomeTax.value) / 100;

            return { return: performanceMonth, ransomFee: incomeTaxValue };
        }
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

    function name() {
        return "cashorcredit";
    }

    return {
        testEmpty,
        calc,
        clearFields,
        closeExpandAdvancedCalc,
        investmentsSelected,
        addLoaders,
        name,
    };
}
