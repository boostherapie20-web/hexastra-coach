export function getTopK(domain: string, messageLength: number) {

  if (domain === "gps_kua") return 20

  if (domain === "neurokua") return 20

  if (domain === "fusion") return 28

  if (messageLength > 400) return 24

  return 16

}