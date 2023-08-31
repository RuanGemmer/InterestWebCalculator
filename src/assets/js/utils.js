export function digitFormatToCurrency(currentValue) {
    const value = currentValue.replace(/\D/g, "");
    const options = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };

    const formatter = new Intl.NumberFormat("pt-BR", options);
    return formatter.format(value / 100);
}

export function formatToCurrency(value) {
    const options = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };

    const formatter = new Intl.NumberFormat("pt-BR", options);
    return formatter.format(value);
}

export function formatCurrencyToFloat(number) {
    number = number.replace(/\./g, "");
    return Number(number.replace(",", "."));
}

export function formatNumberBrazil(value) {
    value = value.toFixed(2);
    return value.replace(".", ",");
}

export function formatPercentageToFloat(currentValue) {
    const value = currentValue.replace(/[^0-9.,]/g, "");
    const strippedValue = value.replace(/[^\d,]/g, "");
    const parts = strippedValue.split(",");
    let formattedValue = parts[0];
    if (parts.length > 1) {
        formattedValue += "," + parts[1].substring(0, 2);
    }

    return formattedValue;
}

export function numberIsFloat(number) {
    let decimalPlaces = number.toString().split(".")[1];

    if (decimalPlaces) {
        const threeDecimal = parseInt(decimalPlaces.substring(0, 3), 10);
        return threeDecimal > 0;
    }

    return false;
}

export function convertDateToBrazil(date) {
    const dateOriginal = date.toString();
    const dateObject = new Date(dateOriginal);

    let day = dateObject.getDate();
    let month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();

    if (month < 10) {
        month = `0${month}`;
    }

    if (day < 10) {
        day = `0${day}`;
    }

    return `${day}/${month}/${year}`;
}

export function getActualDateBrazil() {
    const dateObject = new Date();

    let day = fullZero(dateObject.getDate());
    let month = fullZero(dateObject.getMonth() + 1);
    const year = dateObject.getFullYear();

    return `${day}/${month}/${year}`;
}

export function getActualDateAndTimeBrazil() {
    const dateObject = new Date();

    let day = fullZero(dateObject.getDate());
    let month = fullZero(dateObject.getMonth() + 1);
    const year = dateObject.getFullYear();
    let hour = fullZero(dateObject.getHours());
    let minutes = fullZero(dateObject.getMinutes());
    let seconds = fullZero(dateObject.getSeconds());

    return `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;
}

function fullZero(number) {
    if (number < 10) {
        return `0${number}`;
    }
    return number;
}

export function getNextYear() {
    const actualDate = new Date();
    const actualYear = Number(actualDate.getFullYear());
    return Number(actualYear + 1);
}

export function getIrpfInterestBrazil(months) {
    if (months <= 180 / 30) {
        return 1 - 0.225;
    }
    if (months <= 360 / 30) {
        return 1 - 0.2;
    }
    if (months <= 720 / 30) {
        return 1 - 0.175;
    }
    if (months > 720 / 30) {
        return 1 - 0.15;
    }
}
