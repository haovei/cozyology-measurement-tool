import React, { useState } from 'react'
import { isDecimal, parseMixedNumberAndSum } from '../utils'

enum TRACK_SELECTOR_TYPE {
  CT = 'Cozyology Track',
  MT = 'My Track',
}

enum TRACK_SELECT_COM_VALUE {
  WALLMOUNT = '1.625', // (1 5/8) ->  (1又5/8)
  CEILINGMOUNT = '1',
}

interface TrackSelectorProps {
  value: string
  min?: number
  max?: number
  handleInputChange?: (value: string) => void
  handleSelectChange?: (value: string) => void
}

export default function TrackSelector(props: TrackSelectorProps) {
  const [selected, setSelected] = useState<TRACK_SELECTOR_TYPE>(TRACK_SELECTOR_TYPE.CT)
  const [inputValue, setInputValue] = useState<string>('')
  const [selectValue, setSelectValue] = useState<TRACK_SELECT_COM_VALUE | null>(null)

  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const selectRef = React.useRef<HTMLSelectElement | null>(null)

  React.useEffect(() => {
    if (!props.value) return
    // 回显逻辑，如果是预设值直接回显到下拉框组件，反之回显到输入框组件
    const isPresetValue =
      props.value == TRACK_SELECT_COM_VALUE.CEILINGMOUNT || props.value == TRACK_SELECT_COM_VALUE.WALLMOUNT
    if (isPresetValue) {
      setSelectValue(props.value as TRACK_SELECT_COM_VALUE)
      setSelected(TRACK_SELECTOR_TYPE.CT)
    } else {
      setInputValue(props.value)
      setSelected(TRACK_SELECTOR_TYPE.MT)
    }
  }, [])

  // 切换tab
  const handleSwitch = (value: TRACK_SELECTOR_TYPE): void => {
    setSelected(value)
    setInputValue('')
    setSelectValue(null)
    props.handleSelectChange('') // 清空当前输入值，让用户重新输入
  }

  const handleInputChange = () => {
    if (inputRef.current && props.handleInputChange) {
      const value = inputRef.current.value || ''
      const sum = parseMixedNumberAndSum(value) // 解析混合数字或带分数格式并求和
      setInputValue(value)
      props.handleInputChange(sum.toString()) // 将结果传递给父组件
    }
  }

  const handleSelectChange = () => {
    if (selectRef.current) {
      const value = selectRef.current.value || ''
      setSelectValue(value as TRACK_SELECT_COM_VALUE)
      props.handleSelectChange(value)
    }
  }

  return (
    <div>
      <div className="border border-[#A9A9A9] p-[5px] flex">
        <div
          className={`h-10 flex-1 text-[#171717] cursor-pointer flex items-center justify-center ${
            selected === TRACK_SELECTOR_TYPE.CT ? 'bg-[#BBB3AB]' : ''
          }`}
          onClick={() => handleSwitch(TRACK_SELECTOR_TYPE.CT)}
        >
          {TRACK_SELECTOR_TYPE.CT}
        </div>
        <div
          className={`h-10 flex-1 text-[#171717] cursor-pointer flex items-center justify-center ${
            selected === TRACK_SELECTOR_TYPE.MT ? 'bg-[#BBB3AB]' : ''
          }`}
          onClick={() => handleSwitch(TRACK_SELECTOR_TYPE.MT)}
        >
          {TRACK_SELECTOR_TYPE.MT}
        </div>
      </div>
      {selected === TRACK_SELECTOR_TYPE.MT ? (
        <div className={`flex items-center gap-2 border h-[42px] bg-white mt-5`}>
          <input
            ref={inputRef}
            className="w-full h-[40px] px-4 focus:outline-none focus:border-black text-[16px] not-md:text-[14px]"
            placeholder={`${TRACK_SELECTOR_TYPE.MT}（eg.1 5/8）`}
            value={inputValue}
            min={props.min}
            max={props.max}
            onChange={handleInputChange}
            required
          />
          <div className="h-[25px] leading-[25px] px-[20px] border-l text-[12px]">Inches</div>
        </div>
      ) : (
        <>
          <div className="md:hidden mt-[15px] text-[#171717] font-bold">choose</div>
          <div className={`border h-[42px] bg-white md:mt-5`}>
            <select
              ref={selectRef}
              className={`w-full h-[40px] px-4 focus:outline-none focus:border-black text-[16px] not-md:text-[14px] ${
                props.value === '' ? 'text-gray-400' : 'text-black'
              }`}
              value={selectValue}
              onChange={handleSelectChange}
              required
            >
              <option value="" disabled>
                {TRACK_SELECTOR_TYPE.CT}
              </option>
              <option value={TRACK_SELECT_COM_VALUE.WALLMOUNT}>Emery | Ripple Fold Track - Wall Mount</option>
              <option value={TRACK_SELECT_COM_VALUE.CEILINGMOUNT}>Emery | Ripple Fold Track - Ceiling Mount</option>
            </select>
          </div>
        </>
      )}
    </div>
  )
}
