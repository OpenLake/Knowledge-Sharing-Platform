export const isStringMatch = (inputString: string, originalString: string) => {
    var exp = new RegExp(inputString, 'i')
    if(!originalString) return false
    if (originalString.search(exp) !== -1) return true
    else return false
}
