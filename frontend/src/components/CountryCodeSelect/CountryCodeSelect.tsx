import React, { useState, useRef, useEffect, useCallback } from 'react';
import { COUNTRIES, getCountryFlag } from '../../constants/countries';
import type { Country } from '../../constants/countries';
import { STRINGS } from '../../constants/strings';
import styles from './CountryCodeSelect.module.css';

interface CountryCodeSelectProps {
  label: string;
  value: string;
  onChange: (dialCode: string) => void;
  error?: string;
}

export const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedItemRef = useRef<HTMLLIElement>(null);

  const selectedCountry = COUNTRIES.find((c) => c.isoCode === value) ?? null;

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search),
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setSearch('');
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
      selectedItemRef.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen]);

  const handleSelect = (country: Country) => {
    onChange(country.isoCode);
    close();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };

  const triggerClasses = [
    styles.trigger,
    error ? styles.triggerError : '',
    isOpen ? styles.triggerOpen : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.wrapper} ref={containerRef} onKeyDown={handleKeyDown}>
      <label className={styles.label}>{label}</label>

      <button
        type="button"
        className={triggerClasses}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedCountry ? (
          <>
            <span className={styles.flag}>{getCountryFlag(selectedCountry.isoCode)}</span>
            <span className={styles.dialCode}>{selectedCountry.dialCode}</span>
          </>
        ) : (
          <span className={styles.placeholder}>{STRINGS.FORM_COUNTRY_SELECT_PLACEHOLDER}</span>
        )}
        <span className={[styles.chevron, isOpen ? styles.chevronOpen : ''].filter(Boolean).join(' ')}>
          ▾
        </span>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          <div className={styles.searchWrapper}>
            <input
              ref={searchRef}
              type="text"
              className={styles.search}
              placeholder={STRINGS.FORM_COUNTRY_SEARCH_PLACEHOLDER}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (filtered.length > 0) handleSelect(filtered[0]);
                }
              }}
            />
          </div>

          <ul className={styles.list}>
            {filtered.map((country) => (
              <li
                key={country.isoCode}
                ref={country.isoCode === value ? selectedItemRef : undefined}
                role="option"
                aria-selected={country.isoCode === value}
                className={[
                  styles.option,
                  country.isoCode === value ? styles.optionSelected : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleSelect(country)}
              >
                <span className={styles.optionFlag}>{getCountryFlag(country.isoCode)}</span>
                <span className={styles.optionName}>{country.name}</span>
                <span className={styles.optionCode}>{country.dialCode}</span>
              </li>
            ))}

            {filtered.length === 0 && (
              <li className={styles.noResults}>{STRINGS.FORM_COUNTRY_NO_RESULTS}</li>
            )}
          </ul>
        </div>
      )}

      {error && (
        <span className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
