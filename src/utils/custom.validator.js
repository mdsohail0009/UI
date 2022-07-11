
export const validateContentRule = (_,value) => {
    const reg = /<(.|\n)*?>/g;
    if (reg.test(value)) {
        return Promise.reject("Please enter valid content");
    }
    return Promise.resolve();
}
export const validateContent = (value) => {
    const reg = /<(.|\n)*?>/g;
    if (reg.test(value)) {
        return false;
    }
    return true;
}