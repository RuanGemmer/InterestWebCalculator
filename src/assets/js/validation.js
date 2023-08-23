export function hasNotEmptyFields(field, fieldName, command, ...args) {
    let hasNotEmpty = true;
    if ((args.length = 1)) {
        if (field.value === command || args[0]) {
            toastr.error(`Campo ${fieldName} deve ser preenchido corretamente`);
            field.classList.add("error");
            field.nextElementSibling.classList.add("error-title");
            hasNotEmpty = false;
        } else {
            field.classList.remove("error");
            field.nextElementSibling.classList.remove("error-title");
        }
    } else {
        if (field.value === "") {
            toastr.error(`Campo ${fieldName} deve ser preenchido corretamente`);
            field.classList.add("error");
            field.nextElementSibling.classList.add("error-title");
            hasNotEmpty = false;
        } else {
            field.classList.remove("error");
            field.nextElementSibling.classList.remove("error-title");
        }
    }
    return hasNotEmpty;
}
