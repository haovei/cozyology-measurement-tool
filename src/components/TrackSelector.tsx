import React, { useState } from 'react'

enum TRACK_SELECTOR_VALUE {
  CT = 'Cozyology Track',
  MT = 'My Track',
}

interface TrackSelectorProps {
  value: string
  min?: number
  max?: number
  handleInputChange?: (value: string) => void
  handleSelectChange?: (value: string) => void
}

export default function TrackSelector(props: TrackSelectorProps) {
  const [selected, setSelected] = useState<string>(TRACK_SELECTOR_VALUE.CT)

  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const selectRef = React.useRef<HTMLSelectElement | null>(null)

  /* 切换tab */
  const handleSwitch = (value: TRACK_SELECTOR_VALUE): void => {
    console.log('TRACK_SELECTOR_VALUE=====', value)
    setSelected(value)
    props.handleSelectChange('') // 清空当前输入值，让用户重新输入
  }

  const handleInputChange = () => {
    if (inputRef.current && props.handleInputChange) {
      console.log('handleInputChange======', inputRef.current.value)
      const value = inputRef.current.value || ''
      props.handleInputChange(value)
    }
  }

  const handleSelectChange = () => {
    if (selectRef.current) {
      console.log('vallval', selectRef.current.value)
      const value = selectRef.current.value || ''
      props.handleSelectChange(value)
    }
  }

  return (
    <div>
      <div className="border border-[#A9A9A9] p-[5px] flex">
        <div
          className={`h-10 flex-1 text-[#171717] cursor-pointer flex items-center justify-center ${
            selected === TRACK_SELECTOR_VALUE.CT ? 'bg-[#BBB3AB]' : ''
          }`}
          onClick={() => handleSwitch(TRACK_SELECTOR_VALUE.CT)}
        >
          {TRACK_SELECTOR_VALUE.CT}
        </div>
        <div
          className={`h-10 flex-1 text-[#171717] cursor-pointer flex items-center justify-center ${
            selected === TRACK_SELECTOR_VALUE.MT ? 'bg-[#BBB3AB]' : ''
          }`}
          onClick={() => handleSwitch(TRACK_SELECTOR_VALUE.MT)}
        >
          {TRACK_SELECTOR_VALUE.MT}
        </div>
      </div>
      {selected === TRACK_SELECTOR_VALUE.MT ? (
        <div className={`flex items-center gap-2 border h-[42px] bg-white mt-5`}>
          <input
            ref={inputRef}
            className="w-full h-[40px] px-4 focus:outline-none focus:border-black text-[16px] not-md:text-[14px]"
            placeholder={`${TRACK_SELECTOR_VALUE.MT}（eg.1 5/8）`}
            value={props.value}
            min={props.min}
            max={props.max}
            onChange={handleInputChange}
            required
          />
          <div className="h-[25px] leading-[25px] px-[20px] border-l text-[12px]">Inches</div>
        </div>
      ) : (
        <>
          <div className='md:hidden mt-[15px] text-[#171717] font-bold'>choose</div>
          <div className={`border h-[42px] bg-white md:mt-5`}>
            <select
              ref={selectRef}
              className={`w-full h-[40px] px-4 focus:outline-none focus:border-black text-[16px] not-md:text-[14px] ${
                props.value === '' ? 'text-gray-400' : 'text-black'
              }`}
              value={props.value}
              onChange={handleSelectChange}
              required
            >
              <option value="" disabled>
                {TRACK_SELECTOR_VALUE.CT}
              </option>
              {/* TODO: 需要支持解析 1 5/8 类型的数据 */}
              <option value="1">Emery | Ripple Fold Track - Wall Mount</option>
              <option value="2">Emery | Ripple Fold Track - Ceiling Mount</option>
            </select>
          </div>
        </>
      )}
    </div>
  )
}
