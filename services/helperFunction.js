export function getLast12Months(){
    const now = new Date();
    const months = [];

    for (let i = 11; i>=0; i--){
        const date = new Date(now.getFullYear(), now.getMonth()-i, 1);
        months.push({
            label: date.toLocaleString('default', {month:'short'}),
            year: date.getFullYear(),
            month:date.getMonth()
        });
    }

    return months;
}