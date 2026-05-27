import { SelectOptionPropReturns } from '@/types/global'
import { generateOptionKey } from '../utils'
import React, { useState } from 'react'

interface TrackSelectorProps {
  value: string
  headerStyle: string
  min?: number
  max?: number
  selectedOptions?: any
  handleSelectChange?: (value: string) => void
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
    // value 可能重复，回显时映射到首个匹配项的唯一 key
    const matched = options.find(o => String(o.value) === String(props.value))
    setSelectValue(matched ? String(matched.key) : '')
  }, [])

  const handleSelectChange = () => {
    if (selectRef.current) {
      const key = selectRef.current.value || '' // 下拉项现以唯一 key 作为 DOM value
      const matched = options.find(o => String(o.key) === key)
      setSelectValue(key)
      props.handleSelectChange?.(matched?.value || '') // 仍向父组件回传真实测量值
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
