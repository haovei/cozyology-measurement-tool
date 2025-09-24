import React, { useState } from 'react'

enum TRACK_SELECTOR_TYPE {
  CT = 'Cozyology Track',
  MT = 'My Track',
}

interface TrackSelectorProps {
  value: string
  headerStyle: string
  min?: number
  max?: number
  handleInputChange?: (value: string) => void
  handleSelectChange?: (value: string) => void
}

const trackSelectorOptions = window.CozyologyConfig_Drapery?.trackSelectorOptions || {}

export default function TrackSelector(props: TrackSelectorProps) {
  const [selected, setSelected] = useState<TRACK_SELECTOR_TYPE>()
  const [inputValue, setInputValue] = useState<string>('')
  const [selectValue, setSelectValue] = useState<string>('')

  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const selectRef = React.useRef<HTMLSelectElement | null>(null)

  const options = (trackSelectorOptions?.[props.headerStyle] || []).map((option, index) => ({ ...option, key: index }))

  React.useEffect(() => {
    setSelected(TRACK_SELECTOR_TYPE.CT)
    if (!props.value) {
      // initSelectValue()
      return
    }
    // 回显逻辑，如果是options某个选项的预设值直接回显到下拉框组件，反之回显到输入框组件
    const isPresetValue = options.some(option => option.value === props.value)
    if (isPresetValue) {
      setSelectValue(props.value)
    } else {
      setInputValue(props.value)
      setSelected(TRACK_SELECTOR_TYPE.MT)
    }
  }, [])

  // 切换tab
  const handleSwitch = (value: TRACK_SELECTOR_TYPE): void => {
    if (value === selected) return
    setSelected(value)
    setSelectValue('')
    setInputValue('')
    props.handleSelectChange('') // 清空当前输入值，让用户重新输入
  }

  // 初始化下框的值
  const initSelectValue = () => {
    // 默认选中第一个选项值，并将值传回父组件保存
    const value = options[0]?.value || ''
    setSelectValue(value)
    props.handleSelectChange?.(value)
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
      setSelectValue(value)
      props.handleSelectChange?.(value)
    }
  }

  const viewTheTrack = (): void => {
    const link = options.find(item => item.value === selectValue)?.link
    if (!link) return
    window.open(link)
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
        <>
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
          <div className="mt-4">
            <span className="opacity-0" onClick={viewTheTrack}>
              View the Track
            </span>
          </div>
        </>
      ) : (
        <>
          <div className={`border h-[42px] bg-white mt-5`}>
            <select
              name="12"
              ref={selectRef}
              className={`w-full h-[40px] px-4 focus:outline-none focus:border-black text-[16px] not-md:text-[14px] ${
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
          <div className="mt-4">
            <span
              className={`text-[#ba6352] underline cursor-pointer text-sm ${selectValue ? 'opacity-100' : 'opacity-0'}`}
              onClick={viewTheTrack}
            >
              View the Track
            </span>
          </div>
        </>
      )}
    </div>
  )
}
