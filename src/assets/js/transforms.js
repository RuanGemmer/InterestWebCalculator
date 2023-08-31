function dayToYear(days) {
    return Number(days / 365.25);
}

function monthToYear(months) {
    return Number(months / 12);
}

function dayToMonth(days) {
    return Number(days / 30);
}

function yearToMonth(years) {
    return Number(years * 12);
}

function interestCompoundPerDayToYear(interest) {
    return Number((1 + interest) ** 360 - 1);
}

export function interestCompoundPerMonthToYear(interest) {
    return Number((1 + interest) ** 12 - 1);
}

export function interestCompoundPerMonthToDay(interest) {
    return Number((1 + interest) ** (1 / 30) - 1);
}

function interestCompoundPerDayToMonth(interest) {
    return Number((1 + interest) ** 30 - 1);
}

export function interestCompoundPerYearToMonth(interest) {
    return Number((1 + interest) ** (1 / 12) - 1);
}

function interestSimplePerDayToYear(interest) {
    return Number(interest * 365.25);
}

function interestSimplePerMonthToYear(interest) {
    return Number(interest * 12);
}

export function convertCBInterestToMonth(interest, comboBoxIndex) {
    if (comboBoxIndex === 0) {
        return interestCompoundPerDayToMonth(interest);
    }
    if (comboBoxIndex === 2) {
        return interestCompoundPerYearToMonth(interest);
    }
    return interest;
}

export function convertCBInterestToYear(interest, comboBoxIndex, interestType) {
    if (interestType.toLowerCase() === "simple") {
        if (comboBoxIndex === 0) {
            return interestSimplePerDayToYear(interest);
        }
        if (comboBoxIndex === 1) {
            return interestSimplePerMonthToYear(interest);
        }
        return interest;
    } else {
        if (comboBoxIndex === 0) {
            return interestCompoundPerDayToYear(interest);
        }
        if (comboBoxIndex === 1) {
            return interestCompoundPerMonthToYear(interest);
        }
        return interest;
    }
}

export function convertoCBTimeToMonth(time, comboBoxIndex) {
    if (comboBoxIndex === 0) {
        return dayToMonth(time);
    }
    if (comboBoxIndex === 2) {
        return yearToMonth(time);
    }
    return time;
}

export function convertoCBTimeToYear(time, comboBoxIndex) {
    if (comboBoxIndex === 0) {
        return dayToYear(time);
    }
    if (comboBoxIndex === 1) {
        return monthToYear(time);
    }
    return time;
}
