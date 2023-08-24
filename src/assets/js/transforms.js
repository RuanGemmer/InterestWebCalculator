function dayToYear(days) {
    return days / 365.25;
}

function monthToYear(months) {
    return months / 12;
}

function interestCompoundPerDayToYear(interest) {
    return (1 + interest) ** 360 - 1;
}

function interestCompoundPerMonthToYear(interest) {
    return (1 + interest) ** 12 - 1;
}

function interestSimplePerDayToYear(interest) {
    return interest * 365.25;
}

function interestSimplePerMonthToYear(interest) {
    return interest * 12;
}

export function convertCBInterest(interest, comboBoxIndex, interestType) {
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

export function convertoCBTime(time, comboBoxIndex) {
    if (comboBoxIndex === 0) {
        return (time = dayToYear(time));
    }
    if (comboBoxIndex === 1) {
        return (time = monthToYear(time));
    }
    return time;
}
