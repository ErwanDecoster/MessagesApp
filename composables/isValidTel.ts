export default function (tel: string) {
  let telcpy = tel.replaceAll(' ', '')
  telcpy = tel.replaceAll('.', '')
  telcpy = tel.replaceAll('-', '')
  if (telcpy.length != 10)
    return (0)
  return (1)
}