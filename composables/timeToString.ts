export default function (date: Date) {
  if (date.getMinutes() < 10)
        return (date.getHours() + 'h0' + date.getMinutes())
      return (date.getHours() + 'h' + date.getMinutes())
}