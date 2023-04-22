import React from 'react'
import { useRecoilState } from 'recoil'
import { temperatureState, maxTokenLimitState } from '@/state'
import { Slider } from "@mantine/core"


export default function ChatSettings() {

  const [temperature, setTemperature] = useRecoilState(temperatureState)
  const [maxTokenLimit, setMaxTokenLimit] = useRecoilState(maxTokenLimitState)

  const setSmoothTemperature = (value: number) => {
    setTemperature(Math.round(value * 100) / 100)
  }

  return (
    <div className="border h-max flex flex-col mr-4 border-slate-300 px-2 py-4 w-64 border-dashed rounded-md">
        <p>Temperature: {temperature}</p>
        <Slider value={temperature} onChange={setSmoothTemperature} max={1} min={0} step={0.01}/>
        <p>Max Token Limit: {maxTokenLimit}</p>
        <Slider value={maxTokenLimit} onChange={setMaxTokenLimit} min={4} max={4096}/>
    </div>
  )
}
