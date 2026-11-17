# Dovanų idėjų organizatorius

Mokomasis internetinės programos projektas, skirtas dovanų progoms ir idėjoms tvarkyti.

## Ką galima daryti?

- Registruotis, prisijungti ir atsijungti.
- Kurti dovanų progas ir pridėti joms dovanų idėjas.
- Pasirinkti dovanos prioritetą: **skubu** arba **įprasta**.
- Redaguoti dovanos pavadinimą.
- Matyti tik savo duomenis.

## Naudotos technologijos

- **React + Vite + JavaScript** – programos sąsaja.
- **Supabase** – prisijungimas, duomenų bazė ir naudotojų duomenų apsauga (RLS – eilučių lygmens prieigos taisyklės).
- **Zapier** – dovanų registravimo automatizacija.
- **Gmail** – pranešimai apie skubias dovanas ir automatizacijos klaidas.
- **Google Sheets** – įprastų dovanų žurnalas.
- **GitHub** – programos kodas ir jo pakeitimų istorija.
- **Vercel** – viešai pasiekiama programa.
- **Notion** – projekto dokumentacija ir testavimo žurnalas.

## Kaip veikia automatizacija?

Sukūrus arba redagavus dovaną, **React** programa išsaugo pakeitimus **Supabase** ir atskirai siunčia užklausą į **Zapier**.

- Sukūrus naują dovaną, **skubiai** dovanai siunčiamas „Gmail“ pranešimas, o **įprasta** dovana įrašoma į „Google Sheets“.
- Redaguojant dovaną, „Zapier“ filtras sustabdo automatizaciją, todėl papildomas pranešimas ar žurnalo įrašas nekuriamas.
- Nepavykus išsiųsti skubaus pranešimo, klaidos apdorojimo šaka siunčia pranešimą apie klaidą.

**Svarbu:** tarp „Supabase“ ir „Zapier“ nėra tiesioginio ryšio – „Zapier“ užklausą siunčia „React“ programa.

## Projekto nuorodos

- [Veikianti programa („Vercel“)](https://dovanu-ideju-organizatorius.vercel.app)
- [Projekto dokumentacija („Notion“)](https://app.notion.com/p/415432c2b6c6811fb31fe9fc9f20000c)

Projektas parengtas mokymosi tikslais.
