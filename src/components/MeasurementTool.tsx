'use client'

import { useState } from 'react'

export default function MeasurementTool() {
  const steps = [
    { id: 1, title: 'Choose Mount Style', active: true },
    { id: 2, title: 'Specify Window Width', active: false },
    { id: 3, title: 'Specify Window Height', active: false },
    { id: 4, title: 'Panels & Fullness', active: false },
  ]

  return (
    <div className="">
      <div className="flex flex-col md:py-6 md:gap-20 md:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-[30%] bg-white">
          <div className="flex flex-col h-full">
            <div className="flex-1 ">
              {steps.map((step, index) => (
                <div key={step.id} className="flex">
                  <div className="flex flex-col items-center mr-4 w-[30px]">
                    <div
                      className={`w-4 h-4 rounded-full border-solid transition-colors ${
                        step.active
                          ? 'w-7.5 h-7.5 bg-black border-[#BBB3AB] border-8'
                          : 'bg-white border-2 border-black'
                      }`}
                    />
                    {index < steps.length - 1 && <div className="w-0.5 h-15 bg-black" />}
                  </div>
                  <div
                    className={`flex-1 transition-colors ${step.active ? 'text-black font-medium text-[22px] leading-[30px]' : 'text-[#ccc] text-[18px] leading-none'}`}
                  >
                    Step {step.id} - {step.title}
                  </div>
                </div>
              ))}
            </div>

            {/* QR Code Section */}
            <div>
              <div className="flex items-center gap-[20px]">
                <div className="w-[130px] h-[130px] bg-black rounded flex-shrink-0">
                  <img src="/assets/code@2x.webp" />
                </div>
                <div className="text-[14px]">
                  <div className="font-medium text-black">Need help with measurements?</div>
                  <div className="font-medium text-black">Scan the QR code or add us on</div>
                  <div className="text-gray-500 mt-[20px]">WhatsApp: (917) 701-2145</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Step Indicator */}
        <div className="md:hidden bg-[#F3F3F3] px-8 py-5 overflow-auto">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative">
                <div
                  className={`w-2.5 h-2.5 rounded-full border-solid transition-colors border-[#DDDDDD] relative z-1 ${
                    step.active ? 'w-4 h-4 bg-black border-4' : 'bg-white border-1 my-1'
                  }`}
                />
                <div
                  className={`text-xs mt-1 transition-colors ${step.active ? 'text-black font-medium mt-1' : 'text-gray-400'}`}
                >
                  Step {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-2 left-1/2 w-[calc(100vw/4)] h-0.5 bg-[#DDDDDD] z-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="md:mx-auto md:py-0 mx-4 py-5">
            <h1 className="text-[30px] font-americana text-center mb-11 text-gray-900 not-md:text-[18px] not-md:mb-6">
              What kind of mount style would you like?
            </h1>

            <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
              <div className="group w-[400px] h-[600px] transition-all duration-200 hover:bg-[#F5F5F5] flex flex-col relative cursor-pointer not-md:bg-[#F5F5F5] not-md:w-full not-md:h-auto">
                <div className="p-[40px] pb-[50px] flex-1 flex flex-col gap-5 not-md:gap-[14px] not-md:flex-row not-md:p-4">
                  <div className="w-[320px] h-[320px] mx-auto relative not-md:w-[160px] not-md:h-[160px]">
                    <img src="/assets/02-1@2x.webp" alt="Inside Mount" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 md:text-center">
                    <h3 className="text-[24px] text-[#171717] not-md:text-[15px]">INSIDE MOUNT</h3>
                    <div className="h-[1px] bg-[#DDDDDD] my-5 not-md:my-[10px]"></div>
                    <div className="text-[16px] text-[#171717] not-md:text-[12px]">
                      Window depth requirement for Inside Mount: At least 2 3/4 inches for Bamboo shades 2 inches for
                      Roman shades
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 hidden group-hover:block">
                  <button className="w-full px-12 py-3 text-lg font-medium transition-all duration-200 bg-black text-white cursor-pointer">
                    CONTINUE
                  </button>
                </div>
              </div>

              <div className="group w-[400px] h-[600px] transition-all duration-200 hover:bg-[#F5F5F5] flex flex-col relative cursor-pointer not-md:bg-[#F5F5F5] not-md:w-full not-md:h-auto">
                <div className="p-[40px] pb-[50px] flex-1 flex flex-col gap-5 not-md:gap-[14px] not-md:flex-row not-md:p-4">
                  <div className="w-[320px] h-[320px] mx-auto relative not-md:w-[160px] not-md:h-[160px]">
                    <img src="/assets/02-2@2x.webp" alt="OUTSIDE Mount" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 md:text-center">
                    <h3 className="text-[24px] text-[#171717] not-md:text-[15px]">OUTSIDE MOUNT</h3>
                    <div className="h-[1px] bg-[#DDDDDD] my-5 not-md:my-[10px]"></div>
                    <div className="text-[16px] text-[#171717] not-md:text-[12px]">
                      We recommend adding a minimum of 2 inches to width and 10-12 inches to height to allow light gap
                      coverage.
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 hidden group-hover:block">
                  <button className="w-full px-12 py-3 text-lg font-medium transition-all duration-200 bg-black text-white cursor-pointer">
                    CONTINUE
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile QR Code Section */}
            <div className="md:hidden mt-8 p-4 bg-[#F6F2EF] rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1 text-[12px]">
                  <div className="font-medium text-black">Need help with measurements?</div>
                  <div className="font-medium text-black">Scan the QR code or add us on</div>
                  <div className="text-gray-500 mt-[10px]">WhatsApp: (917) 701-2145</div>
                </div>
                <div className="w-[65px] h-[65px] bg-black flex-shrink-0">
                  <img src="/assets/code@2x.webp" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
