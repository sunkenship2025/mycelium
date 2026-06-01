---
id: wv8pjhxjjrp5bnwlz2kznsg
title: Tutorial
desc: ""
updated: 1660931467392
created: 1659721741451
currentStep: 0
totalSteps: 0
---

Welcome to Mycelium! Mycelium is a developer-focused knowledge base that helps you manage information using **flexible hierarchies**!

You are currently in the tutorial vault (a vault is the folder where your notes are stored). Feel free to edit this note and create new files as you go through the quickstart!

## Create a Note

1. Use `Ctrl+L` / `Cmd+L` to bring up the **lookup prompt**
1. Type `mycelium` and select `Create New`

Congrats, you just **created your first note**! Notes in Mycelium are plain text markdown with [frontmatter](https://wiki.mycelium.so/notes/ffec2853-c0e0-4165-a368-339db12c8e4b) on top. You can edit them in Mycelium or using ~~vim~~ your favourite text editor.

> NOTE: You might have noticed that the tutorial preview has not changed - this is because it is currently `locked`. This keeps the preview from changing as you edit notes. We will teach you at the end how to unlock the preview.

## Find a Note

1. Use `Ctrl+L` / `Cmd+L` to bring up the **lookup prompt** again
1. Type `tutorial` and press `<ENTER>`
   > TIP: you don't have to type out the entire query, press `<TAB>` to autocomplete

You just **found a note**. We refer to both finding and creating of notes using the **lookup prompt** as performing a **lookup**.

## Organize your Notes

1. Mycelium has a custom [Tree View](https://wiki.mycelium.so/notes/hur7r6gr3kqa56s2vme986j) to view your notes. If it's not currently in focus, you can use `CTRL+SHIFT+P`/`CMD+SHIFT+P` to open the command prompt and type in [`Mycelium: focus on tree view`](command:mycelium.treeView.focus) to make it appear
1. **Lookup** `tutorial.one`. Notice that the Mycelium Tree View will correctly nest the `one` note under the `tutorial` note.

You just **created your first hierarchy**!
Hierarchies in Mycelium are just `.` delimited files. This makes each note both a file and a folder and makes it easy to keep your notes organized

## Create a link

1. In `tutorial.one`, type `[[` - this should trigger the autocomplete. You can type `den` to narrow it down to `mycelium` and hit enter

<div style="position: relative; padding-bottom: 64.5933014354067%; height: 0;"><iframe src="https://www.loom.com/embed/ef1cedcbf5394f14ae4b13afd1b6418a" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

You just **created a link**! If you hover your mouse over the link, you can get a preview of the contents inside the note!

> NOTE: the links with the `[[` are called wikilinks (because they were first popularized by Wikipedia)

## Navigate a link

1. Move your text cursor over the link you just created. Hold down `<CTRL>+<ENTER>`/`<CMD>+<ENTER>`

You just **navigated the link**! You can also use `CTRL+CLICK` or `CMD+CLICK` to navigate links via mouse.

## Rename a Note

1. Inside [[mycelium]], bring up the command prompt (`CTRL+SHIFT+P`/`CMD+SHIFT+P`) and type `Mycelium: Rename Note`
1. Replace [[mycelium]] with `my-note` and then press `<ENTER>`
1. Go back to [[tutorial.one]] - you should see the updated link!

You just **renamed a note**! When you rename a note, Mycelium updates all links and references of the original note.

Renaming is just one of the many ways you can [refactor](https://wiki.mycelium.so/notes/srajljj10V2dl19nCSFiC) your knowledge base - some other common use cases include [renaming headings](https://wiki.mycelium.so/notes/58rjapuyn1yjjcrf9sh6fby), [merging notes](https://wiki.mycelium.so/notes/nxarb351z0kfbl5mkw3arw6), and [renaming entire hierarchies using regex](https://wiki.mycelium.so/notes/9zwkp44wnlaa8p8dpt4w8tq).

## Unlock the Preview

To unlock, click the lock icon on the top right of the page or use the [Mycelium: Toggle Preview Lock](command:mycelium.togglePreviewLock) command. Now click on the editor again on a new page. You should see the preview change.

## Conclusion

Congrats, you finished the Mycelium tutorial!

Was there anything **unclear or buggy** about this tutorial? Please [**report it**](https://github.com/myceliumhq/mycelium/discussions/3266) so we can **make it better**!

## Next Steps

Depending on your needs, here are some common next steps:

- I want to **start writing**: [Create a daily journal note](command:mycelium.createDailyJournalNote) ([docs](https://wiki.mycelium.so/notes/ogIUqY5VDCJP28G3cAJhd))

- I want to **use templates**: Use the [Appy Template](https://wiki.mycelium.so/notes/ftohqknticu6bw4cfmzskq6) command to apply [templates](https://wiki.mycelium.so/notes/861cbdf8-102e-4633-9933-1f3d74df53d2) to existing notes

- I want to do a **longer tutorial**: Check out our [5min tutorial to explore more of Mycelium's functionality](https://wiki.mycelium.so/notes/678c77d9-ef2c-4537-97b5-64556d6337f1/)

- I want to **implement a particular workflow** (bullet journal, zettelkasten, etc): Check out community [workflow guides](https://wiki.mycelium.so/notes/9313b845-d9bf-42c9-aad1-0da34794ce26)

- I want to use Mycelium for **tasks and todos**: See the [Getting Things Done (GTD), Bullet Journaling, and Other Task Management Workflows](https://wiki.mycelium.so/notes/ordz7r99w1v099v14hrwgnp) for how the founder of Mycelium uses it to manage his work.

- I want to explore **advanced features**: See [next steps](https://wiki.mycelium.so/notes/TflY5kn29HOLpp1pWT9tP) for longer walkthroughs and advanced functionality!

- I want to start clean with a **new vault at a custom location**: Run [Mycelium: Initialize Workspace](command:mycelium.initWS) from the command prompt (or click this link) to start from a clean slate

- I want to use Mycelium as a **knowledge base for my team**: Read the [Mycelium team setup](https://wiki.mycelium.so/notes/98f6d928-3f61-49fb-9c9e-70c27d25f838) to get started

> Coming from Obsidian? Click [here](command:mycelium.importObsidianPod) to import your Obsidian notes (or any markdown notes) into Mycelium to see how they look.

## Community

Mycelium is more that just a tool - we are also a community of individuals that are passionate about knowledge management. If you need help or want to connect with the community, join us in the [Discords](https://link.mycelium.so/discord).

You can also:

- Star us on [GitHub](https://github.com/myceliumhq/mycelium)
- Follow us on [Twitter](https://twitter.com/myceliumhq)
- Subscribe to the [Mycelium Newsletter](https://link.mycelium.so/newsletter)
