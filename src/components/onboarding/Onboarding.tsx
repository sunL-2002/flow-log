import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { settingsStore } from '../../stores/settingsStore'
import { uiStore } from '../../stores/uiStore'
import Welcome from './Welcome'
import PermissionRequest from './PermissionRequest'
import BasicSetup from './BasicSetup'
import SetupComplete from './SetupComplete'

interface OnboardingProps {
  onComplete: () => void
}

const steps = ['welcome', 'permission', 'setup', 'complete'] as const
type Step = typeof steps[number]

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const [selectedJobType, setSelectedJobType] = useState('developer')
  const { updateSettings } = settingsStore()
  const { showToast } = uiStore()
  
  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }
  
  const handleComplete = async () => {
    try {
      await invoke('set_first_launch_complete')
      await updateSettings({ first_launch: false })
      onComplete()
    } catch {
      showToast('error', '设置保存失败')
    }
  }
  
  const currentIndex = steps.indexOf(currentStep)
  
  return (
    <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center">
      <div className="w-full max-w-lg px-lg">
        <div className="flex justify-center gap-sm mb-xl">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentIndex ? 'bg-primary-500' : 'bg-border'
              }`}
            />
          ))}
        </div>
        
        {currentStep === 'welcome' && (
          <Welcome onNext={handleNext} />
        )}
        
        {currentStep === 'permission' && (
          <PermissionRequest onNext={handleNext} />
        )}
        
        {currentStep === 'setup' && (
          <BasicSetup 
            selectedJobType={selectedJobType}
            onJobTypeChange={setSelectedJobType}
            onNext={handleNext}
          />
        )}
        
        {currentStep === 'complete' && (
          <SetupComplete onComplete={handleComplete} />
        )}
      </div>
    </div>
  )
}
