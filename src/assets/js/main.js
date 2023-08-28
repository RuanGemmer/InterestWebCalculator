import "../css/remedy.css";
import "../css/style.css";
import "../img/Calculator-white.svg";
import "../img/Calculator.svg";
import "../img/credit-card.svg";
import "../img/exponential.svg";
import "../img/linear.svg";
import "../img/money.svg";
import "../img/percent.svg";
import { cashOrCredit } from "./cash_or_credit";
import { compoundInterest } from "./compound_interest";
import { feedIndicators } from "./indicators";
import { simpleInterest } from "./simple_interest";
import { totalBuy } from "./total_buy";
import { digitFormatToCurrency, formatPercentageToFloat } from "./utils";

// Page init
function currentPage() {
    const currentPageOpen = window.location.pathname;
    const currentPageName = currentPageOpen.substring(
        currentPageOpen.lastIndexOf("/") + 1
    );
    let simpleInterestInstance;

    if (currentPageName === "simple_interest.html") {
        simpleInterestInstance = simpleInterest();
    }

    if (currentPageName === "total_buy.html") {
        simpleInterestInstance = totalBuy();
    }

    if (currentPageName === "compound_interest.html") {
        simpleInterestInstance = compoundInterest();
    }

    if (currentPageName === "cash_or_credit.html") {
        simpleInterestInstance = cashOrCredit();
        simpleInterestInstance.addLoaders();
        awaitFunctions(currentPageName);
    }

    globalEvent(simpleInterestInstance);
}

async function awaitFunctions(currentPageName) {
    if (currentPageName === "cash_or_credit.html") {
        await feedIndicators();
    }
}

// Global event listener
function globalEvent(functionPage) {
    document.addEventListener("click", (evt) => {
        const el = evt.target;
        if (el.classList.contains("button-primary")) {
            if (functionPage.testEmpty()) {
                functionPage.calc();
            }
        }

        if (el.classList.contains("button-clean")) {
            functionPage.clearFields();
        }

        if (
            el.classList.contains("advaced-calculator") ||
            el.classList.contains("advanced-calculator-icon")
        ) {
            functionPage.closeExpandAdvancedCalc();
        }
    });

    document.addEventListener("input", (evt) => {
        const el = evt.target;
        const currentValue = evt.target.value;

        if (el.classList.contains("number-validation")) {
            evt.target.value = digitFormatToCurrency(currentValue);
        }

        if (el.classList.contains("percent-validation")) {
            evt.target.value = formatPercentageToFloat(currentValue);
        }
    });

    document.addEventListener("change", (evt) => {
        const el = evt.target;
        if (el.classList.contains("investment")) {
            const selectedOption = evt.target.value;
            functionPage.othersInvestmentsSelected(selectedOption);
        }
    });
}

currentPage();
