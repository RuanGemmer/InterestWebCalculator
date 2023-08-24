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
    return number.replace(",", ".");
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
