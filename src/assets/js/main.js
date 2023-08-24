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

function currentPage() {
    const currentPageOpen = window.location.pathname;
    const currentPageName = currentPageOpen.substring(
        currentPageOpen.lastIndexOf("/") + 1
    );

    if (currentPageName === "simple_interest.html") {
        simpleInterst();
    }
}

currentPage();
