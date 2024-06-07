import React from 'react'
import { useTranslation } from 'react-i18next'
import './HbarChart.scss'
import { Tooltip } from '@mui/material'

export type Entry = { name: string; total: number; actual: number; color?: string }
const numberFormatter = new Intl.NumberFormat('he-IL')

export function HbarChart({
  entries,
  complement = false, // complement the chart (100% - actual) instead of actual
}: {
  entries: Entry[]
  complement?: boolean
}) {
  const { t } = useTranslation()
  const percents = entries
    .map((o) => (o.actual / o.total) * 100)
    .map((p) => (complement ? Math.max(100 - p, 0) : p))
  const rows = entries.map((entry, idx) => ({
    percent: percents[idx],
    ...entry,
  }))

  const wrapWithTooltip = (element: React.ReactElement, entry: Entry) => {
    return (
      <Tooltip
        placement={'top'}
        title={
          <div style={{ fontSize: 15 }}>
            {t('rides_planned')}: {numberFormatter.format(entry.total)}
            <br />
            {t('rides_actual')}: {numberFormatter.format(entry.actual)}
          </div>
        }
        followCursor={true}>
        {element}
      </Tooltip>
    )
  }

  return (
    <div className="HbarChart chart">
      {rows.map((entry) => {
        return (
          !!entry.percent && (
            <div>
              {wrapWithTooltip(
                <div className="entry" key={entry.name} style={{ width: `${entry.percent}%` }}>
                  <div className="entryData">
                    <span>{entry.name.split('|').slice(0, 2).join(' | ')}</span>
                    <span>{entry.percent.toFixed(2)}%</span>
                  </div>
                  <div className="entryBar">
                    <div
                      className="barDisplay"
                      style={{ width: `100%`, backgroundColor: entry.color }}></div>
                  </div>
                </div>,
                entry,
              )}
            </div>
          )
        )
      })}
    </div>
  )
}
