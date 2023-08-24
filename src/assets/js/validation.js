export function hasNotEmptyFields(field, fieldName, validation) {
    let hasNotEmpty = true;
    if (validation) {
        toastr.error(`Campo ${fieldName} deve ser preenchido corretamente`);
        field.classList.add("error");
        field.nextElementSibling.classList.add("error-title");
        hasNotEmpty = false;
    } else {
        field.classList.remove("error");
        field.nextElementSibling.classList.remove("error-title");
    }
    return hasNotEmpty;
}
