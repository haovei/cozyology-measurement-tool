interface SelectedInfosListItem {
  key: string
  value: string
}

interface SelectedInfosProps {
  list: SelectedInfosListItem[]
  getPanelTypeDescription: () => string
  getLengthStyleDescription: () => string
}

const CozyologyConfig = window.CozyologyConfig_Drapery

const SelectedInfos = ({ list, getPanelTypeDescription, getLengthStyleDescription }: SelectedInfosProps) => {
  const handleShopNow = () => {
    window.open(CozyologyConfig.shopNowUrl, '_blank')
  }
  return (
    <div className="selected-data bg-[#F5F5F5] md:ml-[8px] md:w-[360px] not-md:mt-[20px] not-md:text-[12px] ">
      <p className="text-[15px] p-[16px] font-bold">You've selected</p>
      {/* 分割线 */}
      <div className="w-full h-[1px] bg-[#DDD]"></div>

      <div className="p-[16px] text-sm">
        <>
          {list.map(item => (
            <div className="flex mb-[10px] justify-between items-center" key={item.key}>
              <div className="flex-1 text-[#999999]">{item.key}: </div>
              <div className="flex-1">{item.value}</div>
            </div>
          ))}
        </>

        <div className="flex mb-[10px] justify-between items-center">
          <div className="flex-1 text-[#999999]">Length Style: </div>
          <div className="flex-1">{getLengthStyleDescription()}</div>
        </div>
        <div className="flex mb-[10px] justify-between items-center">
          <div className="flex-1 text-[#999999]">Panel: </div>
          <div className="flex-1">{getPanelTypeDescription()}</div>
        </div>
        <div onClick={handleShopNow} className="text-[#ba6352] underline not-md:hidden mt-[80px] cursor-pointer w-fit">
          Continue shopping
        </div>
      </div>
    </div>
  )
}

export default SelectedInfos
