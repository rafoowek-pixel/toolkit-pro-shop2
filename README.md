# 🛠️ TOOLKIT PRO - Sklep

Gotowy landing page do sprzedaży zestawu narzędzi.

---

## 📋 INSTRUKCJA KROK PO KROKU

### KROK 1: Załóż konto na GitHub (jeśli nie masz)

1. Wejdź na **github.com**
2. Kliknij **Sign up**
3. Podaj email, hasło, nazwę użytkownika
4. Potwierdź email

---

### KROK 2: Stwórz nowe repozytorium

1. Po zalogowaniu kliknij zielony przycisk **"New"** (lub **+** w prawym górnym rogu → New repository)
2. Nazwa: `toolkit-pro-shop`
3. Ustaw jako **Public**
4. **NIE** zaznaczaj "Add README"
5. Kliknij **Create repository**

---

### KROK 3: Wgraj pliki

**Opcja A - przez stronę GitHub (najprostsza):**

1. Na stronie nowego repo kliknij **"uploading an existing file"**
2. Przeciągnij WSZYSTKIE pliki z tego folderu (package.json, index.html, vite.config.js, folder src)
3. Kliknij **Commit changes**

**Opcja B - przez Git (jeśli masz zainstalowany):**

```bash
cd toolkit-pro-shop
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TWOJ_USERNAME/toolkit-pro-shop.git
git push -u origin main
```

---

### KROK 4: Skonfiguruj Formspree (odbieranie zamówień)

1. Wejdź na **formspree.io**
2. Załóż darmowe konto
3. Kliknij **New Form**
4. Skopiuj ID formularza (np. `xwkgjklq`)
5. W pliku `src/App.jsx` znajdź linię:
   ```javascript
   fetch('https://formspree.io/f/YOUR_FORM_ID',
   ```
6. Zamień `YOUR_FORM_ID` na swój ID:
   ```javascript
   fetch('https://formspree.io/f/xwkgjklq',
   ```
7. Zapisz i wgraj zmianę na GitHub

---

### KROK 5: Połącz z Vercel

1. Wejdź na **vercel.com**
2. Kliknij **Sign Up** → **Continue with GitHub**
3. Zaloguj się kontem GitHub
4. Kliknij **Add New...** → **Project**
5. Znajdź repozytorium `toolkit-pro-shop` i kliknij **Import**
6. Zostaw domyślne ustawienia
7. Kliknij **Deploy**
8. Poczekaj ~1-2 minuty

🎉 **GOTOWE!** Twoja strona jest online pod adresem typu: `toolkit-pro-shop.vercel.app`

---

## 🔧 KONFIGURACJA

### Zmiana ceny produktu

W pliku `src/App.jsx` znajdź i zmień:
- `50 zł` - aktualna cena
- `83,50 zł` - przekreślona cena
- `33,50 zł` - oszczędność

### Zmiana danych kontaktowych

Dodaj w stopce swój email/telefon.

### Własna domena (opcjonalnie)

1. Kup domenę (np. na OVH, home.pl)
2. W Vercel: Settings → Domains → Add
3. Podaj swoją domenę
4. Skonfiguruj DNS według instrukcji Vercel

---

## 📧 JAK DZIAŁAJĄ ZAMÓWIENIA?

1. Klient wypełnia formularz na stronie
2. Dane lecą na Formspree
3. Ty dostajesz email z zamówieniem
4. Kontaktujesz się z klientem i wysyłasz paczkę

**Darmowy plan Formspree:** 50 zamówień/miesiąc

---

## ❓ PROBLEMY?

- **Strona nie działa**: Sprawdź czy wszystkie pliki są w repo
- **Formularz nie wysyła**: Sprawdź czy podmieniłeś YOUR_FORM_ID
- **Błędy przy deploy**: Sprawdź logi w Vercel Dashboard

---

## 💰 KOSZTY

- **GitHub**: darmowy
- **Vercel**: darmowy (do ~100GB transferu/mies)
- **Formspree**: darmowy (50 zamówień/mies)

**Razem: 0 zł/miesiąc** 🎉
