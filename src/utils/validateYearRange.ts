export const validateYearRange = (fromYear: string, toYear: string) => {
    if (parseInt(toYear) - parseInt(fromYear) >= 0) return true
    else return false
}
