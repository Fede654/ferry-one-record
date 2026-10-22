# One record — a connected Vestmannaeyjar ferry

> **Concept material — not an official Herjólfur service.** Every screen is an example with invented data.
> It is an invitation to shape the idea with the operator, not a product being sold from outside.

**[Open the presentation](https://fede654.github.io/ferry-one-record/)** · [Íslenska](https://fede654.github.io/ferry-one-record/?lang=is)

The ferry is how the island reaches the mainland. Every day, the same question: is it sailing, from
which port, at what time? This presentation is about a ferry that answers it, and much more, in the
pocket of everyone who travels:

- **Residents** are told when their sailing moves and rebook with one tap, family and car already saved.
  The boarding pass follows the change.
- **Visitors** can manage the crossing alone, in plain words: today's port, a day on the island that
  fits the sailings, and a way out if the weather turns.
- **Everyone else** sees the board in their pocket and on the wall, at the terminal, in town and in
  hotel lobbies, in Icelandic, English and Polish.
- **Island businesses**, hotels, tours and shift planners read a reliable source instead of re-typing the news.
- **The operator** copies less on bad days, gives people fewer reasons to call the office, and keeps a record of every decision
  and how fast it reached people.

Once the ferry speaks to its passengers directly, more can travel with the news: cabins and berths
on the long route, the galley on board, check-in, deck space for cars and freight, island tours and
stays timed to the sailings.

## It starts with one record

None of that works if the answer is copied by hand into five places. So the first step is small and
concrete: **each sailing decision the master and the duty officer take is recorded once**, and
every channel reads that one record — the board, the notices, Facebook, bookings, partners on the
island. The decision stays human; only the copying by hand stops.

From there it grows one step at a time:

| | Step | What it adds |
|---|---|---|
| **1** | One record | The record and a short form for the duty officer, run beside today's routine and measured |
| **2** | Spreading the word | Departure board, notices in three languages, Facebook text, screens in town, an open feed for partners |
| **3** | Bookings that listen | The booking system the operator already uses reads the record: affected passengers are told and can move with one tap |
| **4** | Services on top | Resident accounts, check-in, berths and onboard extras, deck and freight, visitor mode, an app |

Nothing replaces the systems the operator already runs: the record sits beside them and connects to them.

## The presentation

Three short chapters, made to accompany a talk:

| | Chapter | What it shows |
|---|---|---|
| **A** | The problem | The same evening for a resident and two visitors: today, and with one record |
| **B** | The solution | Who gains, and the example screens of one example day |
| **C** | Data in the core | Play the duty officer: publish once, watch every channel follow; compare with today's way |

← → (or a swipe on a phone or tablet) moves through the pages; F11 for full screen. **EN | IS** at
the top switches the language for every page.

No build and no server: `index.html` also opens straight from the file system. The Icelandic is a
draft for review by a native speaker; it lives in one file, `i18n.is.js`, and
`node tools/i18n-check.cjs` (needs Playwright) lists any English it does not cover yet.

## Part of a longer piece of work

For some months we have been looking at the ferry from the passenger's side: where the answer gets
lost, and what would make the crossing easier to plan and to change. This presentation is one piece
of that work. An earlier one is a
**[booking flow mock](https://fede654.github.io/ferry-booking-flow-demo/)**: a booking that shows
availability first and never keeps a choice that is no longer true.

## Who is behind it

**Federico Bonino** — applied AI and automation consultant, living in Vestmannaeyjar.
[Website](https://fede654.github.io/) · [LinkedIn](https://linkedin.com/in/fede-azul)

Code under the MIT licence. 2026.
