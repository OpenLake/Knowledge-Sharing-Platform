export const generateYears = () => {
    var max = new Date().getFullYear()
    var min = max - 10
    var years = []
    let index = 0
    for (var i = max; i >= min; i--) {
        years.push({
            id: index,
            name: i.toString(),
        })
    }
    return years
}
