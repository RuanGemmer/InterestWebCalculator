import "../css/remedy.css";
import "../css/style.css";
import "../img/Calculator-white.svg";
import "../img/Calculator.svg";
import "../img/credit-card.svg";
import "../img/exponential.svg";
import "../img/linear.svg";
import "../img/money.svg";
import "../img/percent.svg";
import { compoundInterest } from "./compound_interest";
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

    globalEvent(simpleInterestInstance);
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
    });

    document.addEventListener("input", (evt) => {
        const el = evt.target;
        const currentValue = evt.target.value;

        if (
            el.classList.contains("initial-value") ||
            el.classList.contains("contribution")
        ) {
            evt.target.value = digitFormatToCurrency(currentValue);
        }

        if (el.classList.contains("interest")) {
            evt.target.value = formatPercentageToFloat(currentValue);
        }
    });
}

currentPage();
