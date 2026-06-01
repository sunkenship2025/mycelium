---
id: mycf53kz1r7swcttcobwbdl
title: Taking Notes
desc: ""
updated: 1653980773142
created: 1652278083208
currentStep: 2
totalSteps: 5
nav_order: 1
---

### Create a Note

To create a note, use `Cmd / Ctrl + L` to bring up Mycelium's lookup. This is a shortcut for the `Mycelium: Lookup Note` command.

> 💡 The lookup command is the main way to interact with Mycelium. It is used for both looking up your notes and creating new notes. When you do a lookup on a note that hasn't been created, Mycelium will create it for you. Remember the `Cmd / Ctrl + L` shortcut.

> 🌱 Try it yourself - bring up the lookup bar with `Cmd / Ctrl + L`. Type `recipes` and hit Enter. Afterward, you can use the `Ctrl + Tab` shortcut to get back to this note.
> This should have created a note named `recipes.md`. Notes in Mycelium are just plaintext markdown. They live in your file system and are portable across any platform, which makes it very easy to import/ export your notes and even to publish your notes to a hosted website. You can try to add some content to the body of your `recipes` note now.

The --- section at the top of each note is frontmatter. Frontmatter are custom attributes at the top of each markdown file. Mycelium uses it to store metadata about each note for features like publishing. Don't modify the id attribute on the front matter.

### Creating a hierarchy

Mycelium uses flexible hierarchies to help you organize your notes. It's how people are able to manage tens of thousands of notes inside Mycelium.

> 🌱 To create a hierarchy, bring up lookup again `(Cmd / Ctrl + L)`. Type `recipes.vegetarian` and then press enter.
> You have now created your first hierarchy. Hierarchies in Mycelium are created by having a `.` delimiter in the file name. Take a look at the tree view in the side panel to see that the `vegetarian` note exists under the `recipes` hierarchy. You can also see in the Workspace panel that the note file is stored as `recipes.vegetarian.md`.

You can create a hierarchy at any level:

> 🌱 Type the following into lookup and hit enter: `recipes.italian.desserts.tiramisu`
> You'll notice in the tree view that there is now a `+` sign next to `italian` and `desserts`. The plus sign indicates that this note is a stub. A stub is a placeholder for a note that hasn't actually been created. Mycelium uses stubs to avoid cluttering your file system with empty notes when creating hierarchies.

![Tree View](https://org-mycelium-public-assets.s3.amazonaws.com/images/tutorial-tree-view.png)

Following this recipes example, you can try creating other notes that might be relevant. Some examples:

- `recipes.italian.appetizers`
- `recipes.chinese`
- `recipes.chinese.appetizers`
- `recipes.ingredients.favorites`
- `recipes.ingredients.shopping-list`

Hierarchies are flexible, and you can create them in whichever way works best for you. Mycelium allows you to easily change the hierarchies later if you change your mind on how to organize your notes.

### Finding Notes

To find notes, we use the same lookup interface that we used to create them.

> 🌱 Open Lookup, and type `vege`. This will find your `recipes.vegetarian` note. Hit `Enter` to open that note.
> The lookup uses fuzzy search which means you can type out partial results and still see the results. Searching with \* wildcards is also supported.

When combined with hierarchies, this fast lookup system enables you to find your notes very quickly, even if you have thousands of notes in your vaults.

If you want to search for content within the notes, you can use VS Code's built-in search tools with `Cmd / Ctrl + Shift + F`.

### Meeting Notes

Mycelium also has a few built-in note types. For example, if you find yourself taking meeting notes often, you can use the `Mycelium: Create Meeting Note` command to create a note with a pre-built template for meetings. Try it out!

### Next Steps

- Tutorial Step 3: [[Linking Your Notes|tutorial.linking-notes]]

---

[[Tutorial Home Page| tutorial]]
