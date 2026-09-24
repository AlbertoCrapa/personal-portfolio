# Questions to answer before writing a project or a post

`CONTENT-GUIDE.md` = how to lay a page out.
This file = what to answer before you lay anything out.

Answer these in a scratch file, in plain sentences, the way you would say them
to a person sitting next to you. Do not try to write well. When you are done
you will have more material than fits, and choosing what to cut is a much
easier job than staring at an empty section called "Technical Implementation".

Each question says what it is for and what part of the page it becomes.

---

## 1. The basics — answer these first, every time

**What is it? One sentence, no jargon.**
This becomes your `lead`. If you cannot do it in one sentence, you do not yet
know what the project is.
- Good: "A shared list where you and your friends track the films, books and
  games you are all getting through."
- Weak: "A full-stack web application built with Next.js and Supabase."

**Who is it for?**
Name a real person or a real group. "Users" is not an answer.

**What was annoying enough to make you build it?**
The problem, in the form it had before you knew any solution. This is almost
always the best opening paragraph you have.

**What does it do that the alternatives do not?**
If you used something existing and it was fine, say that too — it makes the
parts you did build more believable.

**How long did it take, and how many people?**
Both numbers, plainly. If six people, say who did what.

**Is it finished? Is it online? Can someone use it right now?**
Answer this somewhere on the page. Readers always wonder and the pages
currently never say.

**What is it built with, and why that?**
The "why" is the half that matters. "Unity, because I needed 2D physics and
had shipped in it before" beats a list of logos.

---

## 2. Numbers — write down every one you know

You have these in your head and none of them are on the site. They take one
line of JSON as a `stats` block and they make everything else believable.

**How many of the main thing?**
Levels, cards, screens, tables, enemies, endpoints, assets.

**How long did it take?**
In months, or in the unit that actually hurt.

**How big is it?**
Build size, bytes on the NFC tag, rows in the biggest table, triangles on
screen, number of files.

**How fast is it, and how fast was it before you fixed it?**
Frame rate, load time, build time. The before-and-after pair is worth more
than either number alone.

**How many people used it, played it, tested it, bought it?**
Even if the answer is small. "Twelve playtest groups" is a real number.
"Positive reception" is not.

**What did it cost to run or to make?**
Hosting per month, print run cost, asset store purchases.

---

## 3. The hard part — this is the section people actually read

Pick the two or three things that were genuinely difficult. For each one:

**What was the problem, in one sentence?**
Write it before you write the solution. Readers cannot follow a solution to a
problem they have not been shown.

**What did you try first?**
The failed attempt is what makes the working one interesting. Without it the
solution reads as something you just happened to know.

**Why did it not work?**
Be specific. "It was slow" is not specific. "Every enemy raycast ran every
frame, so 30 enemies meant 30 raycasts at 60fps" is.

**What did you do instead, and how does it work?**
Explain it so someone who does not know your engine can follow. If you can,
show twenty lines of the real code — not the whole file, the interesting part.

**How do you know it worked?**
A number, a screenshot, a playtester's reaction. Something other than your
own word.

**What is still not great about it?**
One honest limitation makes the rest of the page more trustworthy, not less.

---

## 4. Decisions — the part a studio reads closely

**Name three choices where you could reasonably have gone the other way.**
Engine, architecture, data model, art pipeline, scope.

For each of the three:

**What did you pick, and what was the other option?**

**Why did you pick it?**
In one sentence, no hedging.

**What did that choice cost you?**
Every real decision costs something. If yours cost nothing, it was not a
decision, it was a default.

**Which one did you get wrong?**
Say which, say when you noticed, say what you did about it.

---

## 5. What broke

There is currently no failure anywhere on this site, which makes every page
read like a brochure.

**What bug took the longest to find?**
What did you think it was, before you knew what it was?

**What broke right before a deadline or a demo?**

**What did a player or a user do immediately that you never considered?**
Quote them if you remember the words.

**What did you throw away and rebuild?**

