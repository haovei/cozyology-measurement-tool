import { SelectOptionPropReturns } from '@/types/global'
import { generateOptionKey } from '../utils'
import React, { useState } from 'react'

interface TrackSelectorProps {
  value: string
  selectedKey?: string // 父组件存储的选中项唯一 key，用于精确回显（value 可能重复）
  headerStyle: string
  min?: number
  max?: number
  selectedOptions?: any
  handleSelectChange?: (value: string, key?: string) => void
}

const trackSelectorSingleOptions = window.CozyologyConfig_Drapery?.trackSelectorSingleOptions || {}

export default function TrackSelectorSingle(props: TrackSelectorProps) {
  // selectValue 存储选中项的唯一 key（而非 value），以支持同组内 value 重复
  const [selectValue, setSelectValue] = useState('')

  const selectRef = React.useRef<HTMLSelectElement | null>(null)

  // 同步计算下拉选项，挂载时（含回显）即可同步读取；每项带唯一 key
  const options = React.useMemo<Array<SelectOptionPropReturns>>(() => {
    const optMap = trackSelectorSingleOptions?.[props.headerStyle]

    // ripple-fold
    if (optMap && props.headerStyle === 'ripple-fold') {
      const mountType = props.selectedOptions?.['step-2-2-10'] || ''
      if (mountType === 'ripplefold-hardware-ceiling-mount') {
        return generateOptionKey(optMap['ceiling'] || [])
      }
      if (mountType === 'ripplefold-hardware-wall-mount') {
        return generateOptionKey(optMap['wall'] || [])
      }
    }

    // others...

    return []
  }, [props.headerStyle, props.selectedOptions])

  React.useEffect(() => {
    // 优先用父组件存储的 key 精确回显；缺失时退回按 value 匹配首个
    if (props.selectedKey) {
      setSelectValue(props.selectedKey)
      return
    }
    const matched = options.find(o => String(o.value) === String(props.value))
    setSelectValue(matched ? String(matched.key) : '')
  }, [])

  const handleSelectChange = () => {
    if (selectRef.current) {
      const key = selectRef.current.value || '' // 下拉项现以唯一 key 作为 DOM value
      const matched = options.find(o => String(o.key) === key)
      setSelectValue(key)
      props.handleSelectChange?.(matched?.value || '', key) // 回传真实测量值 + 唯一 key
    }
  }

  return (
    <>
      <div className="text-[#171717] text-4">Cozyology Hardware:</div>
      <div className={`border h-[42px] bg-white mt-[10px]`}>
        <select
          name="12"
          ref={selectRef}
          className={`w-full h-[40px] px-4 focus:outline-none focus:border-black text-[16px] ${
            props.value === '' ? 'text-gray-400' : 'text-black'
          }`}
          value={selectValue}
          onChange={handleSelectChange}
          required
        >
          <option key="default" value="" disabled>
            --
          </option>
          {options.map(option => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
