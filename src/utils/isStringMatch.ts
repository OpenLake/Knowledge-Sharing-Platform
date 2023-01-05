export const isStringMatch = (inputString: string, string: string) => {
    var exp = new RegExp(inputString, 'i')
    if (string.search(exp) !== -1) return true
    else return false
}
