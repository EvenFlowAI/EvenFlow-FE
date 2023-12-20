export const getNameFromEnum = (str: string) => {
    let array = [];
    for (let i = 0; i < str.length; i++) {
        if (str[i] === str[i].toUpperCase() && i > 0) {
            array.push(' ');
        }
        array.push(str[i]);
    }
    return array.join('')
}
