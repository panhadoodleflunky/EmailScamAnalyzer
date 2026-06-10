import type { FormEvent } from 'react'
import { useI18n } from '../../localization/i18nContext'

type AnalysisFormProps = {
  text: string
  canAnalyse: boolean
  isLoading: boolean
  onTextChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onUseSample: () => void
  onClearText: () => void
}

export function AnalysisForm({
  text,
  canAnalyse,
  isLoading,
  onTextChange,
  onSubmit,
  onUseSample,
  onClearText,
}: AnalysisFormProps) {
  const { t } = useI18n()
  const hasText = text.trim().length > 0

  return (
    <form onSubmit={onSubmit}>
      <div className="field-head">
        <label htmlFor="email-text">{t('form.emailTextLabel')}</label>
        <button
          type="button"
          className="link-btn"
          onClick={onUseSample}
          disabled={isLoading}
        >
          {t('form.sample')}
        </button>
      </div>

      <textarea
        id="email-text"
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder={t('form.placeholder')}
        rows={10}
        spellCheck={false}
      />

      <p className="field-helper">{t('form.helper')}</p>

      <div className="form-actions">
        <button className="primary-btn" type="submit" disabled={!canAnalyse}>
          {isLoading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              {t('form.analysing')}
            </>
          ) : (
            <>
              <SearchIcon />
              {t('form.analyse')}
            </>
          )}
        </button>

        {hasText && !isLoading ? (
          <button type="button" className="ghost-btn" onClick={onClearText}>
            {t('form.clear')}
          </button>
        ) : null}

        <span className="char-count" aria-hidden="true">
          {t('form.charCount', { count: text.length })}
        </span>
      </div>
    </form>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.9" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}
