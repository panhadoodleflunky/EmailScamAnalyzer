import { useMemo, useState, type ReactNode } from 'react'
import {
  I18nContext,
  resources,
  type I18nContextValue,
  type Locale,
  type Params,
} from './i18nContext'

function interpolate(template: string, params?: Params) {
  if (!params) {
    return template
  }

  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = params[key]
    return value === undefined ? `{${key}}` : String(value)
  })
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')

  const value = useMemo<I18nContextValue>(() => {
    const dictionary = resources[locale]

    return {
      locale,
      availableLocales: Object.keys(resources) as Locale[],
      setLocale,
      t: (key, params) => interpolate(dictionary[key as keyof typeof dictionary] ?? key, params),
    }
  }, [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
