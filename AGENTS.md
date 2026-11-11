# Darbo taisyklės

## 1. Darbo aplinka

- Dirbk tik `/Users/julia/dovanu-ideju-organizatorius` aplanke.
- Gali savarankiškai kurti ir redaguoti projekto failus bei vykdyti įprastas programavimo ir testavimo komandas.
- Nekeisk kitų projektų ar sisteminių failų.

## 2. Projekto technologijos

- React + Vite + JavaScript (be TypeScript).
- Supabase: naudotojų registracija, prisijungimas, dvi susijusios lentelės ir RLS.
- GitHub: šakos ir bent 3 Pull Request.
- Vercel: programos diegimas.
- Zapier: Webhook → Filter → Paths → Gmail.
- Notion ir README: dokumentacija.

## 3. Projekto architektūra

- Lentelė `occasions`: `id`, `user_id`, `name`, `created_at`.
- Lentelė `gifts`: `id`, `occasion_id`, `user_id`, `title`, `priority`, `created_at`.
- `priority` reikšmės: `high` ir `normal`.
- Kiekvienas naudotojas gali matyti ir keisti tik savo duomenis.
- Supabase tiesiogiai nejungiama su Zapier.
- Po sėkmingo dovanos sukūrimo (`INSERT`) ir po sėkmingo jos redagavimo (`UPDATE`) React siunčia HTTP užklausą į Zapier Webhook.
- Zapier Filter praleidžia `INSERT` ir sustabdo `UPDATE`.
- Paths siunčia Gmail laišką tik tada, kai naujos dovanos prioritetas `high`.
- Saugumo sumetimais neperduok prieigos raktų ir kitų jautrių duomenų į Zapier.

## 4. Darbo taisyklės

- Prieš pradėdamas užduotį trumpai paaiškink, ką ketini daryti.
- Vienu metu vykdyk tik aiškiai pateiktą užduotį. Nepradėk kitų projekto etapų savarankiškai.
- Gali savarankiškai vykdyti įprastas tos užduoties komandas be papildomo patvirtinimo.
- Prieš trindamas failus, keisdamas architektūrą, atlikdamas Git `commit`, `push`, `merge`, `reset` ar `rebase` veiksmus, paprašyk mano patvirtinimo.
- Prieš keisdamas esamą failą, patikrink jo turinį ir nekeisk su užduotimi nesusijusių dalių. Nekurk papildomų failų, jei jų nereikia konkrečiai užduočiai.
- Jei reikalavimai neaiškūs ar prieštaringi, pirmiausia paklausk. Nedaryk prielaidų.
- Baigęs išvardyk pakeistus failus, atliktus testus ir jų rezultatus.
