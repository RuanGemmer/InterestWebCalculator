import "../css/remedy.css";
import "../css/style.css";
import "../img/Calculator-white.svg";
import "../img/Calculator.svg";
import "../img/credit-card.svg";
import "../img/exponential.svg";
import "../img/linear.svg";
import "../img/money.svg";
import "../img/percent.svg";
import { simpleInterst } from "./simple_interest";
import { totalBuy } from "./total_buy";

function currentPage() {
    const currentPageOpen = window.location.pathname;
    const currentPageName = currentPageOpen.substring(
        currentPageOpen.lastIndexOf("/") + 1
    );

    if (currentPageName === "simple_interest.html") {
        simpleInterst();
    }

    if (currentPageName === "total_buy.html") {
        totalBuy();
    }
}

currentPage();
