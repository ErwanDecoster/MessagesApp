export default function (tel: string) {
  let telcpy = tel.replaceAll(' ', '')
  telcpy = tel.replaceAll('.', '')
  telcpy = tel.replaceAll('-', '')
  return (telcpy)
}