**What is still broken that you know about?**
This goes in a `callout` with `variant: "warning"`. It reads as confidence,
not weakness.

---

## 6. Other people

**Who else worked on this, by name, and what did they do?**

**What did you have to explain to someone non-technical, and how did you
explain it?**
The analogy that worked on them will work on your reader too.

**What did you and someone else disagree about, and how did it end?**

**What is the best or most useful feedback you got?**
Word for word if you have it — that is a `quote` block.

**What did the client or the stakeholder ask for, and what did they actually
need?**
Only for the client work, but it is the most valuable question on this list
for freelance projects.

---

## 7. Images — one question per piece of media

**What does it look like?**
If your project has no images, this is the most important question on the
page. Four of your eight projects have none.

**For each image: what should the reader look at?**
That sentence is the caption. If you cannot write it, the image is decoration
and should be cut.

**Is there a before and after?**
Broken and fixed, prototype and final, editor and game. That is a `compare`
block and it is the most convincing image type you have.

**Is there a debug view?**
The thing the player never sees — hitboxes, AI vision cones, the profiler,
the node graph. For a technical reader this is worth three paragraphs.

**Do you have three or more images of the same thing?**
That is a `gallery`, not three separate figures.

---

## 8. The ending

Do not write "Learning Outcomes". It appears five times on the site and it
reads like a school assignment.

**What do you do differently now, on every project, because of this one?**

**What could you attempt next, because you had done this?**

**What would you tell yourself on day one?**
Three or four of these is a `takeaways` block.

**Where is it now?**
Still live, abandoned, still played, sitting in a drawer. One sentence, at the
end, always.

---

## 9. Read your draft back and check

Short, blunt, yes-or-no:

- Does the first paragraph say what the thing **is**, before it says how it
  was built?
- Can a reader tell what **you** did versus what the team did, in every
  section?
- Is every abbreviation explained the first time — ALS, FMOD, RLS, NFC, RAWG?
- Is there at least one number on the page?
- Is there at least one image, with a caption that says what to look at?
- Does any section make a claim it does not back up?
- Does the page say whether the project is finished and where to see it?
- Read only the headings. Do they tell the story on their own?
- Does any heading just name a topic ("My Role", "Technical Implementation")
  instead of saying something?
- Is there anything on the page you would be bored reading in someone else's
  portfolio?

---

## What each answer becomes

| Your answer | Goes in |
|---|---|
| One-sentence description of the project | `lead` |
| The problem before the solution | first paragraph of a section |
| A number | `stats` |
| Something the reader would get wrong | `callout` `warning` |
| Background the reader may not have | `callout` `info` |
| A side story you cannot drop | `aside` |
| Someone's exact words | `quote` with `cite` |
| Your sharpest sentence | `quote` without `cite` |
| Twenty interesting lines of code | `code` with `filename` |
| What it looks like | `figure` + a caption saying what to look at |
| Three or more images | `gallery` |
| Broken/fixed, before/after | `compare` |
| What you would tell yourself on day one | `takeaways` |

---

## 10. Specific questions for what is on the site right now

These are the things your existing text raises and then drops. A reader
notices every one of them.

### `deadly-nightshade`
695 words across 11 headings — about 60 words each, so nothing is explained.

- Six people, eight months: who were the other five, and what did each do?
- The spawn system "changes based on what's happening in the environment" —
  what does it read to decide that?
- The final boss "targets specific spots for jump attacks" — how does it pick
  the spot?
- Enemies have sight and hearing: what are the ranges and the angles?
- What does one dialogue entry look like as data?
- The tools you built: what did people do before them, and how long did it
  take?
- What forced you into level streaming — what was the memory number?
- It was a thesis. What mark did it get, and did anyone outside the course
  play it?
- You directed voice actors. Nobody else's portfolio has that. What happened
  in that room?
- Merge the 11 headings into 5 or 6 and let the good ones run long.

### `juan-game`
- Why a horse? Where did the idea come from? That is your opening and it is
  missing.
