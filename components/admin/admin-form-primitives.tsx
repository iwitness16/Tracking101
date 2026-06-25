'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PIECE_TYPES, WEIGHT_PRESETS_KG } from '@/lib/shipment-options'
import {
  computeLineMetrics,
  enrichPackageLine,
  type PackageLineItem,
} from '@/lib/shipments'
import { Minus, Plus } from 'lucide-react'

export const adminFieldClass =
  'rounded-none h-10 w-full border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40'

export const adminTextareaClass =
  'rounded-none min-h-20 w-full border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40'

export function AdminSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border border-border bg-background p-4">
      <h3 className="mb-3 border-b border-border pb-2 font-heading text-base font-semibold text-foreground">
        {title}
      </h3>
      {children}
    </div>
  )
}

export function AdminSelect({
  label,
  value,
  onChange,
  options,
  placeholder = '-- Select One --',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: readonly string[]
  placeholder?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={adminFieldClass}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}

export function AdminInput({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: React.HTMLInputTypeAttribute
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        className={adminFieldClass}
      />
    </div>
  )
}

export function NumberStepper({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  presets,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  presets?: readonly number[]
}) {
  return (
    <div>
      {label ? (
        <label className="mb-1 block text-sm font-medium">{label}</label>
      ) : null}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          className="inline-flex size-10 items-center justify-center border border-input bg-background hover:bg-muted"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="size-4" />
        </button>
        <Input
          type="number"
          value={value}
          min={min}
          step={step}
          onChange={(e) => onChange(Number(e.target.value) || min)}
          className={`${adminFieldClass} text-center`}
        />
        <button
          type="button"
          onClick={() => onChange(value + step)}
          className="inline-flex size-10 items-center justify-center border border-input bg-background hover:bg-muted"
          aria-label={`Increase ${label}`}
        >
          <Plus className="size-4" />
        </button>
      </div>
      {presets && (
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) onChange(Number(e.target.value))
          }}
          className={`${adminFieldClass} mt-2`}
        >
          <option value="">Quick select weight</option>
          {presets.map((p) => (
            <option key={p} value={p}>
              {p} kg
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

type DraftPackage = Omit<PackageLineItem, 'volumeCubicM' | 'volumetricWeightKg'>

const EMPTY_DRAFT: DraftPackage = {
  qty: 1,
  pieceType: 'Box',
  description: '',
  lengthCm: 0,
  widthCm: 0,
  heightCm: 0,
  actualWeightKg: 1,
}

export function PackagesSection({
  items,
  onChange,
}: {
  items: PackageLineItem[]
  onChange: (items: PackageLineItem[]) => void
}) {
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const draftMetrics = computeLineMetrics(draft)

  const totals = items.reduce(
    (acc, item) => ({
      volume: acc.volume + item.volumeCubicM,
      actual: acc.actual + item.actualWeightKg * item.qty,
      volumetric: acc.volumetric + item.volumetricWeightKg,
    }),
    { volume: 0, actual: 0, volumetric: 0 },
  )

  function addPackage() {
    if (!draft.pieceType || draft.qty < 1) return
    onChange([...items, enrichPackageLine(draft)])
    setDraft(EMPTY_DRAFT)
  }

  function removePackage(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <AdminSection title="Packages">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="border border-primary/80 px-2 py-2 text-left font-semibold">
                Qty.
              </th>
              <th className="border border-primary/80 px-2 py-2 text-left font-semibold">
                Piece Type
              </th>
              <th className="border border-primary/80 px-2 py-2 text-left font-semibold">
                L (cm)
              </th>
              <th className="border border-primary/80 px-2 py-2 text-left font-semibold">
                W (cm)
              </th>
              <th className="border border-primary/80 px-2 py-2 text-left font-semibold">
                H (cm)
              </th>
              <th className="border border-primary/80 px-2 py-2 text-left font-semibold">
                Weight (kg)
              </th>
              <th className="border border-primary/80 px-2 py-2 text-left font-semibold">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border p-1">
                <Input
                  type="number"
                  min={1}
                  value={draft.qty}
                  onChange={(e) =>
                    setDraft({ ...draft, qty: Number(e.target.value) || 1 })
                  }
                  className={adminFieldClass}
                />
              </td>
              <td className="border border-border p-1">
                <select
                  value={draft.pieceType}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      pieceType: e.target.value as DraftPackage['pieceType'],
                    })
                  }
                  className={adminFieldClass}
                >
                  {PIECE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-border p-1">
                <Input
                  type="number"
                  min={0}
                  value={draft.lengthCm || ''}
                  onChange={(e) =>
                    setDraft({ ...draft, lengthCm: Number(e.target.value) || 0 })
                  }
                  className={adminFieldClass}
                />
              </td>
              <td className="border border-border p-1">
                <Input
                  type="number"
                  min={0}
                  value={draft.widthCm || ''}
                  onChange={(e) =>
                    setDraft({ ...draft, widthCm: Number(e.target.value) || 0 })
                  }
                  className={adminFieldClass}
                />
              </td>
              <td className="border border-border p-1">
                <Input
                  type="number"
                  min={0}
                  value={draft.heightCm || ''}
                  onChange={(e) =>
                    setDraft({ ...draft, heightCm: Number(e.target.value) || 0 })
                  }
                  className={adminFieldClass}
                />
              </td>
              <td className="border border-border p-1 align-top">
                <NumberStepper
                  label=""
                  value={draft.actualWeightKg}
                  onChange={(v) => setDraft({ ...draft, actualWeightKg: v })}
                  step={0.5}
                  presets={WEIGHT_PRESETS_KG}
                />
              </td>
              <td className="border border-border p-1">
                <Textarea
                  value={draft.description}
                  onChange={(e) =>
                    setDraft({ ...draft, description: e.target.value })
                  }
                  className={adminTextareaClass}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Draft volume: {draftMetrics.volumeCubicM.toFixed(4)} cu. m. · Volumetric
        weight: {draftMetrics.volumetricWeightKg.toFixed(2)} kg
      </p>

      <Button
        type="button"
        onClick={addPackage}
        className="mt-3 rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Add Package
      </Button>

      {items.length > 0 && (
        <div className="mt-4 space-y-2 border border-border p-3">
          {items.map((item, index) => (
            <div
              key={`${item.pieceType}-${index}`}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 text-sm last:border-b-0"
            >
              <span>
                {item.qty} × {item.pieceType} — {item.lengthCm}×{item.widthCm}×
                {item.heightCm} cm — {item.actualWeightKg} kg
                {item.description ? ` — ${item.description}` : ''}
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-none"
                onClick={() => removePackage(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 space-y-1 border-t border-border pt-4 text-center text-sm font-semibold">
        <p>Total Volumetric Weight : {totals.volumetric.toFixed(2)} kg.</p>
        <p>Total Volume : {totals.volume.toFixed(2)} cu. m.</p>
        <p>Total Actual Weight : {totals.actual.toFixed(2)} kg.</p>
      </div>
    </AdminSection>
  )
}
