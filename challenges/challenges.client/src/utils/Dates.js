// export function formatDateAndTime(date) {
//     const formattedDate = new Date(date).toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     })
//     const formattedTime = new Date(date).toLocaleTimeString('en-US', {
//       hour: 'numeric',
//       minute: 'numeric'
//     })
//     return {
//       formattedDate,
//       formattedTime
//     }
// }

export class DateFormat{
    formateDate(date){
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        return formattedDate;
    }
    formateTime(time){
        const formattedTime = new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric'
        })
        return formattedTime;
    }
}