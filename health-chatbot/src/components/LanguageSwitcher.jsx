import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const changeLang = (e) => {
    i18n.changeLanguage(e.target.value)
  }

  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 14 }}>{t('language.label')}:</span>
      <select onChange={changeLang} value={i18n.language} aria-label={t('language.label')}>
        <option value="en">{t('language.en')}</option>
        <option value="hi">{t('language.hi')}</option>
        <option value="bn">{t('language.bn')}</option>
      </select>
    </label>
  )
}

export default LanguageSwitcher

