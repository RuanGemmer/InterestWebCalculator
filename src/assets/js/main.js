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
