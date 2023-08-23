export function dayToYear(days) {
    return days / 365.25;
}

export function monthToYear(months) {
    return months / 12;
}

export function interestPerDayToYear(interest) {
    return (1 + interest) ** 360 - 1;
}

export function interestPerMonthToYear(interest) {
    return (1 + interest) ** 12 - 1;
}

export function convertCBInterest(interest, comboBoxIndex) {
    if (comboBoxIndex === 0) {
        return (interest = interestPerDayToYear(interest));
    }
    if (comboBoxIndex === 1) {
        return (interest = interestPerMonthToYear(interest));
    }
    return interest;
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