- Did it ship? Where? How many downloads?
- You said you redesigned levels after feedback. Which level, what was wrong
  with it, what did it become?
- 60 levels by hand — how long did one take, and did you build a tool partway
  through?
- What did the first control scheme look like, and why did you change it?

### `echoes-tablegame`
A physical printed game with no photograph of it anywhere. Biggest gap on the
site.

- Photograph the cards, the box, a game in progress.
- Describe one full turn, start to finish. Nobody could play it from the page
  as written.
- How many playtests, with how many people, over how long?
- Which rule did you cut, and what went wrong when it was in?
- Who printed it, what did it cost, how many copies, what came back wrong?
- "User reception and validation" — who said what?
- Can anyone buy it or print it?

### `too-poop-to-go`
- Say what the app does in the first sentence. The title is a joke and the
  premise is never actually stated.
- Which map provider, and why?
- Why does anything need approval — what happens without it?
- Who was on the team and what did you own?
- Did it launch? Did anyone submit a real report?

### `friend-archive`
Best-written project, one screenshot.

- Screenshot the group view, an item page, the add flow.
- Show one RLS policy. It is four lines of SQL and it is the strongest
  evidence in the whole project.
- Show the schema before and after you moved status to per-member.
- Six months — what took the longest?
- How many groups and people use it now?
- What broke in production that never broke locally?
- Which query did you have to rewrite for the free tier? Show both versions.

### `sudoku-nfc`
- Record a video of a tag being tapped and the puzzle appearing. Without it
  the reader cannot picture the project at all.
- Why NFC instead of just an app with a list of puzzles?
- How many bytes does a tag hold, and how many did your encoding need? That
  one comparison is the entire project.
- The three generation methods: what is each one good for?
- Show the encoding.
- Did anyone but you ever play it?

### `ar-ipad-experience` (NDA)
- What can you say — what kind of client, what kind of venue, how many users?
- Why the tracking approach you chose over the other one?
- What frame rate did you target, what did you start at, and what did you cut?
- Triangle and texture budgets per asset.
- What does the app do when tracking is lost? Every AR reader wants this.

### `cross-platform-content-app` (NDA)
- What is it for? One sentence, at the top.
- Which platforms, and what specifically broke between them?
- Why Firebase, and what would have happened at ten times the scale?
- What is the one cross-platform bug you will still remember in five years?

### `building-controller-aim-assist`
Best-structured post. Missing the two things that would sell it.

- A clip with the assist off, then on.
- The actual C++. It is a post about a C++ rewrite with no C++ in it.
- Why rewrite from Blueprints — what was the measured cost?
- A picture of the curves.
- What values feel right, and what does too much assist feel like?

### `developers-heaven-hollow-knight-silksong`
- What decision of your own did this change? Name the project.
- What do you envy that you cannot have, and what could you have but have not
  taken?
- Where do you disagree with them? Without that it is a review, not an
  opinion.

### `implementing-als-deadly-nightshade`
- What went wrong that made ALS necessary? Open there, not at "Step 1".
- Which step took four times longer than expected, and what was the error?
- Show the C++ you customised.
- Show one broken retarget next to the fixed one.
- Would you use ALS again? Straight answer.

---

## The order to work in

1. Answer sections 1 and 2 for the project. Twenty minutes, plain sentences.
2. Answer section 3 for the two hardest things you built.
3. Answer whichever of 4–6 you have real material for. Skip the rest.
4. Write each answer as a paragraph, with no heading yet.
5. Add headings last. Make each one say something, not name a topic.
6. Go through your images. Caption or cut.
7. Read only the lead, the headings and the captions. If that alone tells the
   story, the page is done.

## If you only do five things

1. Photograph `echoes-tablegame`, record `sudoku-nfc`. Two projects are
   currently invisible.
2. Add a one-paragraph `lead` to all eight projects.
3. Replace every "Learning Outcomes" and "My Role" heading with one that says
   something.
4. Add one `stats` block per project. You already know the numbers.
5. Add one `code` block to each technical project.
