import { createContext, useContext } from 'react'
import en from './en'

export const resources = {
  en,
}

export type Locale = keyof typeof resources

export type Params = Record<string, string | number>

export type I18nContextValue = {
  locale: Locale
  availableLocales: Locale[]
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Params) => string
}

export const I18nContext = createContext<I18nContextValue | null>(null)

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
