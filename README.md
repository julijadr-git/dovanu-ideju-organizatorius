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

## Kaip paleisti projektą kompiuteryje?

1. Atsisiųskite projektą iš „GitHub“ ir atidarykite jo aplanką terminale.
2. Įdiekite reikalingus paketus:

```bash
npm install
```

3. Projekto pagrindiniame aplanke sukurkite failą `.env.local` ir įrašykite aplinkos kintamuosius **su savo reikšmėmis**:

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_ZAPIER_WEBHOOK_URL=
```

- `VITE_SUPABASE_URL` – jūsų „Supabase“ projekto adresas.
- `VITE_SUPABASE_PUBLISHABLE_KEY` – viešasis „Supabase“ projekto raktas.
- `VITE_ZAPIER_WEBHOOK_URL` – „Zapier“ automatizacijos užklausų adresas. Be jo dovanos išsaugomos, bet automatizacija neiškviečiama.

4. Paleiskite programą:

```bash
npm run dev
```

5. Terminale nurodytą vietinį adresą atidarykite naršyklėje.

**Pastaba:** veikimui reikia paruošto „Supabase“ projekto su autentifikacija, lentelėmis `occasions` ir `gifts` bei jų RLS prieigos taisyklėmis. „Zapier“ automatizacija veikia tik tada, kai ji paskelbta ir aktyvi. Tikrų kintamųjų reikšmių ir slaptų raktų į „GitHub“ nekelkite.

## Projekto nuorodos

- [Veikianti programa („Vercel“)](https://dovanu-ideju-organizatorius.vercel.app)
- [Projekto dokumentacija („Notion“)](https://app.notion.com/p/415432c2b6c6811fb31fe9fc9f20000c)

Projektas parengtas mokymosi tikslais.
