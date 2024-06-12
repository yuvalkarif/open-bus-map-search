import { useEffect, useState } from 'react'
import { BASE_PATH } from './apiConfig'
import moment from 'moment'
export interface Agency {
  date: string // example - "2019-07-01"
  operator_ref: number // example - 25,
  agency_name: string // example - "אלקטרה אפיקים"
}

let agencyList: Agency[]

/**
 * Fetch agency data from MOT api
 * @returns Agency data array, might contain DUPLICATE agencies with different `date` values
 */
export default async function getAgencyList(): Promise<Agency[]> {
  if (!agencyList) {
    const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD')
    const response = await fetch(`${BASE_PATH}/gtfs_agencies/list?date_from=${yesterday}`)
    const data = (await response.json()) as Awaited<Agency[]>
    agencyList = data.filter(Boolean) // filter empty entries
  }
  return agencyList
}

export function useAgencyList() {
  const [agencyList, setAgencyList] = useState<Agency[]>([])

  useEffect(() => {
    getAgencyList().then(setAgencyList).catch(console.log)
  }, [])

  return agencyList
}
