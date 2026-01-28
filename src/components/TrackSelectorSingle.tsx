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
  const [selectValue, setSelectValue] = useState('')
  const [options, setOptions] = useState<Array<SelectOptionPropReturns>>([])

  const selectRef = React.useRef<HTMLSelectElement | null>(null)

  const initOptions = () => {
    let opts = []
    const optMap = trackSelectorSingleOptions?.[props.headerStyle]

    // ripple-fold
    if (optMap && props.headerStyle === 'ripple-fold') {
      const mountType = props.selectedOptions['step-2-2-10'] || ''
      if (mountType === 'ripplefold-hardware-ceiling-mount') {
        opts = generateOptionKey(optMap['ceiling'] || [])
      } else if (mountType === 'ripplefold-hardware-wall-mount') {
        opts = generateOptionKey(optMap['wall'] || [])
      }
    }

    // others...

    setOptions(opts)
  }

  React.useEffect(() => {
    console.log('props.............', props.selectedOptions)
    initOptions()
  }, [])

  React.useEffect(() => {
    setSelectValue(props.value) // 设置下拉框的值
  }, [])

  const handleSelectChange = () => {
    if (selectRef.current) {
      const value = selectRef.current.value || ''
      setSelectValue(value)
      props.handleSelectChange?.(value)
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
            <option key={option.key} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
