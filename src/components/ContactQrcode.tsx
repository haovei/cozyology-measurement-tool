interface ContactQrcodeProps {
  client: 'mobile' | 'web'
  type: 'drapery' | 'shade'
  webClassName?: string
  mobileClassName?: string
}

const CozyologyConfig = window.CozyologyConfig

const ContactQrcode = ({ client, type, webClassName = '', mobileClassName = '' }: ContactQrcodeProps) => {
  // 唤起Get in Touch弹窗
  const openEmailPlugin = () => {
    const target_btns = document.getElementsByClassName('bcontact-trigger-button bcontact-trigger-button-has-icon')
    if (target_btns && target_btns.length) {
      Array.from(target_btns).forEach(btn => {
        if (btn) {
          ;(btn as HTMLButtonElement).click()
        }
      })
    }
  }

  const bookNowUrl =
    type === 'drapery' ? window.CozyologyConfig_Drapery.contactBookNowUrl : window.CozyologyConfig.contactBookNowUrl

  const handleBookNow = () => {
    window.open(bookNowUrl, '_blank')
  }

  return client === 'web' ? (
    <div className={`mt-30 ${webClassName}`}>
      <div className="flex items-center gap-[20px]">
        <div className="w-[130px] h-[130px] rounded flex-shrink-0">
          <div className="qr-code-image image-qr-code" />
        </div>
        <div className="text-[14px]">
          <div className="font-bold text-black">Need quick 1-on-1 help?</div>
          <div className="mt-[10px] text-gray-500">
            <div>
              Book a{' '}
              <a
                href="https://cozyology.com/products/complimentary-1-on-1-zoom-consultation"
                className="text-[#ba6352] underline"
                target="_blank"
              >
                complimentary Zoom<br></br> consultation
              </a>
              . Or{' '}
              <a onClick={() => openEmailPlugin()} className="cursor-pointer text-[#ba6352] underline" target="_blank">
                leave us a message
              </a>
              .
            </div>
          </div>
          <button
            className="py-[8px] px-4 bg-[#232323] text-[#fff] rounded-[4px] mt-[10px] cursor-pointer"
            onClick={handleBookNow}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className={`lg:hidden mt-8 p-4 bg-[#F6F2EF] rounded-lg ${mobileClassName}`}>
      <div className="flex justify-between">
        <div className="flex-1 text-[12px] flex flex-col justify-between items-start">
          <div className="font-bold text-black">Need quick 1-on-1 help?</div>
          <div className="text-gray-500">
            Book a{' '}
            <a
              href="https://cozyology.com/products/complimentary-1-on-1-zoom-consultation"
              className="text-[#ba6352] underline"
              target="_blank"
            >
              complimentary Zoom<br></br> consultation
            </a>
            . Or{' '}
            <a onClick={() => openEmailPlugin()} className="text-[#ba6352] underline cursor-pointer" target="_blank">
              leave us a message
            </a>
            .
          </div>
          <button
            className="py-[8px] px-4 bg-[#232323] text-[#fff] rounded-[4px] cursor-pointer"
            onClick={handleBookNow}
          >
            Book Now
          </button>
        </div>
        <div className="w-[95px] h-[95px] flex-shrink-0">
          <div className="qr-code-image image-qr-code" />
        </div>
      </div>
    </div>
  )
}

export default ContactQrcode
