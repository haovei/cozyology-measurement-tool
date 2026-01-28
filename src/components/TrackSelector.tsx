import { SelectOptionPropReturns } from '@/types/global'
import { generateOptionKey } from '../utils'
import React, { useState } from 'react'

export enum TRACK_SELECTOR_TYPE {
  CT = 'Cozyology Hardware',
  MT = 'My Hardware',
}

interface TrackSelectorProps {
  value: string
  headerStyle: string
  initialTabKey?: TRACK_SELECTOR_TYPE
  min?: number
  max?: number
  selectedOptions?: any
  handleInputChange?: (value: string) => void
  handleSelectChange?: (value: string) => void
  handleTabSwitch?: (value: TRACK_SELECTOR_TYPE) => void
}

const trackSelectorOptions = window.CozyologyConfig_Drapery?.trackSelectorOptions || {}

export default function TrackSelector(props: TrackSelectorProps) {
  const [selected, setSelected] = useState<TRACK_SELECTOR_TYPE>()
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [showTip, setShowTip] = useState(false)
  const [options, setOptions] = useState<Array<SelectOptionPropReturns>>([])

  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const selectRef = React.useRef<HTMLSelectElement | null>(null)

  console.log('--------trackSelector--------', props.selectedOptions)

  // const options = (trackSelectorOptions?.[props.headerStyle] || []).map((option, index) => ({ ...option, key: index }))

  const showMyTip = React.useMemo(() => {
    return selected === TRACK_SELECTOR_TYPE.MT
  }, [selected])

  const initOptions = () => {
    let opts = []
    const optMap = trackSelectorOptions?.[props.headerStyle]

    // pleated
    if (props.headerStyle === 'pleated' && optMap) {
      const mountType = props.selectedOptions['step-2-2-7'] || ''
      if (mountType === 'hardware-ceiling-mount') {
        opts = generateOptionKey(optMap['ceiling'] || [])
      } else if (mountType === 'hardware-wall-mount') {
        opts = generateOptionKey(optMap['wall'] || [])
      }
    }

    // others...

    setOptions(opts)
  }

  React.useEffect(() => {
    initOptions()
  }, [])

  React.useEffect(() => {
    const initTabKey = props.initialTabKey ?? TRACK_SELECTOR_TYPE.CT
    setSelected(initTabKey)
    props.handleTabSwitch?.(initTabKey) // 切换到对应的tab
    if (!props.value) return // 没有值不回显
    if (initTabKey === TRACK_SELECTOR_TYPE.CT) {
      setSelectValue(props.value) // 设置下拉框的值
    } else {
      setInputValue(props.value) // 设置输入框的值
    }

    // setSelected(TRACK_SELECTOR_TYPE.CT)
    // props.handleTabSwitch?.(TRACK_SELECTOR_TYPE.CT)
    // if (!props.value) return
    // // 回显逻辑，如果是options某个选项的预设值直接回显到下拉框组件，反之回显到输入框组件
    // const isPresetValue = options.some(option => option.value === props.value)
    // if (isPresetValue) {
    //   setSelectValue(props.value)
    // } else {
    //   setInputValue(props.value)
    //   setSelected(TRACK_SELECTOR_TYPE.MT)
    // }
  }, [])

  // 切换tab
  const handleSwitch = (value: TRACK_SELECTOR_TYPE): void => {
    if (value === selected) return
    setSelected(value)
    setSelectValue('')
    setInputValue('')
    setShowTip(false)
    props.handleSelectChange('') // 清空当前输入值，让用户重新输入
    props.handleTabSwitch(value)
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
      const label = selectRef.current.options[selectRef.current.selectedIndex]?.text || ''
      setShowTip(label.includes('Wall Mount'))
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
              className="w-full h-[40px] px-4 focus:outline-none focus:border-black text-[16px]"
              placeholder={`eg.1 5/8`}
              value={inputValue}
              min={props.min}
              max={props.max}
              onChange={handleInputChange}
              required
            />
            <div className="h-[25px] leading-[25px] px-[20px] border-l text-[12px]">Inches</div>
          </div>
          {showMyTip && (
            <div className="mt-4">
              <span className={`text-sm`}>If using your own hardware, it's best to measure after install.</span>
            </div>
          )}
          {/* 下面的View the Track Dom主要解决之前两个tab切换带来的元素重排缺陷 */}
          {/* <div className="mt-4">
            <span className="opacity-0" onClick={viewTheTrack}>
              View the Track
            </span>
          </div> */}
        </>
      ) : (
        <>
          <div className={`border h-[42px] bg-white mt-5`}>
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
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {/* {showTip && (
            <div className="mt-4">
              <span className={`text-sm`}>
                For wall mount, this tool assumes the track is installed right below the ceiling. If you prefer a
                wall-mounted setup that sits lower, please contact us at{' '}
                <a href="mailto:consult@cozyology.com" target="_blank" className="text-[#ba6352] underline">
                  consult@cozyology.com
                </a>{' '}
                for guidance.
              </span>
            </div>
          )} */}
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
