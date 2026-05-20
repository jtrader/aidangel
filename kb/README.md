# Knowledge Base

Plain-text source for the First Aid Angel knowledge base, adapted from the **Australian First Aid 5th Edition** (AFA5) manual by St John Ambulance Australia.

Each `.md` file in this directory is one topic. The chat assistant cites the section name in brackets (e.g. `(AFA5 — Burns)`) and the app turns that into a link to the matching topic page at `/kb/<slug>`.

The authoritative metadata index is `_meta.json`.

## How to add a new topic

1. Add a new file `kb/<slug>.md` — first line `# Title`, second paragraph short summary, then full content.
2. Add an entry to `_meta.json` with `slug`, `title`, `category`, `section` (the AFA5 section name used in chat citations), `summary`, `keywords` and `related`.
3. The KB pages and chat hyperlinks pick it up automatically on the next build.

## Source

Australian First Aid 5th Edition — St John Ambulance Australia. Always seek professional medical advice in an emergency and call **000**.
