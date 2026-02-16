import { useI18n } from "../hooks/useI18n";

const LanguageSelector = () => {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="language-select-group">
      <label htmlFor="language-select">{t("common.language")}:</label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        aria-label={t("common.language")}
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
