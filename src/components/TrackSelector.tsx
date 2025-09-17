import React, { useState } from 'react'
import { mixedNumberRegex, parseMixedNumberAndSum } from '../utils'

enum TRACK_SELECTOR_TYPE {
  CT = 'Cozyology Track',
  MT = 'My Track',
}

enum TRACK_SELECT_COM_VALUE {
  WALLMOUNT = '1 5/8', // (1 5/8) ->  (1又5/8)
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
  const [selected, setSelected] = useState<TRACK_SELECTOR_TYPE>()
  const [inputValue, setInputValue] = useState<string>('')
  const [selectValue, setSelectValue] = useState<TRACK_SELECT_COM_VALUE>()

  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const selectRef = React.useRef<HTMLSelectElement | null>(null)

  React.useEffect(() => {
    setSelected(TRACK_SELECTOR_TYPE.CT)
    if (!props.value) {
      initSelectValue()
      return
    }
    // 回显逻辑，如果是预设值直接回显到下拉框组件，反之回显到输入框组件
    const isPresetValue =
      props.value == TRACK_SELECT_COM_VALUE.CEILINGMOUNT || props.value == TRACK_SELECT_COM_VALUE.WALLMOUNT
    if (isPresetValue) {
      setSelectValue(props.value as TRACK_SELECT_COM_VALUE)
    } else {
      setInputValue(props.value)
      setSelected(TRACK_SELECTOR_TYPE.MT)
    }
  }, [])

  // 切换tab
  const handleSwitch = (value: TRACK_SELECTOR_TYPE): void => {
    setSelected(value)
    // 如果切换回CT，初始化下拉框的值
    if (value === TRACK_SELECTOR_TYPE.CT) {
      return initSelectValue()
    }
    setInputValue('')
    props.handleSelectChange('') // 清空当前输入值，让用户重新输入
  }

  // 初始化下框的值
  const initSelectValue = () => {
    // 默认选中第一个选项值，并将值传回父组件保存
    setSelectValue(TRACK_SELECT_COM_VALUE.WALLMOUNT)
    props.handleSelectChange?.(TRACK_SELECT_COM_VALUE.WALLMOUNT)
  }

  const handleInputChange = () => {
    if (inputRef.current) {
      const value = inputRef.current.value || ''
      setInputValue(value)
      props.handleInputChange?.(value)
    }
  }

  const handleSelectChange = () => {
    if (selectRef.current) {
      const value = selectRef.current.value || ''
      setSelectValue(value as TRACK_SELECT_COM_VALUE)
      props.handleSelectChange?.(value)
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
            placeholder={`eg.1 5/8`}
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
              <option value={TRACK_SELECT_COM_VALUE.WALLMOUNT}>Emery | Ripple Fold Track - Wall Mount</option>
              <option value={TRACK_SELECT_COM_VALUE.CEILINGMOUNT}>Emery | Ripple Fold Track - Ceiling Mount</option>
            </select>
          </div>
        </>
      )}
    </div>
  )
}
